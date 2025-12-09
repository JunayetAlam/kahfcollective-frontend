# Kahf Collective

[![Website](https://img.shields.io/badge/Website-kahfcollective.com-blue)](https://kahfcollective.com/)
[![License](https://img.shields.io/badge/License-MIT-green)]()

Kahf Collective is an e-learning platform with multiple features. The platform has three roles: Admin, Instructor, and Student.

## Table of Contents

- [Workflow](#workflow)  
- [Instructor Responsibilities](#instructor-responsibilities)  
- [Course](#course)  
- [Assignment](#assignment)  
- [Discussion/Forum](#discussionforum)  
- [Fraternity & Blogs](#fraternity--blogs)  
- [Technologies Used (Frontend)](#technologies-used-frontend)  
- [How to Run the Project](#how-to-run-the-project)  
- [Footer](#footer)  

---

## Workflow

- An Admin is automatically generated at the start.
- When a user creates an account, he becomes a Student by default.
- A Student cannot log in until approved by an Admin or Instructor.
- For approval, the Student must pay $50, but the Admin can approve without payment.
- Admin can also make any user a Teacher/Instructor.

## Instructor Responsibilities

- Instructors can manage Students, Courses, Assignments, Fraternity, and Discussions/Forum.
- Instructors can create multiple Teams and assign Students to those teams.
- Instructors can create Courses, Forums/Discussions, Fraternity groups, and Blogs for a specific team.
- Only the members of that team can access these resources.

## Course

A Course will contain four types of modules: Text, PDF, Assignment, and Video.

## Assignment

- Instructors can create assignments inside a course.
- Assignments can have two types of questions:
  - Multiple Choice
  - Short Answer
- Instructors will manually check answers and assign marks.
- Students cannot re-answer or resubmit once they submit the assignment.

## Discussion/Forum

- Instructors can create discussion groups based on teams.
- Team members can create posts and comment on posts.
- All content can be managed by the Instructor and Admin.

## Fraternity & Blogs

- Instructors can create Fraternity groups and publish Blogs for specific teams.

## Technologies Used (Frontend)

### Framework & Language
Next.js 15 | React 19 | TypeScript | Tailwind CSS 4 | Redux Toolkit | Redux Persist

### UI & Components
Radix UI | ShadCN (CVA, tailwind-merge) | Lucide-react Icons | CMDK | Embla Carousel | React-photo-view | SunEditor

### Forms & Validation
React Hook Form | Zod | @hookform/resolvers

### Media & File Handling
React Dropzone | React Player | pdfjs-dist

### Drag & Drop
dnd-kit (core, sortable, utilities)

### Animations & UX
Framer Motion | Sonner | tw-animate-css

### Utilities
date-fns | uuid | js-cookie | jwt-decode | next-themes

## How to Run the Project

### Clone the repository
```bash
git clone <your-repo-url>
cd frontend
````

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the root of the project and add:

```env
NEXT_PUBLIC_SERVER_URL=backendUrl
NEXT_PUBLIC_SERVER_URL_DEV=backendUrlDev
```

### Run the development server

```bash
npm run dev
```

### Build the project for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Lint the code (optional)

```bash
npm run lint
```

## Footer

Developed by Junayet Alam (Full Stack) | Robin Mia (Help) | Mir Noman (Help)

---

**Check the live project:** [https://kahfcollective.com/](https://kahfcollective.com/)

```