import { db } from '@/server/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: Promise<{projectId: string}>
}

const JoinHandler = async ({params}: Props) => {
  const {projectId} = await params
  const {userId} = await auth()
  if (!userId) return redirect("/sign-in")
  const dbUser = await db.user.findUnique({
    where: {
      id: userId
    }
  })
  
  const project = await db.project.findUnique({
    where: {
      id: projectId
    }
  })

  if (!project) return redirect("/dashboard")

  try {
    await db.userToProject.create({
      data: {
        userId,
        projectId
      }
    })
  } catch( err) {
    console.log("user already in project")
  }

  return redirect('/dashboard')
}

export default JoinHandler