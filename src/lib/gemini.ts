import {GoogleGenerativeAI} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_TOKEN as string)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
})

export const aiSummariseCommit = async (diff: string) => {
  const result = await model.generateContent([
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
    It is given only as a example of appropriate comments.
    `, `Please summarise the follwing diff file: \n\n ${diff}`
  ])

  return result.response.text();
}

console.log(await aiSummariseCommit(
  `diff --git a/README.md b/README.md
index e144608..ed3b5c7 100644
--- a/README.md
+++ b/README.md
@@ -6,6 +6,13 @@ You can access and use the web application at https://split-buddy-app.web.app
 
 ![screenshot of the expense application](https://raw.githubusercontent.com/hkam0006/SplitBuddy_TS/main/assets/screenshot.png?raw=true)
 
+## Technologies Used
+- Typescript
+- React
+- Firebase (Auth, Hosting, Firestore)
+- Material UI
+- Zustand
+
 ## Features
 
 - **User-Friendly Interface**: Intuitive and easy-to-use interface for effortless expense tracking.`
))