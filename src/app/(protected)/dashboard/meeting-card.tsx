'use client'

import { Card } from '@/components/ui/card'
import {useDropzone} from 'react-dropzone'
import React, { useState } from 'react'
import { uploadFile } from '@/lib/firebase'
import { Presentation, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const MeetingCard = () => {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const uploadingMeeting = api.project.uploadMeeting.useMutation()
  const router = useRouter()
  const {project} = useProject()
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async acceptedFile => {
      if (!project) return
      setIsUploading(true)
      const file = acceptedFile[0]
      if (!file) return
      const downloadUrl = await uploadFile(file as File, setProgress) as string
      uploadingMeeting.mutate({
        projectId: project.id,
        meetingUrl: downloadUrl,
        name: file?.name
      }, {
        onSuccess: () => {
          toast.success("Meeting uploaded successfully")
          router.push('/meetings')
        },
        onError: () => {
          toast.error("Failed to upload meeting")
        }
      })
      window.alert(downloadUrl)
      setIsUploading(false)
    }
  })
  return (
    <Card className='col-span-2 flex flex-col items-center p-10 justify-center ring-1 ring-inset ring-slate-500' {...getRootProps()}>
      {!isUploading && (
        <>
          <Presentation  className='h-10 w-10 animate-bounce'/>
          <h3 className='mt-2 text-sm font-semibold text-white'>
            Create a new meeting
          </h3>
          <p className='mt-1 text-center text-sm text-gray-500'>
            Analyse your meeting with Deoxys.
            <br />
            Powered by AI.
          </p>
          <div className='mt-6'>
            <Button disabled={isUploading}>
              <Upload className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true'/>
              Upload Meeting
              <input className='hidden' {...getInputProps()}/>
            </Button>
          </div>
        </>
      )}

      {isUploading && (
        <div>
          <CircularProgressbar value={progress} text={`${progress}`} className='size-20' styles={
            buildStyles({
              pathColor: 'white',
              textColor: 'white'
            })
          }/>
          <p className='text-sm text-white text-center'>Uploading your meeting...</p>
        </div>
      )}
    </Card>
  )
}

export default MeetingCard