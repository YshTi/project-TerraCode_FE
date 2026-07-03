# Nature Trips Frontend

Frontend application for **Природні Мандри** — a multi-page eco-travel website where users can read travel stories, view travellers, register, log in, save stories, and manage their profile.

The project is built with **Next.js App Router**, **TypeScript**, and **CSS Modules**.

---

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS Modules
- modern-normalize
- Montserrat font via `next/font`
- Internal Next.js API routes in `src/app/api`
- Backend connection through environment variables

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create `.env.local` in the project root:

```env
BACKEND_API_URL=http://localhost:3000
```

The backend should run on:

```txt
http://localhost:3000
```

The frontend runs on:

```txt
http://localhost:3001
```

The frontend uses port `3001` because port `3000` is reserved for the backend.

### 3. Start development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3001
```

---

## Available Scripts

### Run development server

```bash
npm run dev
```

### Build project

```bash
npm run build
```

### Run production build locally

```bash
npm run start
```

### Check Git status

```bash
git status
```

---

## Project Structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx

    auth/
      login/
        page.tsx
      register/
        page.tsx

    stories/
      page.tsx
      loading.tsx
      [storyId]/
        page.tsx
      new/
        page.tsx

    travellers/
      page.tsx

    traveller/
      [travellerId]/
        page.tsx

    profile/
      page.tsx

    api/
      auth/
        login/
          route.ts
        register/
          route.ts
      stories/
        route.ts
        [storyId]/
          route.ts
      travellers/
        route.ts
      users/
        route.ts

  components/
    header/
      header.tsx
      header.module.css

    footer/
      footer.tsx
      footer.module.css

    logo/
      logo.tsx
      logo.module.css

    container/
      container.tsx
      container.module.css

    loader/
      loader.tsx
      loader.module.css

    button/
      button.tsx
      button.module.css

    save-button/
      save-button.tsx
      save-button.module.css

    story-card/
      story-card.tsx
      story-card.module.css

    traveller-card/
      traveller-card.tsx
      traveller-card.module.css

    page-title/
      page-title.tsx
      page-title.module.css

    errors/
      error-content/
        error-content.tsx
        error-content.module.css

      not-found-content/
        not-found-content.tsx
        not-found-content.module.css

    modals/
      confirm-modal/
        confirm-modal.tsx
        confirm-modal.module.css

      error-while-saving-modal/
        error-while-saving-modal.tsx
        error-while-saving-modal.module.css

  styles/
    variables.css
    reset.css
    global.css

  lib/
    api/
      backend.ts

  types/
    story.ts
    user.ts
    category.ts

public/
  icons/
    sprite.svg
```

---

## Where to Work

### Pages and Routes

All application routes are inside:

```txt
src/app/
```

Examples:

```txt
src/app/page.tsx                          Home page
src/app/stories/page.tsx                  Stories page
src/app/stories/[storyId]/page.tsx        Story details page
src/app/stories/new/page.tsx              Add story page
src/app/travellers/page.tsx               Travellers page
src/app/traveller/[travellerId]/page.tsx  Traveller details page
src/app/profile/page.tsx                  User profile page
src/app/auth/login/page.tsx               Login page
src/app/auth/register/page.tsx            Register page
```

Every `page.tsx` file must have a **default export**:

```tsx
export default function HomePage() {
  return <div>Home page</div>;
}
```

Do not leave Next.js special files empty:

```txt
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
```

Empty special files will break the application.

---

## Layout

The main app layout is here:

```txt
src/app/layout.tsx
```

It is responsible for:

- connecting global styles
- connecting Montserrat font
- rendering `Header`
- rendering page content inside `<main>`
- rendering `Footer`

Expected structure:

```tsx
<body>
  <Header />
  <main>{children}</main>
  <Footer />
</body>
```

It is correct and normal that `Header` and `Footer` are inside `<body>`.

---

## Global Styles

Global styles are stored in:

```txt
src/styles/
  variables.css
  reset.css
  global.css
```

They are imported only in:

```txt
src/app/layout.tsx
```

Do not use:

```txt
src/app/globals.css
```

The default Next.js `globals.css` file should be deleted.

---

## CSS Variables

