'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormInput = {
  repoUrl: string
  projectName: string
  githubToken?: string
}

const CreatePage = () => {
  const {register, handleSubmit, reset} = useForm<FormInput>()

  const onSubmit = (data: FormInput) => {
    window.alert(JSON.stringify(data))
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
        <div className='h-4'></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('repoUrl', {required: "true"})} required placeholder='Project Name'/>
            <div className='h-4'/>
            <Input {...register('repoUrl', {required: "true"})} required placeholder='Github Repository URL' type='url'/>
            <div className='h-4'/>
            <Input {...register('githubToken')} placeholder='Github Token (Optional)'/>
            <div className='h-4'/>
            <Button type='submit'>Check credits</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
