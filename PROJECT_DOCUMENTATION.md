# 🚀 Broker Connect Server - Complete Documentation

**Version:** 2.0.0  
**Status:** Production-Ready (with caveats)  
**Last Updated:** March 1, 2026

---

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [API Endpoints](#api-endpoints)
5. [Features](#features)
6. [Limitations & Known Issues](#limitations--known-issues)
7. [Constraints & Specifications](#constraints--specifications)
8. [Environment Setup](#environment-setup)
9. [Deployment Guide](#deployment-guide)
10. [Testing Guide](#testing-guide)

---

## 📖 PROJECT OVERVIEW

**Broker Connect** is a REST API backend for a real estate brokerage platform. It enables brokers to:
- Create and manage property listings (rent/sell)
- Handle user authentication and authorization
- Manage favorites and save properties
- Receive notifications about property changes
- Upload property images to cloud storage (Cloudinary)

### Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | LTS |
| Language | TypeScript | 5.5.4 |
| Framework | Express.js | 4.19.2 |
| Database | MongoDB | Atlas/Local |
| Authentication | JWT | 9.0.2 |
| File Storage | Cloudinary | 1.41.0 |
| File Upload | Multer | 2.0.2 |
| Logging | Winston | 3.19.0 |
| Security | Helmet | 7.1.0 |
| Documentation | Swagger/OpenAPI | 3.0.0 |

---

## 🏗️ ARCHITECTURE

### Layered Architecture
```
Requests
   ↓
Routes (v1/auth.routes, property.routes, etc)
   ↓
Controllers (Request handling, validation)
   ↓
Services (Business logic)
   ↓
Models (MongoDB schemas)
   ↓
Database (MongoDB)
```

### Directory Structure
```
src/
├── app.ts                        # Express app configuration
├── server.ts                     # Entry point
├── config/
│   ├── db.ts                    # MongoDB connection
│   ├── env.ts                   # Environment variables
│   └── property.lifecycle.ts    # Property state machine
├── controllers/                 # Route handlers
├── services/                    # Business logic
├── modals/                      # MongoDB models
├── routes/v1/                   # API endpoints
├── middlewares/                 # Express middlewares
├── validators/                  # Input validation
├── dtos/                        # Data transfer objects
├── enums/                       # TypeScript enums
├── types/                       # Custom types
├── utils/                       # Helper functions
├── docs/                        # Swagger/OpenAPI
└── jobs/                        # Background tasks (cron)
```

---

## 🛠️ SETUP & INSTALLATION

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)
- Git

### Installation Steps

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo-url>
   cd serverbrokerconnect
   npm install
   ```

2. **Setup Environment File** (see Environment Setup section)
   ```bash
   # Copy and configure for your environment
   cp .env.example .env
   # OR use:
   cp .env.local .env.development
   ```

3. **Build TypeScript**
   ```bash
   npm run build
   ```

4. **Start Server**
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

5. **Access API**
   ```
   http://localhost:4000/health     # Health check
   http://localhost:4000/           # API Info
   http://localhost:4000/docs       # Swagger UI
   http://localhost:4000/api/v1     # Base API endpoint
   ```

---

## 📡 API ENDPOINTS

### 1. **Authentication** (`/api/v1/auth`)

#### Register Broker
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "dob": "1990-01-15",
  "phone": "9876543210",
  "password": "SecurePass123!"
}

Response (201):
{
  "id": "mongo-id",
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current Broker Profile
```
GET /api/v1/auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": "mongo-id",
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "BROKER",
  "createdAt": "2026-03-01T...",
  "updatedAt": "2026-03-01T..."
}
```

#### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "message": "Logged out successfully"
}
```

---

### 2. **Broker Management** (`/api/v1/brokers`)

#### Get All Brokers
```
GET /api/v1/brokers?limit=20&skip=0

Response (200):
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 45,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

#### Get Own Profile
```
GET /api/v1/brokers/me
Authorization: Bearer <token>
```

#### Update Own Profile
```
PUT /api/v1/brokers/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "9876543210"
}

Response (200):
{
  "success": true,
  "data": {...},
  "message": "Profile updated successfully"
}
```

#### Get Broker Profile by ID
```
GET /api/v1/brokers/{brokerId}

Response (200):
{
  "success": true,
  "data": {
    "_id": "mongo-id",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "BROKER"
  }
}
```

---

### 3. **Properties** (`/api/v1/properties`)

#### Create Property Draft
```
POST /api/v1/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "listingType": "RENT",
  "propertyType": "APARTMENT",
  "bhkType": "2BHK",
  "pricing": {
    "price": 50000,
    "maintenance": 2000,
    "deposit": 150000
  },
  "address": {
    "line1": "123 Main Street",
    "locality": "Downtown",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "tenantsAllowed": ["Family"],
  "amenities": ["Lift", "Parking", "Security"],
  "availableFrom": "Immediate",
  "facing": "East"
}

Response (201):
{
  "id": "property-mongo-id",
  "status": "DRAFTED",
  ...
}
```

#### Update Property (while DRAFTED)
```
PATCH /api/v1/properties/{propertyId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricing": {
    "price": 55000,
    "maintenance": 2500,
    "deposit": 165000
  }
}

Response (200):
{
  "id": "property-mongo-id",
  "status": "DRAFTED",
  ...
}
```

#### Submit Property for Review
```
PATCH /api/v1/properties/{propertyId}/submit
Authorization: Bearer <token>

Response (200):
{
  "id": "property-mongo-id",
  "status": "UNVERIFIED"
}
```

#### Get My Properties
```
GET /api/v1/properties/me?status=ACTIVE
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "property-id",
    "status": "VERIFIED",
    ...
  }
]
```

#### Get Public Properties
```
GET /api/v1/properties/public?listingType=RENT&city=Mumbai&sort=NEWEST

Response (200):
[
  {
    "id": "property-id",
    "listingType": "RENT",
    "isFavorited": false,
    "broker": {
      "fname": "John",
      "lname": "Doe",
      "phone": "9876543210"
    },
    ...
  }
]

Query Parameters:
- listingType (required): RENT, SALE
- search (optional): Search by city, locality, or broker name
- bhkType (optional): 1BHK, 2BHK, 3BHK, ...
- furnishing (optional): unfurnished, semi_furnished, fully_furnished
- sort (optional): NEWEST, OLDEST
```

#### Get Property by ID
```
GET /api/v1/properties/{propertyId}
Authorization: Bearer <token>

Response (200):
{
  "id": "property-mongo-id",
  "listingType": "RENT",
  "status": "VERIFIED",
  ...
  "broker": {
    "fname": "John",
    "lname": "Doe",
    "phone": "9876543210",
    "email": "john@example.com"
  }
}
```

#### Delete Property (Soft Delete)
```
DELETE /api/v1/properties/{propertyId}
Authorization: Bearer <token>

Response (200):
{
  "success": true
}
```

#### Renew Property Listing
```
PATCH /api/v1/properties/{propertyId}/renew
Authorization: Bearer <token>
Content-Type: application/json

{
  "expiresAt": "2026-04-01T00:00:00Z"
}

Response (200):
{
  "id": "property-mongo-id",
  "expiresAt": "2026-04-01T00:00:00Z"
}
```

---

### 4. **Favorites** (`/api/v1/favorites`)

#### Add to Favorites
```
POST /api/v1/favorites/{propertyId}
Authorization: Bearer <token>

Response (201):
{
  "message": "Added to favorites"
}
```

#### Get My Favorites
```
GET /api/v1/favorites/my
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "property-id",
    "listingType": "RENT",
    ...
  }
]
```

#### Remove from Favorites
```
DELETE /api/v1/favorites/{propertyId}
Authorization: Bearer <token>

