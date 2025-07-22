# Render Environment Variables Configuration

This document lists all environment variables needed for deploying MagicMuse on Render.

## Required Environment Variables

These variables MUST be set in your Render dashboard:

### 1. OpenRouter API Configuration
```
OPENROUTER_API_KEY=your-openrouter-api-key
```
- **Required**: YES
- **Description**: Your OpenRouter API key for AI model access
- **How to get**: Sign up at https://openrouter.ai

### 2. Supabase Configuration
```
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```
- **Required**: YES
- **Description**: Supabase project credentials
- **How to get**: From your Supabase project settings

### 3. JWT Configuration
```
JWT_SECRET=your-secure-jwt-secret
```
- **Required**: YES
- **Description**: Secret key for JWT token signing
- **How to generate**: Use a strong random string (32+ characters)

## Optional Environment Variables

These variables have default values but can be customized:

### 4. AI Model Configuration
```
DEFAULT_CONTENT_MODEL=qwen/qwen-plus
DEFAULT_RESEARCH_MODEL=google/gemini-2.5-flash-lite-preview-06-17
BOOK_STRUCTURE_MODEL=anthropic/claude-3.7-sonnet:thinking
DEFAULT_QUALITY_MODEL=google/gemini-2.5-flash
DEFAULT_CHAT_MODEL=qwen/qwen-plus
```
- **Required**: NO (defaults provided)
- **Description**: AI models for different features

### 5. CORS Configuration
```
CORS_ORIGINS=https://magicmuse.io,https://www.magicmuse.io
```
- **Required**: NO (defaults to localhost for development)
- **Description**: Allowed origins for CORS

### 6. Server Configuration
```
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
```
- **Required**: NO (Render sets PORT automatically)
- **Description**: Server runtime configuration

## Setting Environment Variables on Render

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable with its key and value
6. Click "Save Changes"
7. Render will automatically redeploy with new variables

## Quick Copy-Paste Template

Copy this template and fill in your values:

```
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
NODE_ENV=production
```

## Important Notes

- Never commit actual values to version control
- Keep your JWT_SECRET secure and unique
- The server now has default values for AI models, so deployment won't fail if they're not set
- Make sure to use HTTPS URLs for production CORS origins