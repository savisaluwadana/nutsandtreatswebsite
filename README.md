# Nuts N Treats Website

An e-commerce website for selling premium nuts, dried fruits, and healthy snacks.

## Technologies Used

- React with TypeScript
- Vite as the build tool
- Tailwind CSS for styling
- Supabase for backend (authentication and database)

## Setting Up Supabase Backend

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Set up your database with the provided schema:
   - Go to the SQL editor in your Supabase dashboard
   - Copy the contents of `schema.sql` and run it
   - Then copy the contents of `seed.sql` and run it to populate with sample data

4. Get your Supabase URL and anon key from the API settings
5. Create a `.env` file in the project root based on `.env.example` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Features

- Product catalog with categories
- User authentication (signup, login, logout)
- Shopping cart functionality
- Product search
- Order management
- User profiles

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Authentication

The project uses Supabase Authentication to handle user sign up, sign in, and session management. Features include:

- Email and password authentication
- Session management
- Protected routes for user account pages
- User profiles