Response (200):
{
  "message": "Removed from favorites"
}
```

#### Check if Favorited
```
GET /api/v1/favorites/check/{propertyId}
Authorization: Bearer <token>

Response (200):
{
  "isFavorited": true
}
```

---

### 5. **Notifications** (`/api/v1/notifications`)

#### Get My Notifications
```
GET /api/v1/notifications?limit=20&skip=0&unreadOnly=false
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "notification-id",
      "type": "PROPERTY_EXPIRED",
      "message": "Your property listing has expired",
      "unread": true,
      "createdAt": "2026-03-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

#### Get Unread Count
```
GET /api/v1/notifications/unread-count
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

#### Mark Notification as Read
```
PATCH /api/v1/notifications/{notificationId}/read
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {...},
  "message": "Notification marked as read"
}
```

#### Mark All as Read
```
PATCH /api/v1/notifications/read-all
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "modifiedCount": 5,
    "success": true
  },
  "message": "All notifications marked as read"
}
```

#### Delete Notification
```
DELETE /api/v1/notifications/{notificationId}
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "success": true,
    "message": "Notification deleted"
  },
  "message": "Notification deleted"
}
```

---

### 6. **File Upload** (`/api/v1/upload`)

#### Upload Property Image
```
POST /api/v1/upload/property
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <file> (jpg, jpeg, png, webp only)

