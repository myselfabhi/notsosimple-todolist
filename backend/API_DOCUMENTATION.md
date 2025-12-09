# NotSoSimple ToDo API Documentation

## Base URL

```
http://localhost:3001/api/tasks
```

## Data Model

### Task Object

```typescript
interface Task {
  id: string;           // Unique identifier (timestamp-based)
  title: string;       // Task description
  completed: boolean;  // Completion status
  createdAt: string;   // ISO 8601 timestamp (creation time)
  updatedAt: string;   // ISO 8601 timestamp (last update time)
}
```

---

## Endpoints

### 1. List All Tasks

Retrieve all tasks, optionally filtered by completion status.

**Endpoint:** `GET /api/tasks`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `completed` | string | No | Filter by completion status. Values: `"true"` or `"false"` |

**Request Example:**

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Get only completed tasks
curl http://localhost:3001/api/tasks?completed=true

# Get only incomplete tasks
curl http://localhost:3001/api/tasks?completed=false
```

**Response:**

**Status Code:** `200 OK`

```json
[
  {
    "id": "1765210887747",
    "title": "Sleep by 12",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "1765210887748",
    "title": "Complete project",
    "completed": true,
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Error Responses:**

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to fetch tasks",
  "message": "Error details"
}
```

---

### 2. Create Task

Create a new task and return the complete updated list.

**Endpoint:** `POST /api/tasks/create-task`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New task title"
}
```

**Request Example:**

```bash
curl -X POST http://localhost:3001/api/tasks/create-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'
```

**Response:**

**Status Code:** `201 Created`

Returns the complete list of all tasks (newest first).

```json
[
  {
    "id": "1765210887749",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  {
    "id": "1765210887747",
    "title": "Sleep by 12",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**

- `400 Bad Request` - Validation error

```json
{
  "error": "Title is required and must be a non-empty string"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to create task",
  "message": "Error details"
}
```

---

### 3. Update Task

Update an existing task and return the complete updated list.

**Endpoint:** `PUT /api/tasks/update-task`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "id": "1765210887747",
  "title": "Updated task title"
}
```

**Request Example:**

```bash
curl -X PUT http://localhost:3001/api/tasks/update-task \
  -H "Content-Type: application/json" \
  -d '{"id":"1765210887747","title":"Sleep by 11 PM"}'
```

**Response:**

**Status Code:** `200 OK`

Returns the complete list of all tasks (newest first).

```json
[
  {
    "id": "1765210887747",
    "title": "Sleep by 11 PM",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
]
```

**Error Responses:**

- `400 Bad Request` - Validation error

```json
{
  "error": "ID and title are required"
}
```

- `404 Not Found` - Task not found

```json
{
  "error": "Task not found"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to update task",
  "message": "Error details"
}
```

---

### 4. Delete Task

Delete a single task by ID.

**Endpoint:** `DELETE /api/tasks/:id`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Task ID |

**Request Example:**

```bash
curl -X DELETE http://localhost:3001/api/tasks/1765210887747
```

**Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**

- `404 Not Found` - Task not found

```json
{
  "error": "Task not found"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to delete task",
  "message": "Error details"
}
```

---

### 5. Toggle Task Completion

Toggle the completion status of a task and return the complete updated list.

**Endpoint:** `PATCH /api/tasks/:id/complete`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Task ID |

**Request Example:**

```bash
curl -X PATCH http://localhost:3001/api/tasks/1765210887747/complete
```

**Response:**

**Status Code:** `200 OK`

Returns the complete list of all tasks (newest first).

```json
[
  {
    "id": "1765210887747",
    "title": "Sleep by 12",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:45:00.000Z"
  }
]
```

**Error Responses:**

- `404 Not Found` - Task not found

```json
{
  "error": "Task not found"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to toggle task completion",
  "message": "Error details"
}
```

---

### 6. Bulk Delete Tasks

Delete multiple tasks at once.

**Endpoint:** `DELETE /api/tasks/bulk`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "ids": ["1765210887747", "1765210887748", "1765210887749"]
}
```

**Request Example:**

```bash
curl -X DELETE http://localhost:3001/api/tasks/bulk \
  -H "Content-Type: application/json" \
  -d '{"ids":["1765210887747","1765210887748"]}'
```

**Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Tasks deleted successfully",
  "deletedCount": 2
}
```

**Error Responses:**

- `400 Bad Request` - Validation error

```json
{
  "error": "IDs array is required and must not be empty"
}
```

- `500 Internal Server Error` - Server error

```json
{
  "error": "Failed to delete tasks",
  "message": "Error details"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid request data |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed error description (optional)"
}
```

---

## Notes

1. **Task Ordering:** All list responses are sorted by `createdAt` in descending order (newest first).

2. **ID Generation:** Task IDs are generated using `Date.now().toString()`, ensuring uniqueness based on timestamp.

3. **Timestamps:** All timestamps are in ISO 8601 format (UTC timezone).

4. **Auto-generated Fields:**
   - `id`: Generated automatically on creation
   - `completed`: Defaults to `false` on creation
   - `createdAt`: Set automatically on creation
   - `updatedAt`: Updated automatically on every modification

5. **List Updates:** Create, Update, and Toggle operations return the complete updated task list, not just the modified task.

6. **Filtering:** The list endpoint supports filtering by completion status using the `completed` query parameter.

---

## Example Workflow

### Complete CRUD Example

```bash
# 1. List all tasks
curl http://localhost:3001/api/tasks

# 2. Create a new task
curl -X POST http://localhost:3001/api/tasks/create-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn MongoDB"}'

# 3. Update the task
curl -X PUT http://localhost:3001/api/tasks/update-task \
  -H "Content-Type: application/json" \
  -d '{"id":"1765210887747","title":"Master MongoDB"}'

# 4. Toggle completion
curl -X PATCH http://localhost:3001/api/tasks/1765210887747/complete

# 5. Get only completed tasks
curl http://localhost:3001/api/tasks?completed=true

# 6. Delete the task
curl -X DELETE http://localhost:3001/api/tasks/1765210887747
```

---

## Testing

### Using cURL

All examples above use `curl`. Make sure your backend server is running on `http://localhost:3001`.

### Using Postman/Insomnia

1. Import the endpoints
2. Set base URL: `http://localhost:3001/api/tasks`
3. Set headers: `Content-Type: application/json` for POST/PUT/DELETE requests
4. Use the request examples above

### Using JavaScript Fetch

```javascript
// List tasks
const response = await fetch('http://localhost:3001/api/tasks');
const tasks = await response.json();

// Create task
const newTask = await fetch('http://localhost:3001/api/tasks/create-task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New task' })
});

// Update task
const updated = await fetch('http://localhost:3001/api/tasks/update-task', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: '123', title: 'Updated title' })
});

// Toggle completion
const toggled = await fetch('http://localhost:3001/api/tasks/123/complete', {
  method: 'PATCH'
});

// Delete task
const deleted = await fetch('http://localhost:3001/api/tasks/123', {
  method: 'DELETE'
});

// Bulk delete
const bulkDeleted = await fetch('http://localhost:3001/api/tasks/bulk', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: ['123', '456'] })
});
```

---

## Version

**API Version:** 1.0.0

**Last Updated:** 2024-01-15



