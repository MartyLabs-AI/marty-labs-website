# Marketing Formats RN - Setup Guide

## Overview
Marketing Formats RN is an AI-powered creative platform that enables teams to rapidly generate marketing assets using template-based workflows.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Convex (real-time database & functions)
- **Auth**: Clerk (authentication & billing)
- **AI Processing**: n8n workflows
- **Storage**: AWS S3 (for file uploads)

## Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account
- Convex account
- n8n instance (for AI workflows)
- AWS S3 bucket (for file storage)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd marketing-formats-rn
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required environment variables:

#### Convex
```
CONVEX_DEPLOYMENT=your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### n8n Integration
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key
N8N_WEBHOOK_SECRET=your-webhook-secret-for-hmac
```

#### AWS S3 (for file uploads)
```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

#### Application
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Set Up Convex

1. Install Convex CLI:
```bash
npm install -g convex
```

2. Login to Convex:
```bash
npx convex login
```

3. Initialize Convex project:
```bash
npx convex dev
```

4. This will create a `.env.local` file with your Convex deployment URL.

### 4. Set Up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Get your publishable and secret keys
3. Configure sign-in/sign-up pages
4. Set up webhooks to sync user data with Convex (optional)

### 5. Database Seeding

Once Convex is running, seed the database with initial flows:

1. Visit `http://localhost:3000/dev/seed`
2. Click "Seed Flows" to populate initial AI workflows

### 6. n8n Workflows

Set up n8n workflows for each flow type:

1. **Ad Banner Resizer**: Workflow ID `ad-banner-resizer-workflow`
2. **Product 360° Video**: Workflow ID `product-360-video-workflow`
3. **Poster Generator**: Workflow ID `poster-generator-workflow`
4. **Testimonial Cards**: Workflow ID `testimonial-card-workflow`
5. **Product Grid**: Workflow ID `product-grid-workflow`

Each n8n workflow should:
- Accept webhook input with generation parameters
- Process the AI generation
- Send results back to the callback URL with HMAC signature

### 7. File Upload Setup

Configure AWS S3 bucket with:
- Public read access for generated assets
- CORS configuration for web uploads
- Lifecycle rules for automatic cleanup

Example CORS configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

## Development

### Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Key Development URLs

- Main app: `http://localhost:3000`
- Sign in: `http://localhost:3000/sign-in`
- Sign up: `http://localhost:3000/sign-up`
- Dashboard: `http://localhost:3000/dashboard`
- Flow execution: `http://localhost:3000/flow/[flowId]`
- Development seeding: `http://localhost:3000/dev/seed`

### Convex Development

Monitor Convex functions and database:
```bash
npx convex dev
```

Visit the Convex dashboard to view:
- Database tables and data
- Function logs
- Real-time queries

## Architecture

### Database Schema

- **users**: User profiles synced from Clerk
- **subscriptions**: Billing and credit information
- **flows**: AI workflow definitions
- **generations**: Job tracking and results
- **usageEvents**: Analytics and billing events

### API Routes

- `POST /api/upload`: File upload handler
- `POST /api/trigger-workflow`: Trigger n8n workflows
- `POST /api/n8n-callback`: Webhook callback from n8n

### Convex Functions

- **queries**: Real-time data fetching
- **mutations**: Database updates
- **http actions**: External integrations

## Deployment

### Environment Setup

1. Deploy Convex functions:
```bash
npx convex deploy
```

2. Update environment variables for production
3. Configure Clerk for production domain
4. Set up production n8n instance
5. Configure production S3 bucket

### Recommended Hosting

- **Frontend**: Vercel or Netlify
- **Backend**: Convex (managed)
- **n8n**: Self-hosted or n8n Cloud
- **Storage**: AWS S3

## Security Considerations

1. **HMAC Verification**: All n8n callbacks are verified with HMAC signatures
2. **File Upload Validation**: File types and sizes are validated
3. **Rate Limiting**: Consider implementing rate limiting for API routes
4. **Credit System**: Built-in credit system prevents abuse
5. **Plan-based Access**: Features gated by subscription plans

## Monitoring

- Convex dashboard for function logs
- Clerk dashboard for user analytics
- AWS CloudWatch for S3 metrics
- n8n execution logs

## Support

For questions or issues:
1. Check the logs in Convex dashboard
2. Review n8n workflow executions
3. Monitor API route responses
4. Check Clerk user session status

## License

[Add your license information here]