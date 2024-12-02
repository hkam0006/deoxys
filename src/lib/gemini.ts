import {GoogleGenerativeAI} from '@google/generative-ai'
import { Document } from '@langchain/core/documents'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_TOKEN as string)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
})

export const aiSummariseCommit = async (diff: string) => {
  const result = await model.generateContent(
    `You are an expert programmer, and you are trying to  summarize a git diff.
    Reminders about the git diff format: 
    For every file, there are a few metadata lines, like (for example):
    \'\'\'
    diff --git a/lib/index.js b/lib/index.js
    index aadf69...bfe6803 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \'\'\'
    This means that \'lib/index.js\' was modified in this commit. Note that this is only an example.
    Then there is a specifier of the lines that were modified.
    A line starting with \'+\' means it was added
    A line starting with \'-\' means it was deleted
    A line that starts with neither \'-\' nor \'+\' is code given for context and better understanding.
    It is not part of the diff
    [...]
    EXAMPLE SUMMARY COMMENTS:
    \'\'\'
    * Raised the amount of retunred recoriding from \'10\' to \'100\' [packages/server/recordings_api.ts], [packages/server/constants.ts]
    * Fixed a typo in github action name [.github/workflows/gpt-commit-summarizer.yml]
    * Moved the \'octokit\' initialisation to a seperate file [src/octokit.ts], [src/index.ts]
    * Added OpenAI API for completions [packages/utils/apis/openai.ts]
    * Lowered numeric tolerance for test files
    \'\'\'
    Most commits will have less comments than this example list.
    The last comment does not include the files names, 
    because there were more than two relevant files in the hypothetical commit.
    Do not include parts of the example in your summary.
    It is given only as a example of appropriate comment s.
    Please summarise the following diff file: \n\n ${diff}`
  )

  return result.response.text(); 
}

export async function summariseCode(doc: Document){
  const code = doc.pageContent.slice(0, 10_000)
  try {
    const summary = await model.generateContent(
      `You are a intelligent senior software engineer who specialises in onboarding junior software engineers onto projects
      You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
      Here is the code:
      ---
      ${code}
      ___
      Give them a summary no more than 100 words of the code above.` 
    )
    return summary.response.text()
  } catch (err){
    console.log("Error summarising document: ", err)
    return ''
  }
}

export async function generateEmbeddings(summary: string){
  const model =  genAI.getGenerativeModel({
    model: "text-embedding-004"
  })
  const result = await model.embedContent(summary)
  const embedding = result.embedding
  return embedding.values
}