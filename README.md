# Kahf Collective — Frontend

[![Website](https://img.shields.io/badge/Live-kahfcollective.vercel.app-000000?logo=vercel&logoColor=white)](https://kahfcollective.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

Web client for Kahf Collective, a faith-based learning platform combining a full LMS, performance analytics, community forums, and a content library. Built with the Next.js App Router, React 19, Redux Toolkit Query, and Tailwind CSS 4.

**Companion API:** [`saifghori-backend`](../saifghori-backend) · **Live app:** https://kahfcollective.vercel.app

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Roles & Permissions](#roles--permissions)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Key Features](#key-features)
- [Conventions](#conventions)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Team](#team)

---

## Overview

Kahf Collective serves three audiences from one codebase: students working through courses, instructors authoring and grading them, and administrators running the platform.

### Student Journey

1. Register an account, which starts with the `USER` (student) role.
2. Verify the email address through the link that arrives by mail.
3. Complete the $50 monthly subscription at `/checkout/purchase`, or wait for an administrator to approve the account directly.
4. Once approved, unlock courses, sermons, articles, study circles, and personal performance dashboards.

### Instructor & Admin Workflow

Instructors build courses as a three-level hierarchy — semesters contain chapters, and chapters contain content — then enroll students individually, in bulk, or by group. They grade written quiz answers by hand, moderate forums, and track cohort performance. Administrators additionally manage users, roles, classes, and the article and sermon CMS.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4, `@tailwindcss/typography`, `tw-animate-css` |
| Components | shadcn/ui (New York) on Radix UI primitives |
| Icons | Lucide React, React Icons |
| State | Redux Toolkit 2, RTK Query, redux-persist |
| Forms | React Hook Form 7, Zod 4, `@hookform/resolvers` |
| Auth utilities | `js-cookie`, `jwt-decode` |
| Rich text | SunEditor with KaTeX math rendering |
| Media | React Player, `pdfjs-dist`, `react-photo-view`, React Dropzone |
| Drag & drop | dnd-kit (core, sortable, utilities) |
| Charts | Recharts |
| Motion | Framer Motion |
| Notifications | Sonner |
| Theming | `next-themes` |
| Utilities | `date-fns`, `uuid`, `clsx`, `tailwind-merge`, `class-variance-authority` |

Tailwind 4 is configured entirely through CSS — design tokens live in `src/app/globals.css` and there is no `tailwind.config.js`.

---

## Getting Started

### Prerequisites

- **Node.js** 18.18 or higher
- **npm**, **pnpm**, or **bun**
- A running instance of the [Kahf Collective backend](../saifghori-backend)

### Installation

```bash
git clone <your-repo-url>
cd saifghori786-frontend
npm install
```

### Configuration

```bash
cp .env.example .env
```

Point the development URL at your local API:

```env
NEXT_PUBLIC_SERVER_URL=https://api.your-domain.com
NEXT_PUBLIC_SERVER_URL_DEV=http://localhost:5008
```

### Run

```bash
npm run dev
```

Open http://localhost:3000. Make sure your backend's CORS allow-list includes this origin.

---

## Environment Variables

Both variables are `NEXT_PUBLIC_`, so they are inlined into the client bundle. Never put secrets here.

| Variable | Required | Description | Example |
|---|:---:|---|---|
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Backend base URL used when `NODE_ENV=production` | `https://api.your-domain.com` |
| `NEXT_PUBLIC_SERVER_URL_DEV` | ✅ | Backend base URL used in development | `http://localhost:5008` |

`src/config.ts` picks between the two based on `NODE_ENV`, and `src/redux/api/baseApi.ts` appends `/api/v1` to whichever is selected.

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev` | Development server at http://localhost:3000 |
| `npm run build` | `next build` | Production build |
| `npm start` | `next start` | Serve the production build |

ESLint is configured in `eslint.config.mjs` (extending `next/core-web-vitals` and `next/typescript`) and Prettier in `.prettierrc` with `prettier-plugin-tailwindcss`. Neither is currently wired to an npm script; run them directly with `npx next lint` and `npx prettier --write .`.

---

## Project Structure

```
saifghori786-frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind 4 tokens and base styles
│   │   ├── providers.tsx            # Redux, persist gate, theme, toaster
│   │   ├── (auth)/                  # Sign-in, sign-up, password recovery
│   │   ├── (checkout)/              # Stripe purchase, donation, result pages
│   │   ├── (commonLayout)/          # Public site — navbar and footer
│   │   └── (dashboard)/             # Admin and instructor workspace — sidebar
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives
│   │   ├── Global/                  # Navbar, Footer, Pagination, players, viewers
│   │   ├── Forms/                   # RichTextEditor, CustomFileUploader
│   │   ├── Auth/                    # Sign-in and sign-up flows
│   │   ├── Home/ AboutUs/ Instructors/
│   │   ├── Courses/                 # Course browsing and detail
│   │   ├── CourseLesson/            # Lesson player and quiz runner
│   │   ├── Performance/             # Analytics dashboards and Recharts wrappers
│   │   ├── StudyCircles/ Fraternity/ Articles/ Sermons/
│   │   ├── donate/ Profile/
│   │   └── Dashboard/
│   │       ├── Sidebar.tsx          # Role-aware navigation
│   │       ├── My-Courses/          # Course editor, students, submissions
│   │       │   └── Hierarchy/       # Drag-and-drop semester/chapter/content tree
│   │       ├── Users/ Class/ Group/ Content/ Quiz/ My-Students/
│   ├── redux/
│   │   ├── store/index.ts           # Store, persistence, middleware
│   │   ├── api/                     # 14 RTK Query API slices
│   │   ├── authSlice.ts             # Session state
│   │   └── signUpSlice.ts           # Multi-step registration state
│   ├── schema/index.ts              # Shared Zod form schemas
│   ├── types/                       # Domain type definitions
│   ├── lib/                         # utils, course-tree helpers, time formatting
│   ├── hooks/                       # use-mobile and friends
│   ├── utils/verifyJWT.ts           # Token decoding and validation
│   ├── data/                        # Static marketing content
│   ├── proxy.ts                     # Route-protection logic
│   └── config.ts                    # Environment-driven API base URL
├── components.json                  # shadcn/ui configuration
├── next.config.ts                   # Remote image domains
└── eslint.config.mjs
```

### Route Groups and Layouts

The app uses four route groups, each with its own root layout rather than a shared `src/app/layout.tsx`. Group names in parentheses never appear in URLs.

| Group | Layout |
|---|---|
| `(commonLayout)` | Public site chrome — navbar and footer |
| `(auth)` | Centered, minimal auth shell |
| `(checkout)` | Stripe flow with a reduced header |
| `(dashboard)` | Collapsible sidebar, breadcrumbs, theme toggle |

---

## Routing

### Public Site

| Route | Description |
|---|---|
| `/` | Landing page |
| `/about-us` | Mission and team |
| `/courses` | Courses available to the signed-in student |
| `/course-details/[slug]` | Course overview and syllabus |
| `/course-details/[slug]/lessons` | Lesson player with sidebar navigation |
| `/articles` | Paginated article library |
| `/sermons` | Paginated sermon library |
| `/study-circles` | Browse and join study circles |
| `/feed/[slug]` | A study circle's post feed |
| `/fraternity` | Fraternity group listings |
| `/instructors` | Instructor directory |
| `/instructors/[slug]` | Instructor profile |
| `/my-performance` | Personal analytics overview |
| `/my-performance/[courseId]` | Per-course analytics detail |
| `/profile` | Account settings |
| `/donate` | Donation form leading to Stripe |

### Authentication

| Route | Description |
|---|---|
| `/auth/sign-in` | Login |
| `/auth/sign-up` | Multi-step registration |
| `/auth/check-email` | Post-signup verification prompt |
| `/auth/verify-email` | Consumes the emailed verification token |
| `/auth/forget-password` | Request a reset link |
| `/auth/reset-password` | Set a new password |

### Checkout

| Route | Description |
|---|---|
| `/checkout/purchase` | Subscription gate for unapproved students |
| `/checkout/donation` | Donation checkout |
| `/checkout/complete` | Stripe success handler, reads `session_id` |
| `/checkout/cancel` | Cancelled-payment page |

### Dashboard

| Route | Description | Roles |
|---|---|---|
| `/dashboard` | Redirects to the right landing page for the role | Instructor, Admin |
| `/dashboard/users` | User management, roles, approvals, bulk creation | Admin |
| `/dashboard/classes` | Class and team management | Admin |
| `/dashboard/content` | Article and sermon CMS | Admin |
| `/dashboard/my-courses` | Course list with summary statistics | Instructor, Admin |
| `/dashboard/my-courses/[id]` | Course editor — hierarchy, students, quizzes, submissions | Instructor, Admin |
| `/dashboard/my-students` | Student roster | Instructor, Admin |
| `/dashboard/students/[userId]` | A student's performance, optionally scoped by `?courseId=` | Instructor, Admin |
| `/dashboard/assessment` | Quiz and assessment results | Instructor, Admin |
| `/dashboard/compare` | Side-by-side student comparison | Instructor, Admin |
| `/dashboard/discussion` | Forum moderation | Instructor, Admin |
| `/dashboard/discussion/[id]` | A single forum's posts and replies | Instructor, Admin |
| `/dashboard/profile` | Account settings inside the dashboard shell | Instructor, Admin |

Visiting `/dashboard` sends administrators to `/dashboard/users` and instructors to `/dashboard/my-courses`.

---

## Roles & Permissions

| API role | Label | Capabilities |
|---|---|---|
| `USER` | Student | Enrolled courses, lessons, quizzes, personal analytics, forums, donations |
| `INSTRUCTOR` | Teacher | Everything a student can do, plus course authoring, enrollment, grading, forum moderation, and cohort analytics |
| `SUPERADMIN` | Admin | Full control, including users, roles, classes, and the content CMS |

Two independent flags gate access. `isEmailVerified` confirms the address is real, while `isUserVerified` records that an administrator has approved the student — usually after payment. Students who are email-verified but not yet approved are redirected to `/checkout/purchase`.

The public navbar renders its full menu only for approved users, and it surfaces a **Dashboard** link when the role is not `USER`. Sidebar entries are filtered by role in `src/components/Dashboard/Sidebar.tsx`.

---

## State Management

### Store

`src/redux/store/index.ts` composes three reducers:

| Reducer | Persisted | Purpose |
|---|:---:|---|
| `baseApi` | — | RTK Query cache |
| `auth` | ✅ | Current user and access token, persisted to localStorage |
| `signUp` | — | Multi-step registration form state |

### API Layer

`src/redux/api/baseApi.ts` defines the shared `fetchBaseQuery`: it targets `${AppConfig.backendUrl}/api/v1`, sends `credentials: "include"`, and attaches the token from the auth slice as the `authorization` header. When the API reports an expired token, it shows a toast, clears the session, and routes the user to `/auth/sign-in`.

Cache invalidation runs on these tags: `User`, `Payment`, `Contents`, `Class`, `Courses`, `CourseContents`, `Group`, `Post`, `QuizAnswer`, `Questions`, `Reply`, and `Analytics`.

Endpoints are split into focused slices that all inject into the base API:

| File | Covers |
|---|---|
| `userApi.ts` | Auth flows, profiles, roles, statuses, bulk creation |
| `courseApi.ts` | Course CRUD, enrollment, completion, group assignment |
| `courseContent.ts` | Lessons, quizzes, reordering, moving, submissions |
| `semesterApi.ts` | Semester CRUD and ordering |
| `chapterApi.ts` | Chapter CRUD, ordering, and moving |
| `contentApi.ts` | Article and sermon CMS |
| `classApi.ts` | Classes and assignments |
| `groupApi.ts` | Study circles and location groups |
| `postApi.ts` | Posts, replies, reactions, moderation |
| `ansQuizApi.ts` | Quiz submission, locking, marking, results |
| `question.ts` | Free-form questions and answers |
| `analyticsApi.ts` | Progress, performance, leaderboards, comparison |
| `paymentApi.ts` | Checkout sessions and payment history |
| `utilsApi.ts` | Administrative cache invalidation |

---

## Authentication

### Login

Submitting the sign-in form calls `POST /auth/login`. On success the token and user object are written to the auth slice, which redux-persist mirrors into localStorage, and a copy of the token is stored in an `accessToken` cookie with a 30-day expiry so it is readable during server-side route checks. Approved users land on `/`; unverified users are sent to `/auth/check-email`.

Logging out clears the auth slice, removes the cookie, and redirects to `/auth/sign-in`.

### Route Protection

`src/proxy.ts` holds the guard logic: it reads the `accessToken` cookie, redirects anonymous visitors to `/auth/sign-in`, bounces signed-in users away from `/auth/*`, sends unapproved students to `/checkout/purchase`, and enforces a per-role route allow-list.

> **Note:** this file exports a `proxy()` function and is not currently imported anywhere, so the guard does not run at request time. To activate it, rename the file to `middleware.ts` at the project root (or in `src/`), export the function as `middleware`, and add a matching `config.matcher`. Until then, access control relies on the checks each page performs client-side and on the backend's own authorization.

---

## Key Features

### Lesson Player

`src/components/CourseLesson/ContentPlayer.tsx` renders whichever content type a lesson holds — rich text with KaTeX math, PDFs through `pdfjs-dist`, uploaded video and external video links through React Player, live meeting links, and interactive quizzes. Progress is reported to the analytics API as students move through the material.

### Quizzes

Multiple-choice questions are graded automatically, while written answers wait for an instructor. Students lock a submission when they finish, which prevents further edits, and instructors mark and release results from `/dashboard/assessment` or the course editor.

### Course Hierarchy Editor

`src/components/Dashboard/My-Courses/Hierarchy/` implements the three-level tree of semesters, chapters, and content, with dnd-kit powering reordering within a level and moving items between parents.

### Performance Analytics

Recharts-based dashboards under `src/components/Performance/` visualize completion rates, quiz averages, and rankings. Students see their own progress on `/my-performance`, and instructors compare cohorts on `/dashboard/compare` and per-course leaderboards.

### Rich Text Editing and Uploads

`RichTextEditor.tsx` wraps SunEditor with KaTeX for mathematical notation, and `CustomFileUploader.tsx` combines React Dropzone with dnd-kit for multi-file uploads with reorderable previews.

### Community

Study circles and location-based groups each get a feed at `/feed/[slug]` with posts, nested replies, and reactions. Instructors and administrators moderate the same content from `/dashboard/discussion`.

### Payments

Students and donors are redirected to Stripe Checkout from `/checkout/purchase` and `/donate`, then returned to `/checkout/complete` or `/checkout/cancel`.

---

## Conventions

**Imports** use the `@/*` alias, which maps to `src/*`.

**Components** come from shadcn/ui in the New York style with the slate palette and CSS variables, configured in `components.json`. Add new primitives with:

```bash
npx shadcn@latest add <component>
```

**Styling** is Tailwind 4 with tokens defined in `src/app/globals.css`. Merge conditional classes with the `cn()` helper from `src/lib/utils.ts`.

**Forms** pair React Hook Form with Zod resolvers, keeping shared schemas in `src/schema/index.ts`.

**Data fetching** goes through RTK Query. New endpoints belong in the matching slice under `src/redux/api/`, tagged so that mutations invalidate the right caches.

**Remote images** must have their host declared in `next.config.ts`; Cloudinary and DigitalOcean Spaces are already allowed.

---

## Deployment

The app is deployed on Vercel at https://kahfcollective.vercel.app.

```bash
npm run build
npm start
```

Before deploying, set both `NEXT_PUBLIC_*` variables in your hosting provider's environment settings, add the deployed origin to the backend's CORS allow-list, and declare any new image hosts in `next.config.ts`.

---

## Contributing

1. Branch off `main`.
2. Match the existing folder layout — pages in the appropriate route group, feature components under `src/components/<Feature>/`, endpoints in the matching RTK Query slice.
3. Run `npx next lint` and `npx prettier --write .` before committing.
4. Open a pull request describing the change and any new environment variables or backend dependencies.

### Known Gaps

- `src/proxy.ts` is not wired up as middleware, so server-side route protection is inactive.
- `package.json` has no `lint` script even though ESLint is configured.
- The landing page renders only the hero section; the remaining sections are commented out.

---

## Team

Developed by **Junayet Alam** (Full Stack), **Robin Mia**, and **Mir Noman**.

## License

MIT
