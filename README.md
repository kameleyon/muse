# MagicMuse.io

![MagicMuse Logo](/public/mmiologo.png)

MagicMuse.io is an AI-powered content generation platform designed to transform ideas into high-quality, customized content across multiple formats and domains.

## Vision & Mission

Our vision is to become the industry-leading AI-powered content generation platform that seamlessly transforms ideas into high-quality, customized content, empowering individuals and organizations to communicate effectively across all mediums and domains.

MagicMuse.io democratizes professional content creation by providing an intuitive, powerful tool that leverages advanced AI technology to generate tailored, high-quality content while saving time, reducing costs, and maintaining consistency.

## Features

- **AI-Powered Content Generation**: Create multiple content types with advanced AI models
- **Customization Options**: Adjust tone, style, length, and other parameters to match your specific needs
- **Content Management**: Save, organize, and version your generated content
- **Multi-Format Export**: Export your content in PDF, DOCX, HTML, and other formats
- **User Authentication**: Secure account management with email verification
- **Responsive Design**: Access on any device with a consistent, clean interface
- **Dark/Light Mode**: Choose your preferred visual theme

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database & Authentication**: Supabase
- **AI Integration**: OpenRouter API
- **Build Tools**: Vite
- **Styling**: TailwindCSS, Radix UI
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database and authentication)
- OpenRouter API key (for AI model access)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/magicmuse.io.git
   cd mm.io
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.development
   ```
   Edit the `.env.development` file and add your Supabase and OpenRouter API credentials.

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create the following environment files:
- `.env.development` - for local development
- `.env.staging` - for staging environment
- `.env.production` - for production environment

Required variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_APP_URL=http://localhost:5173
```

### Supabase Setup

To ensure authentication works properly, you need to set up your Supabase project correctly:

1. **Create Supabase Project**:
   - Go to [Supabase Dashboard](https://app.supabase.com) and create a new project
   - Copy your project URL and anon key to the environment variables

2. **Initialize Database Schema**:
   - In the Supabase SQL Editor, run the schema setup SQL found in `server/src/utils/supabase-schema.sql`
   - This creates the necessary tables and triggers for user authentication

3. **Configure Authentication**:
   - In the Supabase Dashboard, go to Authentication > Settings
   - Enable Email Signup
   - Set up email templates for verification and password reset
   - Configure redirect URLs for your application

4. **Set up Row Level Security**:
   - The SQL script sets up proper RLS policies
   - Make sure that RLS is enabled on all tables

If you encounter any registration issues, make sure the `profiles` table exists and a trigger is set up to create profile entries for new users.

## Project Structure

```
/
├── dist/               # Build output
├── public/             # Static assets
├── server/             # Backend Express server
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layout components
│   ├── pages/          # Page components
│   ├── services/       # API and service integrations
│   ├── store/          # Redux store and slices
│   ├── styles/         # Global styles and Tailwind config
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env.development    # Development environment variables
├── .env.production     # Production environment variables
├── .env.staging        # Staging environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Authentication System

MagicMuse.io implements a secure authentication system with the following features:

- Email-based registration with verification
- Secure password management with reset capability
- User profile management
- JWT-based authentication
- Secure session handling

## Troubleshooting Authentication

If you encounter registration issues:

1. **Database Error**: Ensure the `profiles` table exists in your Supabase project
2. **Profile Creation**: Check that the `handle_new_user` trigger function is properly created
3. **Database Access**: Verify that your Supabase RLS policies are correctly set up
4. **Email Configuration**: Make sure Supabase email service is configured for verification emails
5. **API Keys**: Confirm your Supabase URL and anon key are correctly set in environment variables

## Development Process

See our [Development Checklist](./checklist.md) for an overview of our development roadmap and progress.

## Design System

Our design system follows minimalist principles with a clean, intuitive interface:

- **Typography**: Comfortaa for headings, Nunito Sans for body
- **Colors**: Clean, accessibility-friendly palette with light and dark modes
- **Components**: Built on Radix UI primitives with custom styled components
- **Responsive**: Mobile-first approach with responsive breakpoints

## Build & Deployment

### Development
```bash
npm run dev
```

### Staging Build
```bash
npm run build:staging
```

### Production Build
```bash
npm run build:production
```

### Run Production Build Locally
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions or support, please contact [support@magicmuse.io](mailto:support@magicmuse.io)

---

Built with ❤️ by the MagicMuse team