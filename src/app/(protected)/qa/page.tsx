'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'

const QAPage = () => {
  const {projectId} = useProject()
  const {data: questions} = api.project.getQuestions.useQuery({projectId})

  const [questionIndex, setQuestionIndex] = useState(0)
  const question = questions?.[questionIndex]

  return (
    <Sheet>
      <AskQuestionCard />
      <div className='h-4'/>
      <h1 className='text-xl font-semibold'>Saved Questions</h1>
      <div className='h-2'/>
      <div className='flex flex-col gap-2'>
        {questions?.map((q, index) => {
          return <React.Fragment key={q.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div className='flex items-center gap-4 bg-black rounded-lg p-4 shadow border ring-1 ring-inset ring-slate-500'>
                <img className='rounded-full' height={30} width={30} src={q.user.imageUrl ?? ""}/>

                <div className='text-left flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <p>
                      {q.question}
                    </p>
                    <span className='text-xs text-gray-400 whitespace-nowrap'>
                      {q.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-gray-500 line-clamp-1 text-sm'>
                    {q.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        })}
      </div>

      {question && (
        <SheetContent className='sm:max-w-[80vw] overflow-y-scroll'>
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown source={question.answer}/>
            <CodeReferences fileReferences={(question.fileReferences ?? [])as any}/>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QAPage