Response (200):
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "broker-connect/development/properties/...",
    "width": 1920,
    "height": 1920,
    "size": 245000
  }
}
```

**Allowed Formats:** jpg, jpeg, png, webp  
**Max Size:** Cloudinary default (100MB)  
**Autotransform:** Resized to 1920x1920 with auto quality

---

### 7. **Metadata** (`/api/v1/meta`)

#### Get Property Metadata
```
GET /api/v1/meta/property

Response (200):
{
  "success": true,
  "data": {
    "propertyTypes": ["APARTMENT", "VILLA", "TOWNHOUSE", "PLOT"],
    "floorLevels": ["GROUND", "LOW", "MID", "HIGH"],
    "furnishing": ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]
  }
}
```

---

## ✨ FEATURES

### ✅ FULLY IMPLEMENTED & WORKING

1. **Authentication**
   - ✅ User registration with email
   - ✅ Email validation (lowercase, trimmed)
   - ✅ Password hashing with bcrypt (10 rounds)
   - ✅ Login with JWT token generation
   - ✅ JWT token verification in middleware
   - ✅ 7-day token expiry
   - ✅ Logout (frontend-handled with token deletion)
   - ✅ Get current user profile

2. **Broker Management**
   - ✅ Get/update own profile
   - ✅ Browse all brokers (public)
   - ✅ Get broker details by ID
   - ✅ Role-based access (BROKER, ADMIN)

3. **Property Management**
   - ✅ Create properties in DRAFT status
   - ✅ Update properties (only in DRAFT status)
   - ✅ Submit for review (DRAFTED → UNVERIFIED)
   - ✅ Admin verification (UNVERIFIED → VERIFIED)
   - ✅ Automatic expiry for rental listings (30 days)
   - ✅ Manual renewal of listings
   - ✅ Soft deletion (isDeleted flag)
   - ✅ Status lifecycle validation
   - ✅ Only one primary image allowed
   - ✅ Auto-generate slug from property details

4. **Image Uploads**
   - ✅ Upload to Cloudinary
   - ✅ Auto-transform (resize to 1920x1920)
   - ✅ Auto-optimize format (fetch_format: auto, quality: auto)
   - ✅ Support for jpg, jpeg, png, webp
   - ✅ Return public_id and URL
   - ✅ Batch delete support
   - ✅ Environment-based folder structure (dev/prod)

5. **Favorites System**
   - ✅ Add property to favorites
   - ✅ Remove from favorites
   - ✅ Get all favorites
   - ✅ Check if favorited
   - ✅ Prevent favoriting own properties

6. **Notifications**
   - ✅ Send notifications to brokers
   - ✅ Get all notifications (with pagination)
   - ✅ Mark single notification as read
   - ✅ Mark all notifications as read
   - ✅ Delete notification
   - ✅ Get unread count
   - ✅ Unread status tracking

7. **Search & Filter**
   - ✅ Search properties by listing type
   - ✅ Search by city/locality
   - ✅ Search by broker name
   - ✅ Filter by BHK type
   - ✅ Filter by furnishing
   - ✅ Sort by newest/oldest
   - ✅ Pagination support

8. **Documentation & API**
   - ✅ Swagger UI at /docs
   - ✅ OpenAPI 3.0 specification
   - ✅ Health check endpoint
   - ✅ API info endpoint
   - ✅ Metadata endpoint

9. **Security**
   - ✅ Helmet headers protection
   - ✅ CORS configuration
   - ✅ Password hashing (bcryptjs)
   - ✅ JWT authentication
   - ✅ Request logging (Morgan)
   - ✅ Input validation

10. **Error Handling**
    - ✅ Centralized error middleware
    - ✅ Custom AppError class
    - ✅ Async handler wrapper
    - ✅ MongoDB duplicate key errors
    - ✅ Mongoose validation errors
    - ✅ Invalid ObjectId errors
    - ✅ JWT errors (invalid, expired)

11. **Logging**
    - ✅ Winston logger setup
    - ✅ Daily rotation logs
    - ✅ Error, warn, info, debug levels
    - ✅ Request logging with Morgan

12. **Database**
    - ✅ MongoDB connection pooling
    - ✅ Mongoose ODM with TypeScript
    - ✅ Proper indexes on collections
    - ✅ Field-level validation
    - ✅ Pre-save hooks (slug generation, validation)

---

### ⚠️ PARTIALLY IMPLEMENTED

1. **Property Lifecycle**
   - ⚠️ Manual verification needed (no auto-approve)
   - ⚠️ No admin endpoints for verification
   - ⚠️ Expiry is automatic but no cron job configured
   - ⚠️ No email notifications on status change

2. **Image Management**
   - ⚠️ No batch upload endpoint
   - ⚠️ No image type specification in upload (all marked as INTERIOR)
   - ⚠️ Mobile optimization URLs not generated

---

### ❌ NOT IMPLEMENTED

1. **Admin Features**
   - ❌ Admin verification endpoint
   - ❌ Admin dashboard metrics
   - ❌ Broker suspension/approval
   - ❌ Property approval workflow

2. **Notifications**
   - ❌ Email notifications not sent
   - ❌ SMS notifications not supported
   - ❌ Push notifications not supported
   - ❌ Notification preferences/settings
   - ❌ Real-time notifications (WebSocket)

3. **Advanced Features**
   - ❌ Property view tracking
   - ❌ Similar properties recommendation
   - ❌ Property valuation
   - ❌ Inquiry/lead management
   - ❌ Virtual tour integration
   - ❌ 360° photo support
   - ❌ Video upload support
   - ❌ Location-based search (geospatial)
   - ❌ Price range filtering
   - ❌ Saved searches

4. **Social Features**
   - ❌ Reviews and ratings
   - ❌ Messaging between brokers
   - ❌ Property comparison
   - ❌ Social sharing

5. **Analytics & Reporting**
   - ❌ Property view analytics
   - ❌ Lead generation reports
   - ❌ Broker performance metrics
   - ❌ Search analytics

6. **Authentication**
   - ❌ Social login (Google, Facebook)
   - ❌ Two-factor authentication
   - ❌ Password reset via email
   - ❌ Refresh token mechanism
   - ❌ Role-based access control (incomplete)

---

## 🔒 CONSTRAINTS & SPECIFICATIONS

### Authentication Constraints
- **Password Requirements:** No explicit complexity rules implemented
- **Token Type:** JWT with symmetric signing (HS256)
- **Token Expiry:** 7 days (hardcoded)
- **Sessions:** Stateless - no server-side session storage
- **Logout:** Client-side only (delete token locally)

### Property Constraints
- **Max Listing Images:** No limit enforced (schema allows unlimited)
- **Max Listing Duration:** 30 days auto-expiry for rentals (hardcoded)
- **Draft Limit:** No limit on unpublished drafts per broker
- **ListingTypes:** RENT, SALE (enum-based)
- **PropertyTypes:** APARTMENT, VILLA, TOWNHOUSE, PLOT, LAND
- **BHKTypes:** 1BHK, 2BHK, 3BHK, 4BHK, 5BHK
- **Only Rentals:** Support maintenance fee and deposit
- **Only Sales:** Price only (no maintenance/deposit)

### Notification Constraints
- **Max Stored:** No automatic cleanup/archival
- **Retention:** Indefinite (must be manually deleted)
- **Real-time:** HTTP polling only (no WebSocket)
- **Read Status:** Only unread/read boolean (no timestamps)

### File Upload Constraints
- **Max File Size:** 100MB (Cloudinary default)
- **Allowed Formats:** jpg, jpeg, png, webp only
- **Folder Structure:** `broker-connect/{NODE_ENV}/properties/`
- **Auto-transform:** Resized to 1920x1920 with auto quality
- **CDN Delivery:** Via Cloudinary CDN

### Database Constraints
- **Connection Timeout:** 10 seconds
- **Max Connections:** MongoDB default (50 in local, 100 in Atlas)
- **Indexes:** Defined on:
  - `brokerId` (single)
  - `status` (single)
  - `listingType + propertyType` (compound)
  - `pricing.price` (single)
  - `address.city + address.locality` (compound)
  - `amenities` (single)
  - `createdAt` (descending)
  - Location geospatial (2dsphere)

### API Rate Limiting
- ❌ **NOT IMPLEMENTED** - No rate limiting middleware

### CORS Constraints
- **Allow Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allow Headers:** Content-Type, Authorization
- **Credentials:** Enabled (cookies can be sent)
- **Origins:** Configurable via CORS_ORIGIN env var

---

## 🌍 ENVIRONMENT SETUP

### Environment Variables Required

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Deployment environment |
| `PORT` | 4000 | Server port |
| `MONGO_URI` | - | MongoDB connection string (REQUIRED) |
| `JWT_SECRET` | - | JWT signing key, min 32 chars (REQUIRED) |
| `JWT_EXPIRE` | 7d | Token expity time |
| `CLOUDINARY_CLOUD_NAME` | - | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | - | Cloudinary API secret |
| `CORS_ORIGIN` | * | Comma-separated allowed origins |
| `LOG_LEVEL` | info | Winston log level |
| `LOG_DIR` | logs | Log directory path |
| `ENABLE_SWAGGER` | true | Enable Swagger UI |
| `ENABLE_MOCK_DATA` | false | Enable mock data generation |

### Local Development (.env.local)
```dotenv
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/topnotch
JWT_SECRET=dev-secret-key-min-32-chars-for-testing
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
LOG_LEVEL=debug
ENABLE_SWAGGER=true
```

### Staging (.env.staging)
```dotenv
NODE_ENV=staging
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster-staging.mongodb.net/broker-connect-staging
JWT_SECRET=<generate-with-openssl-rand-hex-32>
CLOUDINARY_CLOUD_NAME=staging_cloud_name
CLOUDINARY_API_KEY=staging_api_key
CLOUDINARY_API_SECRET=staging_api_secret
CORS_ORIGIN=https://staging.broker-connect.com
LOG_LEVEL=info
ENABLE_SWAGGER=true
```

### Production (.env.production)
```dotenv
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://produser:secure@cluster-prod.mongodb.net/broker-connect
JWT_SECRET=<generate-with-openssl-rand-hex-32>
CLOUDINARY_CLOUD_NAME=prod_cloud_name
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret
CORS_ORIGIN=https://broker-connect.com,https://app.broker-connect.com
LOG_LEVEL=warn
ENABLE_SWAGGER=false
```

---

## 📦 DEPLOYMENT GUIDE

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy (automatic)

See `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Option 2: Docker (Self-Hosted)
```bash
# Build image
docker build -t broker-connect-api .

# Run container
docker run -p 4000:4000 \
  -e MONGO_URI="..." \
  -e JWT_SECRET="..." \
  broker-connect-api
```

