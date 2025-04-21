# Interactive Data Grid Component

A reusable data grid component that handles varying data types and demonstrates understanding of React patterns, TypeScript, and a pluggable component architecture.

## Features

- Pluggable architecture for custom cell renderers and editors
- Type-safe component development with TypeScript
- Multi-user selector cell with autocomplete
- Responsive design with Material-UI
- Server-side data fetching

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- Vite (for fast development and building)

### Backend
- Node.js
- Express
- TypeScript

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── DataGrid/   # Data grid component and related files
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── src/                # Server source code
│   └── package.json        # Backend dependencies
└── package.json            # Root package.json for managing both applications
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd interactive-data-grid
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Development

1. Start the development server:
   ```
   npm run dev
   ```

   This will start both the frontend and backend servers concurrently.

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Building for Production

1. Build both client and server:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Architecture Decisions

### Pluggable System

The component uses a registry-based plugin system where cell renderers and editors can be dynamically registered and used based on cell types. This allows for:

- Easy extension with new cell types
- Reusability across different projects
- Clean separation of concerns

### State Management

The component uses React Context API for state management, providing a clean way to:

- Share state between components
- Update cell values
- Handle selection and editing states

### Performance Optimizations

- Memoization of components using React.memo
- Optimized rendering with controlled updates
- Virtualization for large datasets (planned for future enhancement)

## Future Improvements

- Virtualized rows for handling very large datasets
- Draggable columns for reordering
- Column resizing
- Filtering and sorting capabilities
- Client-side caching of API responses
- More cell types (checkbox, dropdown, date picker, etc.)

## Assumptions Made

- The data structure will remain consistent with the defined interfaces
- The server API will follow the specified format
- Users have modern browsers that support ES6+ features
