'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { api, RouterOutputs } from '@/trpc/react'
import { VideoIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
  meetingId: string
}

const IssueList = ({meetingId}: Props) => {
  const {data: meeting, isLoading} = api.project.getMeetingById.useQuery({meetingId}, {
    refetchInterval: 4000
  })

  if (isLoading || !meeting) return <div>Loading...</div>

  return (
    <>
      <div className='p-8'>
        <div className='mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none'>
          <div className='flex items-center gap-x-8'>
            <div className='rounded-full border p-3 border-slate-500'>
              <VideoIcon className='h-6 w-6'/>
            </div>
            <h1>
              <div className='text-sm leading-6 text-gray-600'>
                Meeting on {""}{meeting.createdAt.toLocaleDateString()}
              </div>
              <div className='mt-1 text-base font-semibold loading-6 text-white'>
                {meeting.name}
              </div>
            </h1>
          </div>
        </div>

        <div className='h-4'/>
        <div className='grid grid-cols-1 gap-2 lg:grid-cols-3'>
          {meeting.issues.map(issue => (
            <IssueCard key={issue.id} issue={issue}/>
          ))}
        </div>
      </div>
    </>
  )
}

function IssueCard({issue}: {issue: NonNullable<RouterOutputs['project']['getMeetingById']>['issues'][number]}){
  const [open, setOpen] = useState(false)
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>{issue.gist}</DialogHeader>
          <DialogDescription>{issue.createdAt.toLocaleDateString()}</DialogDescription>
        </DialogHeader>
        <p >
          {issue.headline}
        </p>
        <blockquote className='mt-2 borrder-gray-300 bg-black p-4 ring-1 ring-inset ring-slate-500 rounded-xl'>
          <span className='text-sm text-gray-600'>
            {issue.start} - {issue.end}
          </span>
          <p className='font-medium italic leading-relaxed text-white'>
            {issue.summary}
          </p>
        </blockquote>
      </DialogContent>
    </Dialog>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>
            {issue.gist}
          </CardTitle>
          <div className='border-b'/>
          <CardDescription>
            {issue.headline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)}>
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default IssueList