### Option 3: Traditional Server (AWS/Digital Ocean)
1. SSH into server
2. Install Node.js and npm
3. Clone repository
4. `npm install`
5. `npm run build`
6. Set environment variables
7. `npm start`
8. Use PM2 to manage process

---

## 🧪 TESTING GUIDE

### Using Postman
1. Import the provided Postman collection
2. Set environment variables (baseUrl, token)
3. Run requests in order (register → login → create property, etc.)

### Using cURL
```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "dob": "1990-01-15",
    "phone": "9876543210",
    "password": "Password123!"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'

# Get properties
curl -X GET "http://localhost:4000/api/v1/properties/public?listingType=RENT" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API Testing Checklist
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health check endpoint responds
- [ ] Swagger UI loads at /docs
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Authenticated endpoints require token
- [ ] Create property with valid data
- [ ] Update property draft
- [ ] Submit property for review
- [ ] Upload image to property
- [ ] Search/filter properties
- [ ] Add/remove from favorites
- [ ] Create and read notifications
- [ ] Mark notifications as read
- [ ] Delete property (soft delete)
- [ ] Error handling works (invalid input, missing auth, etc.)

---

## 🔧 TROUBLESHOOTING

### MongoDB Connection Fails
```
Error: MongoDB connection failed
Solution: Check MONGO_URI if valid and network accessible
```

### JWT Secret Missing
```
Error: JWT_SECRET is not set
Solution: Set JWT_SECRET env variable (min 32 characters)
```

### Cloudinary Upload Fails
```
Error: Upload failed - credentials
Solution: Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET are correct
```

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Add frontend URL to CORS_ORIGIN env variable
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use
Solution: Change PORT env variable or kill process on port 4000
```

