# Database Schema Documentation

## User Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Required
  email: String,          // Required, unique
  password: String,       // Hashed with bcrypt
  role: String,           // "user" | "hospital" | "admin"
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Hospital Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Required
  email: String,          // Required, unique
  password: String,       // Hashed
  role: "hospital",
  departments: [String],  // ["Cardiology", "Neurology", ...]
  availableServices: [String], // ["OPD", "Emergency", ...]
  doctors: [{
    name: String,
    specialization: String,
    experience: Number,
    available: Boolean,
    timings: {
      start: String,
      end: String
    }
  }],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    emergency: String
  },
  ratings: {
    average: Number,
    count: Number
  },
  appointments: [{
    patientId: ObjectId,
    doctorId: ObjectId,
    date: Date,
    time: String,
    status: String,     // "pending" | "confirmed" | "completed" | "cancelled"
    reason: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Newsletter Collection

```javascript
{
  _id: ObjectId,
  email: String,          // Required, unique
  subscribedAt: Date,
  active: Boolean
}
```

## Indexes

### User Collection
- `email`: unique index

### Hospital Collection
- `email`: unique index
- `address.city`: index for search
- `departments`: index for filtering

## Relationships

```
User (1) -----> (N) Appointments
Hospital (1) -----> (N) Doctors
Hospital (1) -----> (N) Appointments
```
