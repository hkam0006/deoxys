'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
  repoUrl: string
  projectName: string
  githubToken?: string
}

const CreatePage = () => {
  const {register, handleSubmit, reset} = useForm<FormInput>()
  const createProject = api.project.createProject.useMutation()

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
        name: data.projectName
      }, {
        onSuccess: () => {
          toast.success("Project created successfully")
          reset()
        },
        onError: () => {
          toast.error("Failed to create the project")
          reset()
        }
    })
    return true
  }

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <div>
        <div>
          <h1 className='font-semibold text-2xl'>
            Link your GitHub Repository
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter the URL of your repository to link it to Deoxys
          </p>
        </div>
        <div className='h-4' />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('projectName', {required: "true"})} required placeholder='Project Name'/>
            <div className='h-4'/>
            <Input {...register('repoUrl', {required: "true"})} required placeholder='Github Repository URL' type='url'/>
            <div className='h-4'/>
            <Input {...register('githubToken')} placeholder='Github Token (Optional)'/>
            <div className='h-4'/>
            <Button type='submit' disabled={createProject.isPending}>Check credits</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
