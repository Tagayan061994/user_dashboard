# Data Grid Component API Server

A Node.js backend server providing APIs for the interactive data grid component.

## Features

- RESTful API design
- TypeScript for type safety
- Express framework
- In-memory caching for improved performance
- Input validation
- Optimized search functionality
- Rate limiting
- Error handling middleware
- Modular code organization (MVC pattern)

## Project Structure

```
server/
├── src/                  # Source code
│   ├── config/           # Configuration settings
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models and validation
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── types.ts          # TypeScript type definitions
│   └── index.ts          # Entry point
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm >= 6.x

### Installation

1. Install dependencies
   ```
   npm install
   ```

### Development

1. Start development server with hot reload
   ```
   npm run dev
   ```

### Production

1. Build for production
   ```
   npm run build
   ```

2. Start production server
   ```
   npm start
   ```

## API Endpoints

### Users

- `GET /api/users` - Get all users or search users
  - Query params:
    - `query`: Search string (optional)
- `GET /api/users/:id` - Get a single user by ID

### Tasks

- `GET /api/tasks` - Get all tasks data
- `GET /api/tasks/:id` - Get a task row by ID
- `PATCH /api/tasks/:rowId/cells/:columnId` - Update a cell in a task row

## Performance Optimizations

1. **Caching**: In-memory caching system for query results and frequently accessed data.
2. **Efficient Search**: Optimized text search with token-based indexing for better performance.
3. **Rate Limiting**: Protection against excessive requests.
4. **Request Validation**: Early validation to fail fast and save resources.

## Architecture Decisions

- **Modular Structure**: Separating concerns for better code organization and maintenance.
- **RESTful Design**: Following REST principles for API design.
- **Stateless**: No server-side state management for better scalability.
- **Validation First**: Validate input early to prevent processing invalid data.
- **Optimized Data Access**: Using in-memory data structures for efficient data retrieval.

## Error Handling

- Custom error classes for different types of errors
- Global error handling middleware
- Consistent error response format
