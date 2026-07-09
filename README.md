# Taha Sohail — Portfolio

A modern, interactive personal portfolio website for Taha Sohail, built with React, Vite, Tailwind CSS, and Three.js.

## 🌟 Features

- **Modern Tech Stack**: Built with React 18, Vite, and TypeScript.
- **3D Graphics**: Integrates `@react-three/fiber` and `@react-three/drei` for interactive 3D background and hero elements.
- **Beautiful UI**: Styled with Tailwind CSS and accessible Radix UI components.
- **Smooth Animations**: Powered by Framer Motion.
- **Fully Responsive**: Optimized for all screen sizes (mobile, tablet, desktop).
- **Theming**: Supports Light and Dark modes.

## 🛠️ Technologies Used

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/TahaSohail.git
   cd TahaSohail
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` to view the portfolio.

## 🏗️ Build for Production

To build the application for production, run:

```bash
npm run build
```

This will generate an optimized build in the `dist` folder.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🔁 Rename deployed project on Vercel

If your Vercel project still uses the old name (for example `my-portfolio-4ecr`), you can rename it to `tahasohail` using either a GitHub Action or a local script.

Option A — GitHub Action (recommended if your repo is on GitHub):
- Add a repository secret named `VERCEL_TOKEN` (create one at https://vercel.com/account/tokens).
- The workflow `.github/workflows/rename-vercel.yml` is included; trigger it manually from the Actions tab and provide `project_search` (default `my-portfolio`) and `new_name` (`tahasohail`).

Option B — Local PowerShell script:
- Set your token in PowerShell for the session:
   ```powershell
   $env:VERCEL_TOKEN = "<your_token_here>"
   ```
- Run the script:
   ```powershell
   .\scripts\rename-vercel-project.ps1 -SearchName "my-portfolio" -Domain "my-portfolio-4ecr.vercel.app" -NewName "tahasohail"
   ```

Notes:
- Vercel will normalize project names to lowercase for the `.vercel.app` domain. If `tahasohail` is already taken, Vercel may append a suffix.
- I cannot rename the live project from this environment without a Vercel token or repository secret — the scripts/workflow above are prepared so you can run them securely.