Project variables are stored in:

```txt
src/styles/variables.css
```

Use semantic variables in components:

```css
color: var(--color-text-primary);
background-color: var(--color-background);
border-color: var(--color-border);
```

Main variables:

```css
--font-main

--color-white
--color-black

--color-green-50
--color-green-100
--color-green-300
--color-green-500
--color-green-600
--color-green-800
--color-green-900

--color-gray-50
--color-gray-100
--color-gray-300
--color-gray-500
--color-gray-700
--color-gray-900

--color-red

--color-background
--color-background-soft
--color-background-green

--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-inverse

--color-border
--color-border-light

--color-accent
--color-accent-hover
--color-accent-light
--color-accent-dark

--color-error
```

---

## Components

Reusable components are stored in:

```txt
src/components/
```

Each component should have its own folder:

```txt
components/button/
  button.tsx
  button.module.css
```

Use lowercase folder and file names:

```txt
good:
story-card/story-card.tsx
error-while-saving-modal/error-while-saving-modal.tsx

bad:
StoryCard/StoryCard.tsx
ErrorWhileSavingModal/ErrorWhileSavingModal.tsx
```

Use PascalCase only for component names:

```tsx
export function StoryCard() {
  return <article>Story</article>;
}
```

Import example:

```tsx
import { StoryCard } from "@/components/story-card/story-card";
```

---

## Container

The shared container component is here:

```txt
src/components/container/container.tsx
```

Use `Container` to align page content.

Example:

```tsx
import { Container } from "@/components/container/container";

export default function Page() {
  return (
    <section className="section">
      <Container>
        <h1>Page title</h1>
      </Container>
    </section>
  );
}
```

Recommended page section pattern:

```tsx
<section className="section">
  <Container>Content here</Container>
</section>
```

Do not wrap the whole app in one global `Container`, because some sections may need full-width backgrounds.

Correct:

```tsx
<section className="hero">
  <Container>Hero content</Container>
</section>
```

This allows the background to be full width while the content stays aligned.

---

## Buttons

The shared button component is here:

```txt
src/components/button/button.tsx
```

Use it for common buttons and links with button styles.

Example:

```tsx
import { Button } from "@/components/button/button";

<Button>Click me</Button>
<Button href="/stories">Go to stories</Button>
<Button variant="secondary">Cancel</Button>
```

The special save/unsave behavior should be implemented separately in:

```txt
src/components/save-button/
```

The `SaveButton` can reuse similar styles, but it should stay as a separate component because it has special logic.

---

## Header and Footer

Header component:

```txt
src/components/header/header.tsx
src/components/header/header.module.css
```

Footer component:

```txt
src/components/footer/footer.tsx
src/components/footer/footer.module.css
```

Both should use the shared `Container` component inside.

Example structure:

```tsx
<header>
  <Container>Header content</Container>
</header>
```

```tsx
<footer>
  <Container>Footer content</Container>
</footer>
```

---

## Error and Not Found Pages

Global error page:

```txt
src/app/error.tsx
```

This file must be a Client Component:

```tsx
"use client";
```

The visual error content is stored here:

```txt
src/components/errors/error-content/
```

Global not-found page:

```txt
src/app/not-found.tsx
```

The visual not-found content is stored here:

```txt
src/components/errors/not-found-content/
```

---

## Modals

Common modal components are stored in:

```txt
src/components/modals/
```

Current modal folders:

```txt
confirm-modal/
error-while-saving-modal/
```

`ErrorWhileSavingModal` is used when a non-authorized user tries to save a story.

Folder and file names stay lowercase:

```txt
error-while-saving-modal/error-while-saving-modal.tsx
```

Component name uses PascalCase:

```tsx
export function ErrorWhileSavingModal() {
  return <div>Modal content</div>;
}
```

---

## API Routes

Internal frontend API routes are stored in:

```txt
src/app/api/
```

Frontend components and pages should call internal API routes first.

Flow:

```txt
Frontend page/component
  → /api/stories
  → backend server
```

Do not hardcode backend URLs directly inside components.

Backend URL should come from:

```env
BACKEND_API_URL=http://localhost:3000
```

Example API route:

