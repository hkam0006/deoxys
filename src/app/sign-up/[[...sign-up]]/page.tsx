import React from 'react'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex justify-center items-center h-screen bg-zinc-800'>
      <SignUp />
    </div>
)}