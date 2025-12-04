# MedSync API Documentation

## Base URL
```
http://localhost:8081
```

## Authentication

All protected routes require a JWT token in the header:
```
x-auth-token: <your-jwt-token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Register Hospital
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "City Hospital",
  "email": "hospital@example.com",
  "password": "securepassword123",
  "role": "hospital",
  "departments": ["Cardiology", "Neurology"],
  "availableServices": ["OPD", "Emergency"],
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile
```http
GET /auth/profile
```
*Requires authentication*

---

## Hospital Endpoints

### Get All Hospitals
```http
GET /hospitalapi
```

### Get Hospital by ID
```http
GET /hospitalapi/:id
```

### Search Hospitals
```http
GET /hospitalapi/search?city=Mumbai&department=Cardiology
```

---

## Appointment Endpoints

### Book Appointment
```http
POST /appointments/register
```

**Request Body:**
```json
{
  "hospitalId": "hospital-id",
  "doctorId": "doctor-id",
  "date": "2025-12-15",
  "time": "10:00 AM",
  "reason": "General checkup"
}
```

### Get Available Slots
```http
GET /appointments/available-slots?hospitalId=xxx&date=2025-12-15
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message here"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
