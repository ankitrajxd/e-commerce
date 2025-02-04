# Full Stack E-Commerce

Full-stack e-commerce application designed to provide a seamless shopping experience. It features user authentication, product listings, and a shopping cart, all built with a robust and scalable tech stack.

## Features

- User Authentication (Sign Up, Sign In, Sign Out)
- Product Listings with detailed views
- Shopping Cart functionality (With guest Cart)
- Responsive design
- Dark mode support
- Payment Gateway (soon)
- Admin Panel (soon)

## Tech Stack

### Frontend

- **Next.js**: A React framework for server-side rendering and generating static websites.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ShadCn UI**: A set of accessible, unstyled UI components for building high-quality design systems and web apps.
- **Lucide Icons**: A collection of simple and consistent icons.

### Backend

- **Auth.js**: Authentication for Next.js applications.
- **Prisma**: An ORM for Node.js and TypeScript.
- **Neon**: A serverless PostgreSQL database.

### Other Tools

- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **PostCSS**: A tool for transforming CSS with JavaScript plugins.
- **Zod**: A TypeScript-first schema declaration and validation library.

# Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repoUrl>
```

2. Install dependencies:

```bash
npm install or npm install --legacy-peer-deps 
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
DATABASE_URL=your_database_url
NEXT_PUBLIC_APP_NAME=ecommerce
NEXT_PUBLIC_APP_DESCRIPTION=Modern Ecommerce Store
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

AUTH_SECRET=your_auth_secret (random string or use a generator like crypto.randomBytes(32).toString('hex'))

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the db (Make sure the code is uncommented. It is commented to avoid seeding the db every time the server starts):

```bash
npx tsx ./db/seed
```

6. Start the development server:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
