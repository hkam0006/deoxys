# Deoxys - AI-Powered Repository and Meeting Insights Web Application

## Overview
Deoxys is a web application designed to empower junior developers by simplifying repository management and team collaboration. With features like AI-powered commit summaries, question-and-answer functionality, and actionable insights from meeting recordings, Deoxys bridges the gap between technical repositories and effective project management. 

Hosted live at [Deoxys on Vercel](https://deoxys-dev.vercel.app/).

---

## Features

### Repository Insights
- Provides detailed descriptions and summaries of repository commits.
- Integrated with GitHub SDK for seamless repository access and commit parsing.

### AI-Powered Assistance
- Leverages Gemini and AssemblyAI for natural language processing.
- Users can ask questions about the repository to gain clarity on commits and code changes.

### Meeting Insights
- Upload meeting recordings to extract actionable issues and to-dos.
- AI-generated summaries ensure team alignment and effective planning.

### User-Friendly Interface
- Built with Shadcn UI for a modern and intuitive design.
- Fully responsive for optimal usage across devices.

### Secure and Scalable
- Firebase Storage for secure data handling.
- Stripe integration for managing premium features.

---

## Technologies Used
- **Frontend:** React, TypeScript, Next.js, Shadcn UI
- **Backend:** Firebase Storage, Gemini, AssemblyAI
- **Integrations:** GitHub SDK, Stripe
- **Hosting:** Vercel

---

## Installation and Setup
To run Deoxys locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/deoxys
   cd deoxys
   ```

2. **Install Dependencies**
   Ensure you have `npm` or `yarn` installed, then run:
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and includes all required environment variables. Look at `.env.example` for required variables.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to view the app locally.

---

## Usage

1. **Repository Insights**
   - Connect your GitHub repository to fetch commit details.
   - View summaries and detailed descriptions for each commit.

2. **AI Question & Answer**
   - Use the query box to ask questions about the repository and get AI-powered responses.

3. **Meeting Insights**
   - Upload your meeting recordings (audio files).
   - Deoxys processes the recordings and provides a list of actionable tasks.

4. **Buy Credits**
   - Web Application is integrated via Stripe for purchasing credits.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
If you have any questions or suggestions, feel free to reach out:
- **Email:** [sonnykam18@gmail.com](mailto:sonnykam18@gmail.com)
- **GitHub:** [github.com/hkam0006](http://github.com/hkam0006)

---

Enjoy using Deoxys and happy coding!
