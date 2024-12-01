'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTitle, DialogHeader, DialogContent } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'

const AskQuestionCard = () => {
  const {project} = useProject()
  const [question, setQuestion] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileReferences, setFileReferences] = useState<{fileName: string; sourceCode: string; summary: string;}[]>([])
  const [answer, setAnswer] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!project?.id) return
    e.preventDefault()
    setLoading(true)
    setOpen(true)

    const {output, fileReferences} = await askQuestion(question, project.id)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Deoxys: {question}
          </DialogTitle>
        </DialogHeader>
        {answer}
        {fileReferences.map(file => {
          return <span>{file.fileName}</span>
        })}
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
            <Button type='submit'>
              Ask Deoxys
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard
