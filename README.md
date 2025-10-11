# 👑 DeKingsPalace Frontend

A modern, responsive investment platform built with Next.js 14 (App Router), TypeScript, Bootstrap 5, and SCSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + SCSS + CSS Modules
- **UI Components**: React Bootstrap
- **Package Manager**: npm/yarn/pnpm

## 📁 Project Structure

```
dekingspalace-frontend/
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── .eslintrc.json              # ESLint rules
├── .prettierrc                 # Prettier formatting rules
├── .gitignore                  # Git ignore patterns
├── .env.local.example          # Environment variables template
├── README.md                   # This file
└── src/
    ├── app/                    # Next.js App Router pages
    │   ├── layout.tsx          # Root layout
    │   ├── globals.scss        # Global styles
    │   ├── page.tsx            # Home page
    │   └── dashboard/          # Dashboard section
    │       ├── layout.tsx      # Dashboard layout
    │       └── page.tsx        # Dashboard home
    ├── components/             # React components
    │   ├── layout/             # Layout components
    │   │   ├── Header.tsx      # Public header
    │   │   ├── Footer.tsx      # Footer
    │   │   ├── Navbar.tsx      # Dashboard navbar
    │   │   └── Sidebar.tsx     # Dashboard sidebar
    │   ├── ui/                 # Reusable UI components
    │   │   └── Button/         # Custom button component
    │   │       ├── index.tsx
    │   │       └── styles.module.scss
    │   └── shared/             # Shared components
    │       ├── PlanCard.tsx    # Investment plan card
    │       └── PlanCard.module.scss
    ├── styles/                 # Global styles
    │   ├── tokens.scss         # Design tokens (colors, spacing, etc.)
    │   └── components.scss     # Reusable component styles
    └── types/                  # TypeScript type definitions
        ├── plans.ts            # Plan-related types
        └── global.d.ts         # Global type definitions
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |

## 🎨 Styling Architecture

### Design Tokens (`src/styles/tokens.scss`)

Centralized design system with:
- Color palette (primary, secondary, success, danger, etc.)
- Typography scale
- Spacing system
- Border radius values
- Shadows and transitions
- Responsive breakpoints

### Global Styles (`src/app/globals.scss`)

- Bootstrap imports
- Global resets
- Base typography
- Bootstrap overrides

### Component Styles

Two approaches:
1. **CSS Modules**: Scoped styles (e.g., `Button/styles.module.scss`)
2. **SCSS Files**: Component-specific styles (e.g., `PlanCard.module.scss`)

## 🧩 Component Architecture

### Layout Components

- **Header**: Public-facing navigation
- **Footer**: Site footer with links
- **Navbar**: Dashboard top navigation
- **Sidebar**: Dashboard side navigation

### UI Components

- **Button**: Customizable button with variants (primary, secondary, success, danger, outline)
  - Props: `variant`, `size`, `fullWidth`, `loading`

### Shared Components

- **PlanCard**: Investment plan display card
  - Shows plan details, ROI, features
  - Responsive and hover effects

## 📱 Pages

### Public Pages

- **Home (`/`)**: Landing page with hero, plans, and features sections
- **Dashboard (`/dashboard`)**: Protected dashboard with stats and investment overview

### Dashboard Layout

- Persistent navbar and sidebar
- Responsive design
- Easy navigation between sections

## 🔧 Configuration Files

### `tsconfig.json`

- Strict TypeScript settings
- Path aliases (`@/components`, `@/styles`, `@/types`)
- Next.js plugin integration

### `next.config.js`

- SASS configuration
- Image optimization settings
- Environment variables

### `.eslintrc.json`

- Next.js recommended rules
- TypeScript support
- Custom rules for code quality

### `.prettierrc`

- Consistent code formatting
- 2-space indentation
- Single quotes
- Trailing commas

## 🌐 API Integration

The frontend is configured to connect to a backend API:

```typescript
// Example API call
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchPlans() {
  const response = await fetch(`${API_URL}/api/plans`);
  return response.json();
}
```

## 📋 Next Steps Checklist

### Authentication
- [ ] Implement user registration
- [ ] Add login/logout functionality
- [ ] Set up JWT token management
- [ ] Add protected route middleware
- [ ] Implement password reset flow

### API Integration
- [ ] Connect to backend API
- [ ] Set up API client (axios/fetch)
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Set up API response caching

### Features
- [ ] Complete investment flow
- [ ] Add transaction history
- [ ] Implement wallet management
- [ ] Add referral system
- [ ] Create admin dashboard

### Testing
- [ ] Set up Jest for unit tests
- [ ] Add React Testing Library
- [ ] Write component tests
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Set up CI/CD pipeline

### Performance
- [ ] Optimize images with Next.js Image
- [ ] Implement code splitting
- [ ] Add loading skeletons
- [ ] Set up error boundaries
- [ ] Add performance monitoring

### SEO & Accessibility
- [ ] Add meta tags
- [ ] Implement sitemap
- [ ] Add robots.txt
- [ ] Ensure WCAG compliance
- [ ] Add aria labels

### Security
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Set up security headers
- [ ] Add content security policy

## 🎯 Best Practices Implemented

✅ **Clean Code**
- Consistent naming conventions
- Modular component structure
- Separation of concerns
- DRY principles

✅ **TypeScript**
- Strong typing throughout
- Interface definitions
- Type safety

✅ **Performance**
- Server-side rendering
- Optimized bundle size
- Lazy loading ready

✅ **Responsive Design**
- Mobile-first approach
- Bootstrap grid system
- Flexible layouts

✅ **Maintainability**
- Clear folder structure
- Reusable components
- Documented code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, email support@dekingspalace.com or join our Slack channel.

---

**Built with ❤️ by the DeKingsPalace Team**
