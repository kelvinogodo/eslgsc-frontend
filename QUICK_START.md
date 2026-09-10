# ESLGSC Frontend - Quick Start Guide

## 🚀 Installation & Run

```bash
# Install dependencies (REQUIRED FIRST)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable primitives (Button, Input, Table, etc.)
│   └── layout/          # Layout components (Header, Footer, Sidebar, etc.)
├── pages/
│   ├── Home/            # Public homepage
│   ├── Services/        # Services listing
│   ├── Contact/         # Contact form
│   └── Dashboard/       # Dashboard pages (role-based)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & constants
├── services/            # API calls & data fetching
├── context/             # React Context (Auth)
├── router/              # Route configuration
└── types/               # Type definitions (JSDoc)
```

## 🎨 Using the Design System

### Importing Components
```jsx
import { Button, Card, Table, Modal } from '../components/ui';
```

### Button Usage
```jsx
<Button variant="primary" size="lg">Click Me</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="sm">Delete</Button>
```

### Card & Layout
```jsx
<Card className="p-6">
  <h2 className="heading-md">Title</h2>
  <p className="text-gov-gray-600">Content</p>
</Card>
```

### Form Inputs
```jsx
<Input 
  label="Email" 
  type="email"
  required
  error={errors.email?.message}
  {...register('email')}
/>
```

### Table
```jsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## 🎯 Common Utility Classes

### Typography
```jsx
className="heading-xl"    // Extra large heading
className="heading-lg"    // Large heading
className="heading-md"    // Medium heading
className="heading-sm"    // Small heading
```

### Colors
```jsx
text-gov-blue-600         // Primary brand blue
text-gov-green-600        // Secondary green
text-gov-cyan-500         // Accent cyan
text-gov-gray-600         // Neutral gray
bg-gov-blue-50            // Light blue background
```

### Layout
```jsx
className="container-custom"  // Max-width container with padding
className="panel"             // White rounded panel with shadow
className="card"              // Card component styling
className="glass"             // Glassmorphism effect
```

## 🔐 Authentication

### Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Logged in as: {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['', 'ADMIN']}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 📡 API Calls (Data Fetching)

### Using React Query
```jsx
import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '../services/dataService';

function EmployeeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });
  
  if (isLoading) return <Loader />;
  if (error) return <Alert variant="error">{error.message}</Alert>;
  
  return <Table data={data} />;
}
```

## 🎭 Role-Based Features

### User Roles
```javascript
USER_ROLES = {
  : '',     // Full access
  ADMIN: 'ADMIN',     // Most features
  MEDIA: 'MEDIA',     // News management
  AUDIT: 'AUDIT',     // Review changes
  LGA: 'LGA'          // LGA-specific
}
```

### Conditional Rendering
```jsx
{user?.role === '' && (
  <Button onClick={handleDelete}>Delete</Button>
)}
```

## 📋 Forms with React Hook Form + Zod

### Form Setup
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short')
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 🛣️ Adding New Routes

### Public Route
```jsx
// In AppRouter.jsx
<Route element={<PublicLayout />}>
  <Route path="/my-page" element={<MyPage />} />
</Route>
```

### Dashboard Route (Protected)
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['', 'ADMIN']}>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route path="my-feature" element={<MyFeature />} />
</Route>
```

## 🎨 Styling Guidelines

### Do's
✅ Use Tailwind utilities first
✅ Use design tokens (`.btn`, `.card`, `.input`)
✅ Keep responsive (`sm:`, `md:`, `lg:`)
✅ Use semantic HTML (`<header>`, `<main>`, `<nav>`)

### Don'ts
❌ Don't create new CSS files
❌ Don't use inline styles (unless dynamic)
❌ Don't hardcode colors (use tokens)
❌ Don't skip accessibility attributes

## 🐛 Debugging

### Common Issues

**White screen on load:**
```bash
# Check console for import errors
# Verify all dependencies installed
npm install
```

**Routing not working:**
```jsx
// Ensure BrowserRouter wraps App in main.jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

**Tailwind classes not working:**
```bash
# Verify vite.config.js has @tailwindcss/vite plugin
# Check index.css has @import "tailwindcss"
```

## 📚 Useful Links

- [React Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Headless UI](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## 🔧 Environment Variables

```env
# .env file
VITE_API_BASE_URL=http://localhost:5000/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## ✅ Pre-Commit Checklist

- [ ] No console.log statements
- [ ] No unused imports
- [ ] Forms validate correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard nav works)
- [ ] No TypeScript/ESLint errors
- [ ] Images have alt text
- [ ] Buttons have aria-labels if icon-only

## 🚨 Emergency Contacts

**Frontend Lead**: [Name]  
**Backend API**: [Contact]  
**DevOps**: [Contact]  

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (Phase 1)
