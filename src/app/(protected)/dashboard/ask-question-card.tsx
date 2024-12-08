'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTitle, DialogHeader, DialogContent } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const AskQuestionCard = () => {
  const {project} = useProject()
  const [question, setQuestion] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileReferences, setFileReferences] = useState<{fileName: string; sourceCode: string; summary: string;}[]>([])
  const [answer, setAnswer] = useState("")
  const saveAnswer = api.project.saveAnswer.useMutation()
  const refetch = useRefetch()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer('')
    setFileReferences([])
    e.preventDefault()
    if (!project?.id) return
    setLoading(true)
    const {output, fileReferences} = await askQuestion(question, project.id)
    setOpen(true)
    setFileReferences(fileReferences)

    for await (const delta of readStreamableValue(output)){
      if (delta){
        setAnswer(ans => ans += delta)
      }
    }
    setLoading(false)
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[80vw]'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <DialogTitle>
              Deoxys: {question}
            </DialogTitle>
            <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => {
              saveAnswer.mutate({
                projectId: project!.id,
                question,
                answer,
                fileReferences
              }, {
                onSuccess: () => {
                  toast.success("Answer saved")
                  refetch()
                },
                onError: () => {
                  toast.error("Failed to save answer!")
                }
              })
            }}>Save Answer</Button>
          </div>
        </DialogHeader>
        
        <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll' />
        <div className='h-4'/>
        <CodeReferences fileReferences={fileReferences}/>
        <Button onClick={() => setOpen(false)} >Close</Button>
      </DialogContent>
    </Dialog>
      <Card className='relative col-span-3 ring-1 ring-inset ring-slate-500'>
        <CardHeader>Ask a question</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)} 
              placeholder='Which file should I edit to change the home page?'
            /> 
            <div className='h-4'/>
            <Button type='submit' disabled={loading}>
              Ask Deoxys
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard
