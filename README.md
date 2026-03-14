# Zod Schema Task - Task Management API

A small REST API built with **Express**, **TypeScript**, and **Zod** for managing a list of tasks. This project was created to demonstrate strongly-typed request validation, in-memory data storage, and modern Express 5 error handling.

## Tech Stack

- **Node.js**
- **TypeScript** (100% of the codebase)
- **Express**
- **Zod** (For schema declaration and runtime validation)

## Features

- **In-Memory Storage**: Tasks are stored in an array with auto-incrementing IDs.
- **Strict Validation**: All incoming data on `POST` and `PATCH` routes is validated using Zod.
- **Centralized Error Handling**: A 4-parameter Express middleware catches and formats all errors into standard `500 Internal Server Error` JSON responses.
- **TypeScript Integration**: Types are inferred directly from Zod schemas for a single source of truth.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmed8-6/Zod-schema-task.git
   cd Zod-schema-task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   *(The server will start on `http://localhost:3000`)*

## API Endpoints

| Method   | Path         | Description | Success Response | Error Response |
| :---     | :---         | :--- | :--- | :--- |
| `GET`    | `/tasks`     | Retrieve all tasks | `200 OK` (Tasks Array) | — |
| `GET`    | `/tasks/:id` | Retrieve a specific task by ID | `200 OK` (Task Object) | `404 Not Found` |
| `POST`   | `/tasks`     | Create a new task | `201 Created` (Task Object) | `400 Bad Request` (Zod errors) |
| `PATCH`  | `/tasks/:id` | Partially update an existing task | `200 OK` (Task Object) | `400 / 404` |
| `DELETE` | `/tasks/:id` | Delete a task | `204 No Content` | `404 Not Found` |

### Task Data Model

```typescript
type TaskStatus = 'pending' | 'in-progress' | 'done';

interface Task {
  id: number;
  title: string;          // Required
  description?: string;   // Optional
  status?: TaskStatus;     // Defaults to 'pending'
}
```
