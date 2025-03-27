# MagicMuse.io

![MagicMuse Logo](/public/mmiologo.png)

**MagicMuse.io** is an AI-powered content generation platform designed to transform ideas into high-quality, customized content across multiple formats and domains. It provides an intuitive interface, advanced AI integration, and robust content management features.

## Table of Contents

- [Vision & Mission](#vision--mission)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup](#supabase-setup)
- [Authentication System](#authentication-system)
  - [Troubleshooting Authentication](#troubleshooting-authentication)
- [Design & Styling](#design--styling)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Vision & Mission

**Vision:** To become the industry-leading AI-powered content generation platform that seamlessly transforms ideas into high-quality, customized content, empowering individuals and organizations to communicate effectively across all mediums and domains.

**Mission:** MagicMuse.io democratizes professional content creation by providing an intuitive, powerful tool that leverages advanced AI technology to generate tailored, high-quality content while saving time, reducing costs, and maintaining consistency.

## Core Features

Based on the project structure, MagicMuse.io includes or aims to include the following features:

-   **AI-Powered Content Generation**: Create diverse content types using advanced AI models (integrated via OpenRouter).
-   **Rich Text Editor**: A sophisticated editor for refining and formatting generated content.
-   **Content Management**: Save, organize, version, and manage generated content within a library.
-   **Multi-Format Export**: Export content in various formats (e.g., PDF, DOCX, HTML).
-   **User Authentication**: Secure user registration, login (including magic links), password reset, and profile management via Supabase Auth.
-   **Dashboard**: Central hub displaying stats, recent activity, quick actions, and usage metrics.
-   **Project Creation & Management**: Functionality to organize work into projects.
-   **AI Chat Interface**: Interactive chat feature, likely for AI assistance or interaction.
-   **Settings & Profile Management**: User-configurable options for appearance (dark/light mode), AI ethics, chat history, etc.
-   **Onboarding**: Guided setup or introduction for new users.
-   **Billing & Plan Management**: Integration for handling subscriptions or usage tiers.
-   **Analytics**: Tracking and displaying usage data (e.g., token usage).
-   **Knowledge Base (KB)**: Potential feature for storing and accessing information or articles.
-   **Responsive Design**: Accessible interface across various devices.

## Technology Stack

-   **Frontend**: React, TypeScript, Vite, React Router, Redux Toolkit
-   **Backend**: Node.js, Express (likely), TypeScript
-   **Database & Authentication**: Supabase (PostgreSQL, Auth, Storage)
-   **AI Integration**: OpenRouter API (accessing various LLMs)
-   **UI Components**: Radix UI Primitives, Custom Components
-   **Styling**: Tailwind CSS, CSS Modules/Global CSS
-   **State Management**: Redux Toolkit
-   **Animation**: Framer Motion (mentioned in old README, likely still used)
-   **Linting/Formatting**: ESLint, Prettier (implied by config files)
-   **CI/CD**: GitHub Actions (implied by `.github/workflows`)
-   **Deployment**: Render (based on `render.yaml`, `render-build.sh`)

## Project Structure

The project is organized as a monorepo containing the main frontend application, a backend server, and potentially other related packages.

```
/
├── .github/            # GitHub Actions workflows
├── .husky/             # Git hooks configuration
├── .vscode/            # VS Code settings
├── dist/               # Frontend build output
├── docs/               # Project documentation (Markdown files)
├── magicmuse/          # Separate Vite/React/TS project (purpose TBC)
├── migrations/         # Database schema migration scripts (SQL)
├── node_modules/       # Project dependencies
├── public/             # Static assets (images, icons, etc.)
├── server/             # Backend Node.js/Express application
│   ├── src/
│   │   ├── config/     # Server configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── routes/     # API route definitions
│   │   ├── services/   # Business logic, external API clients (Supabase, OpenRouter)
│   │   ├── types/      # Server-specific TypeScript types
│   │   └── utils/      # Utility functions, logger, DB schema
│   ├── package.json    # Backend dependencies
│   └── tsconfig.json   # Backend TypeScript config
├── src/                # Main Frontend React/Vite application source
│   ├── components/     # Reusable UI components (common, UI primitives, feature-specific)
│   ├── config/         # Frontend configuration
│   ├── context/        # React context providers (AuthModal, Chat)
│   ├── features/       # Feature-sliced modules (auth, chat, editor, project_creation, etc.)
│   ├── lib/            # Utility libraries (markdown processing, etc.)
│   ├── pages/          # Top-level page components (routed components)
│   ├── services/       # Frontend API service clients (auth, AI, export, etc.)
│   ├── store/          # Redux Toolkit store setup and slices
│   ├── styles/         # Global CSS, Tailwind base, feature-specific styles
│   ├── types/          # Global frontend TypeScript types
│   ├── utils/          # Frontend utility functions
│   ├── App.tsx         # Root React component, router setup
│   ├── main.tsx        # Application entry point
│   └── env.d.ts        # Environment variable type definitions
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore rules
├── index.html          # Main HTML entry point for Vite
├── package.json        # Root/Frontend dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── README.md           # This file
├── render-build.sh     # Build script for Render deployment
├── render.yaml         # Infrastructure-as-Code for Render deployment
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # Root/Frontend TypeScript configuration
└── vite.config.ts      # Vite build tool configuration
```

## Getting Started

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm or yarn
-   Supabase account (for database and authentication)
-   OpenRouter API key (for AI model access)
-   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace with actual repo URL
    cd mm.io
    ```

2.  **Install Root/Frontend Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    # or
    yarn install
    cd ..
    ```

### Environment Variables

1.  **Create Environment Files:**
    Copy the example file for development:
    ```bash
    cp .env.example .env
    ```
    *Note: The previous README mentioned `.env.development`, `.env.staging`, `.env.production`. Vite typically uses `.env`, `.env.development`, `.env.production`. Adjust filenames based on your team's convention and Vite's documentation.*

2.  **Populate Variables:**
    Edit the `.env` file (or appropriate file for your environment) and add your credentials:
    ```env
    # Supabase
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

    # OpenRouter AI
    VITE_OPENROUTER_API_KEY=your_openrouter_api_key
    # Note: Consider if the API key should only be on the backend for security.
    # If used server-side only, define it without VITE_ prefix for the server environment.

    # Application URL (for redirects, etc.)
    VITE_APP_URL=http://localhost:5173 # Adjust port if needed

    # Add any other required variables for backend or frontend
    ```

### Supabase Setup

Ensure your Supabase project is configured correctly:

1.  **Create Supabase Project**:
    -   Go to the [Supabase Dashboard](https://app.supabase.com) and create a new project if you haven't already.
    -   Note your Project URL and `anon` key for the environment variables.

2.  **Initialize Database Schema**:
    -   Navigate to the SQL Editor in your Supabase project dashboard.
    -   Execute the SQL script located at `server/src/utils/supabase-schema.sql`. This script sets up the necessary tables (like `profiles`) and potentially triggers (like `handle_new_user`) required for the application, especially authentication.
    -   Apply any pending database migrations from the `migrations/` directory using the Supabase CLI or manually via the SQL Editor if needed.

3.  **Configure Authentication**:
    -   In the Supabase Dashboard, go to `Authentication` -> `Providers` and enable `Email`.
    -   Go to `Authentication` -> `URL Configuration` and set your Site URL (e.g., `http://localhost:5173`) and any necessary Redirect URLs.
    -   Customize email templates under `Authentication` -> `Templates` if desired.

4.  **Row Level Security (RLS)**:
    -   Ensure RLS is enabled for all relevant tables (the schema script might handle this).
    -   Review and verify the RLS policies defined in `supabase-schema.sql` or created manually to ensure data security.

### Running the Application

1.  **Start the Backend Server:** (Assuming it has a start script)
    ```bash
    cd server
    npm run dev # Or your actual start script (e.g., start:dev, watch)
    cd ..
    ```
    *Note: Check `server/package.json` for the correct development script.*

2.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  **Access the Application:**
    Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Authentication System

MagicMuse.io utilizes Supabase Auth for a secure and robust authentication system:

-   Email/Password registration with verification.
-   Magic Link sign-in.
-   Secure password reset functionality.
-   User profile management linked via the `profiles` table.
-   JWT-based session management handled by Supabase client libraries.

### Troubleshooting Authentication

If you encounter issues during registration or login:

1.  **Database Schema**: Verify the `profiles` table and any related tables exist in your Supabase project (run `server/src/utils/supabase-schema.sql`).
2.  **Triggers**: Ensure the `handle_new_user` trigger (or similar) is active if user profiles are automatically created upon signup.
3.  **RLS Policies**: Double-check that Row Level Security policies allow authenticated users (and potentially anonymous users for signup) appropriate access to necessary tables (`profiles`, etc.).
4.  **Email Configuration**: Confirm Supabase email settings are correctly configured and operational for sending verification/reset links.
5.  **Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in your frontend environment file.
6.  **Redirect URLs**: Verify `Site URL` and `Redirect URLs` are correctly configured in Supabase Auth settings.

## Design & Styling

The application employs a modern styling approach:

-   **Utility-First CSS**: Tailwind CSS is used for rapid UI development.
-   **Component Library**: Leverages Radix UI primitives for accessible base components, styled with Tailwind.
-   **Custom Components**: Bespoke React components organized within `src/components` and `src/features`.
-   **Global Styles**: Base styles, resets, and potentially global themes are defined in `src/styles`.
-   **CSS Files**: Some components or features may use dedicated CSS files (e.g., `ChatPanel.css`, `dashboard.css`).
-   **Theming**: Supports Light/Dark modes, likely managed via state (e.g., Redux/Context) and Tailwind's dark mode variant.
-   **Typography**: (As per old README) Comfortaa for headings, Nunito Sans for body text.

## Build & Deployment

-   **Development**: `npm run dev` (starts Vite dev server with HMR)
-   **Staging Build**: `npm run build:staging` (creates a staging build in `dist/`)
-   **Production Build**: `npm run build` or `npm run build:production` (creates an optimized production build in `dist/`)
-   **Preview Build**: `npm run preview` (serves the production build locally)
-   **Deployment**: Configured for Render via `render.yaml` and `render-build.sh`. This likely handles building the frontend and potentially starting the backend server.

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'feat: Add some amazing feature'`). Follow conventional commit messages if applicable.
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request against the main branch.

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions or support, please contact [support@magicmuse.io](mailto:support@magicmuse.io).

---

Built with ❤️ by the MagicMuse team