---

## 📝 DATABASE SCHEMA

### Broker Collection
```javascript
{
  _id: ObjectId,
  fname: String,
  lname: String,
  dob: Date,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (enum: BROKER, ADMIN),
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Property Collection
```javascript
{
  _id: ObjectId,
  brokerId: ObjectId (ref: Broker),
  listingType: String (RENT, SALE),
  status: String (DRAFTED, UNVERIFIED, VERIFIED, EXPIRED),
  propertyType: String,
  bhkType: String,
  pricing: {
    price: Number,
    maintenance: Number,
    deposit: Number
  },
  address: {
    line1: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: [lat, lng]
  },
  images: [{
    url: String,
    type: String,
    isPrimary: Boolean
  }],
  amenities: [String],
  isFavorited: Boolean,
  isDeleted: Boolean,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  _id: ObjectId,
  brokerId: ObjectId (ref: Broker),
  type: String (enum: PROPERTY_EXPIRED, etc),
  message: String,
  unread: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Favorite Collection
```javascript
{
  _id: ObjectId,
  broker: ObjectId (ref: Broker),
  property: ObjectId (ref: Property),
  createdAt: Date
}
```

---

## 🚀 FUTURE ROADMAP

### Q2 2026
- [ ] Email notifications on property status change
- [ ] Admin dashboard and verification workflow
- [ ] Property view analytics
- [ ] Real-time notifications (WebSocket)

### Q3 2026
- [ ] Messaging between brokers
- [ ] Property comparison tool
- [ ] Advanced geospatial search
- [ ] Virtual tour integration

### Q4 2026
- [ ] Mobile app API versioning
- [ ] Inquiry/lead management
- [ ] Reviews and ratings
- [ ] AI-powered recommendations

---

## 📞 SUPPORT

For issues, questions, or feature requests, please open a GitHub issue or contact the development team.

---

**Last Updated:** March 1, 2026
**Maintained By:** Topnotch Development Team
**License:** MIT
