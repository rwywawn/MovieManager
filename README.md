# Movie Management Service

This project is an Apollo GraphQL API for managing a list of movies. The backend is designed using Node.js and data is
stored in PostgreSQL database using Prisma ORM.

## Features

- User Authentication: SignUp, Login, Change Password.
- CRUD operations on the 'Movies' entity.
- Querying and Searching movies by multiple properties.
- Requests are authenticated via JWT tokens.

## Installation

1. Clone the repository


2. Install all dependencies

`npm install`

3. Setup environment variables

```env
DATABASE_URL=postgresql://ryanx@localhost:5432/mydatabase
JWT_SECRET=secrettoken
```

4. Create and seed the database

```
npx prisma generate
npx prisma migrate dev --name init
```

5. Launch the GraphQL server

`
npm run dev
`

6. Navigate to `http://localhost:4000` and test the API in the sandbox

## Documentation

Refer to GraphQL API sandbox after you run the server
