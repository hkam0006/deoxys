import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbeddings, summariseCode } from './gemini'
import { db } from '@/server/db'
import { Octokit } from 'octokit'

const getFileCount = async (
  path: string, 
  octokit: Octokit, 
  githubOwner: string, 
  githubRepo: string, 
  acc: number = 0
) => {
  const {data} = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path
  })
  if (!Array.isArray(data) && data.type === 'file'){
    return acc + 1
  }
  if (Array.isArray(data)){
    let fileCount = 0
    const directories : string[] = []
    for (const item of data){
      if (item.type === 'dir'){
        directories.push(item.path)
      } else {
        fileCount++
      }
    }
    if (directories.length > 0){
      const directoryCounts = await Promise.all(
        directories.map(dirPath => getFileCount(dirPath, octokit, githubOwner, githubRepo, 0))
      )
      fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
    }
    return acc + fileCount
  }
  return acc
}

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octokit = new Octokit({auth: githubToken})
  const githubOwner = githubUrl.split('/')[3]
  const githubRepo = githubUrl.split('/')[4]
  if (!githubOwner || !githubRepo){
    return 0
  }
  
  const fileCount = await getFileCount('', octokit, githubOwner, githubRepo,0)
  return fileCount
}

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || '',
    branch: 'main',
    ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5
  })

  const docs = await loader.load()
  return docs
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
  const docs = await loadGithubRepo(
    githubUrl,
    githubToken
  )

  const allEmbeddings = await generateAllEmbeddings(docs)

  await Promise.allSettled(allEmbeddings.map(async (result, index) => {
    console.log(`processing ${index} of ${allEmbeddings.length}`)
    if (!result) return
    const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
      data: {
        summary: result.summary,
        sourceCode: result.sourceCode,
        fileName: result.fileName,
        projectId
      }
    })

    await db.$executeRaw`
    UPDATE "SourceCodeEmbedding"
    SET "summaryEmbedding" = ${result.embedding}::vector
    WHERE "id" = ${sourceCodeEmbedding.id}
    `
  }))
}

const generateAllEmbeddings = async (docs: Document[]) => {
  return await Promise.all(docs.map(async (doc) => {
    const summary = await summariseCode(doc)
    const embedding = await generateEmbeddings(summary)
    return {
      summary,
      embedding,
      sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
      fileName: doc.metadata.source
    }
  }))
}

// Document {
//   pageContent: "import { createTheme } from \"@mui/material\";\n\nconst theme = createTheme({\n  palette: {\n    mode: \"dark\",\n    background: {\n      default: '#1D1F26'\n    },\n    primary: {\n      main: '#ffea61'\n    }\n  },\n  typography: {\n    fontFamily: 'Lato, sans-serif',\n    button: {\n      textTransform: \"unset\",\n      fontWeight: 700\n    }\n  }\n})\n\nexport default theme;",
//   metadata: {
//     source: "splitbuddy/src/theme/theme.tsx",
//     repository: "https://github.com/hkam0006/SplitBuddy_TS",
//     branch: "main",
//   },
//   id: undefined,
// }