```ts
export async function GET() {
  const response = await fetch(`${process.env.BACKEND_API_URL}/stories`, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
```

---

## Backend Helper

Shared backend request logic should go here:

```txt
src/lib/api/backend.ts
```

Use this file later for common fetch logic, for example:

```ts
const baseUrl = process.env.BACKEND_API_URL;

export async function backendFetch(path: string, options?: RequestInit) {
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not defined");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    cache: "no-store",
  });

  return response;
}
```

---

## Types

Shared TypeScript types are stored in:

```txt
src/types/
```

Current type files:

```txt
story.ts
user.ts
category.ts
```

Example:

```ts
export type Story = {
  id: string;
  title: string;
  article: string;
  image: string;
  category: string;
};
```

Use shared types instead of rewriting the same object shape in many components.

---

## Assets

### SVG Sprite

SVG sprite should be placed here:

```txt
public/icons/sprite.svg
```

Usage:

```tsx
<svg width="24" height="24" aria-hidden="true">
  <use href="/icons/sprite.svg#icon-heart" />
</svg>
```

Because everything inside `public/` is available from the site root.

So this file:

```txt
public/icons/sprite.svg
```

is used as:

```txt
/icons/sprite.svg
```

### Favicon

Favicon should be placed here:

```txt
src/app/favicon.ico
```

Next.js detects it automatically.

---

## Fonts

The project uses Montserrat via `next/font/google`.

Font setup is inside:

```txt
src/app/layout.tsx
```

Current font weights:

```txt
400 Regular
500 Medium
600 SemiBold
700 Bold
```

Do not import Google Fonts manually in CSS.

Use:

```ts
import { Montserrat } from "next/font/google";
```

---

## Styling Rules

Use CSS Modules for component styles:

```txt
component-name.module.css
```

Example:

```txt
button/
  button.tsx
  button.module.css
```

Use global CSS only for:

- CSS variables
- reset styles
- body styles
- common helper classes like `.section`

Do not put component-specific styles in `global.css`.

---

## Naming Rules

Use lowercase names for folders and files:

```txt
good:
page-title/page-title.tsx
traveller-card/traveller-card.tsx

bad:
PageTitle/PageTitle.tsx
TravellerCard/TravellerCard.tsx
```

Use PascalCase for component functions:

```tsx
export function PageTitle() {}
export function TravellerCard() {}
```

Use camelCase for variables and functions:

```ts
const storyId = "123";
function getStoryById() {}
```

---

## Git Workflow

Create a separate branch for each task.

Example:

```bash
git switch -c skeleton-setup
```

Check changes:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Create project skeleton and global styles"
```

Push branch:

```bash
git push -u origin skeleton-setup
```

Then create a Pull Request on GitHub.

---

## Branch Naming Examples

Use clear branch names:

```txt
skeleton-setup
home-page
stories-page
auth-pages
profile-page
api-routes
fix-header-layout
```

---

## Commit Message Examples

Use short, clear messages:

```txt
Create project skeleton and global styles
Add header and footer layout
Add reusable button component
Add story card component
Add auth pages
Fix API route structure
```

---

## Repository Rules

Before starting work:

```bash
git status
```

Before pushing:

```bash
npm run build
```

Do not commit:

```txt
node_modules/
.next/
.env.local
```

These files should stay ignored by `.gitignore`.

Commit `.env.template`, but do not commit `.env.local`.

---

## Environment Files

Use `.env.local` for local private values:

```env
BACKEND_API_URL=http://localhost:3000
```

Use `.env.template` to show required variables without real values:

```env
BACKEND_API_URL=
```

`.env.local` should not be pushed to GitHub.

`.env.template` should be pushed.

---

## Important Notes

- `src/app/page.tsx` must export a default React component.
- `src/app/layout.tsx` must export a default React component.
- `src/app/error.tsx` must include `"use client";`.
- `src/app/loading.tsx` must export a default React component.
- `src/app/not-found.tsx` must export a default React component.
- Global CSS should only be imported in `src/app/layout.tsx`.
- Header and Footer belong inside `<body>`.
- `Container` should be used inside page sections, Header, and Footer.
- The backend is a separate project and should run on port `3000`.
- The frontend should run on port `3001`.
