# alysia Backend

A NestJS backend application for the Alysia project.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd alysia-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application in production mode
- `npm run dev` - Start the application in development mode
- `npm run test` - Run tests
- `npm run lint` - Run linting

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

## Project Structure

```
src/
├── common/          # Common utilities, guards, filters, etc.
├── config/          # Configuration files
├── modules/         # Feature modules
└── main.ts         # Application entry point
```

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT
