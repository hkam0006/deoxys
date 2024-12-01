'use server'
import {streamText} from 'ai'
import {createStreamableValue} from 'ai/rsc'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import { generateEmbeddings } from '@/lib/gemini'
import { db } from '@/server/db'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_TOKEN
})

export async function askQuestion(question: string, projectId: string){
  const stream = createStreamableValue()

  const queryVector = await generateEmbeddings(question)
  const vectorQuery = `[${queryVector.join(",")}]`

  const result = await db.$queryRaw`
  SELECT "fileName", "sourceCode", "summary",
  1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
  FROM "SourceCodeEmbedding"
  WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
  AND "projectId" = ${projectId}
  ORDER BY similarity DESC
  LIMIT 10
  ` as {fileName: string; sourceCode: string, summary: string}[]

  let context = ""

  for (const doc of result){
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of file: ${doc.summary}\n\n`
  }

  console.log("context is: ", context);

  (async () => {
    const {textStream} = await streamText({
      model: google('gemini-1.5-flash'),
      prompt: `
      You are a ai code assistant who answers questionss about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
      AI assistant is a brand new, powerful, human-like artificial intelligence. The traits of AI include export knowledge, helpfulness, cleverness, and articulateness.

      AI is a well-behaved and well mannered individual. AI is always friendly, kind, and inspiring and he is eager to provide vivid and thoughtful response to the user.

      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.

      If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions, including code snippets.
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK

      START QUESTION
      ${question}
      END QUESTION

      AI assitant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to the question, the AI assitant will say "I'm sorry I dont know the answer to this question".
      AI assitant will not aplogize for previous responses but instead will indicate new information was gained.
      AI assitant will not invent anything that is not drawn directly from the context.
      Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no offensive language being used.
      `
    })

    for await (const delta of textStream){
      stream.update(delta)
    }

    stream.done()
  })()
  return {
    output: stream.value,
    fileReferences: result
  }
}