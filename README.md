# Lab17 Agents Marketplace

A modern SaaS platform for AI agent marketplace built with Next.js 15, Supabase, and Shadcn/ui.

## 🚀 Features

- **Modern UI/UX**: Built with Shadcn/ui components and Tailwind CSS
- **Authentication**: Email/password and Google OAuth via Supabase Auth
- **Dark/Light Mode**: Theme switching support
- **Responsive Design**: Mobile-first approach with responsive layouts
- **AI Agent Management**: Create, manage, and deploy AI agents
- **Subscription System**: Tiered pricing with Stripe integration
- **Real-time Chat**: WebSocket-powered conversations with AI agents
- **Knowledge Base**: Document upload and context management
- **Analytics Dashboard**: Usage metrics and performance tracking

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Payments**: Stripe
- **AI Integration**: OpenAI API, A10 Platform
- **State Management**: Zustand, React Query
- **Deployment**: Vercel

## 🏗 Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # User dashboard
│   ├── marketplace/          # Agent marketplace
│   ├── admin/                # Admin panel
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # Shadcn/ui components
│   ├── layout/               # Layout components
│   └── providers.tsx         # Context providers
└── lib/
    └── supabase/             # Supabase configuration
```

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Stripe account (for payments)
- OpenAI API key
- Google OAuth credentials

## 🚀 Getting Started

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd agents-marketplace
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project - done
   - Run the SQL schema from `supabase-schema.sql` in the SQL editor
   - Enable Google OAuth in Authentication settings

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   
   # A10 Platform
   A10_API_KEY=your-a10-api-key
   A10_API_URL=your-a10-api-url
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄 Database Schema

The application uses the following main tables:

- **profiles**: User profiles (extends auth.users)
- **agents**: AI agent definitions and configurations
- **subscriptions**: User agent subscriptions
- **conversations**: Chat conversations between users and agents
- **messages**: Individual messages in conversations
- **knowledge_base**: Agent knowledge base documents
- **usage_metrics**: API usage tracking

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Configure Google OAuth:
   - Go to Authentication > Settings
   - Add Google as a provider
   - Configure redirect URLs

### Stripe Setup

1. Create Stripe products and prices
2. Set up webhooks for subscription events
3. Configure webhook endpoints in your Stripe dashboard

### OpenAI Integration

1. Get your OpenAI API key
2. Configure rate limits and usage quotas
3. Set up embedding models for knowledge base

## 📱 Mobile Support

The application is fully responsive and mobile-friendly. Future mobile app development considerations:

- PWA capabilities built-in
- API-first architecture
- Shared component system
- Consistent design tokens

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT token-based authentication
- Encrypted data transmission
- Input validation and sanitization
- CSRF protection

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Ensure all environment variables are properly configured in your deployment environment.

## 📊 Analytics and Monitoring

- Built-in usage metrics tracking
- Performance monitoring with Web Vitals
- Error tracking and reporting
- User behavior analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@lab17.ai
- 📖 Documentation: [docs.lab17.ai](https://docs.lab17.ai)
- 💬 Discord: [Lab17 Community](https://discord.gg/lab17)

---

Built with ❤️ by [Lab17.ai](https://lab17.ai)
