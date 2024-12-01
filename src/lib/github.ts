import { db } from '@/server/db';
import {Octokit} from 'octokit'
import axios from 'axios'
import { aiSummariseCommit } from './gemini';

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string
}

export const getCommitHashes = async (url: string) => {
  const [owner, repo] = url.split("/").slice(-2)
  console.log(owner, repo)
  if (!owner || !repo){
    throw new Error("Invalid github url")
  }

  const {data} = await octokit.rest.repos.listCommits({
    owner,
    repo
  })

  const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

  return sortedCommits.slice(0, 5).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author.date ?? ""
  }))
}

async function summariseCommit(githubUrl: string, commitHash: string){
  const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff'
    }
  })
  return await aiSummariseCommit(data) || ""
}

export async function pollCommits(projectId: string) {
  const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
  const commitHashes = await getCommitHashes(githubUrl)
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash)
    })
  )

  const summaries = summaryResponses.map((response) => {
    if (response.status === 'fulfilled'){
      return response.value as string
    }
    return ""
  })
  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`processing commit ${index}`)
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary
      }
    })
  })
  return commits
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){
  const processedCommits = await db.commit.findMany({
    where: {projectId}
  })

  const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))

  return unprocessedCommits
}

async function fetchProjectGithubUrl(projectId: string){
  const project = await db.project.findUnique({
    where: {id: projectId},
    select: {
      githubUrl: true
    }
  })
  console.log(project)
  if (!project?.githubUrl) {
    throw new Error("Project has no github URL")
  }
  return {project, githubUrl: project.githubUrl}
}