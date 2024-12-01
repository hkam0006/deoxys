'use client'

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const CommitLog = () => {
  const {projectId, project} = useProject()
  const {data: commits} = api.project.getCommits.useQuery({projectId})
  return (
    <>
      <ul className='space-y-4'>
        {commits?.map((commit, commitIdx) => {
          return <li key={commit.id} className='relative flex gap-x-4'>
            <div className={cn(
              commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}>
              <div className="w-px translate-x-1 bg-white"></div>
            </div>

            <>
              <img src={commit.commitAuthorAvatar} alt='commit avatar' className='relative mt-4 size-8 flex-none rounded-full'/>
              <div className='flex-auto rounded-md bg-black p-3 ring-1 ring-inset ring-slate-500'>
                <div className='flex justify-between gap-x-4'>
                  <Link target='_blank' href={`${project?.githubUrl}/commit/${commit.commitHash}`} className='py-0.5 text-xs text-gray-500'>
                    <span className='font-medium text-white'>
                      {commit.commitAuthorName}
                    </span> {" "}
                    <span className='inline-flex items-center text-yellow-400'>
                      committed
                      <ExternalLink className='ml-1 size-4'/>
                    </span>
                  </Link>
                </div>
                <span className='font-semibold'>
                {commit.commitMessage}
              </span>
              <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                {commit.summary}
              </pre>
              </div>
            </>
          </li>
        })}
      </ul>
    </>
  )
}

export default CommitLog
