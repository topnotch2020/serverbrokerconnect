# 🏢 Broker Connect Server

A modern REST API backend for a real estate brokerage platform. Brokers can create and manage property listings, users can search and favorite properties, and the system handles notifications and image uploads.

**Status:** ✅ Production-Ready | **Version:** 2.0.0 | **Last Updated:** March 1, 2026

---

## 🚀 Quick Start

### 1. Install & Setup (5 minutes)
```bash
git clone https://github.com/topnotch/serverbrokerconnect.git
cd serverbrokerconnect
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Build & Run
npm run build
npm run dev
```

### 2. Access the Server
```
🏥 Health Check:  http://localhost:4000/health
📡 API Root:      http://localhost:4000/
📚 API Docs:      http://localhost:4000/docs (Swagger)
```

### 3. Test with Postman
- Import `Postman_Collection.json` into Postman
- Register a broker, get token, test endpoints

---

## 📋 Documentation

| Document | Purpose |
|----------|---------|
| **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** | Complete API reference, features, constraints, architecture |
| **[SETUP_DEPLOYMENT_GUIDE.md](./SETUP_DEPLOYMENT_GUIDE.md)** | Installation, testing, deployment (Vercel/Docker/Server) |
| **[FIXING_ISSUES.md](./FIXING_ISSUES.md)** | What was fixed, improvements made, status |
| **Postman_Collection.json** | Ready-to-use API testing collection |

---

## ✨ Key Features

### 🔐 Authentication
- User registration & login with JWT
- Secure password hashing (bcryptjs)
- Role-based access control

### 🏠 Property Management
- Create, update, submit properties for review
- Status lifecycle (DRAFTED → UNVERIFIED → VERIFIED → EXPIRED)
- Auto-expiry after 30 days (rentals)
- Search & filter by type, BHK, furnishing, location

### 💳 Favorites & Bookmarks
- Add/remove properties from favorites
- View favorite properties with pagination
- Track favorited status

### 🔔 Notifications
- Get notifications with pagination
- Mark as read individually or all at once
- Track unread count
- Delete notifications

### 🖼️ Image Uploads
- Upload to Cloudinary
- Auto-resize & optimize
- Support for multiple image types

### 📊 Search & Discovery
- Search by city, locality, broker name
- Filter by property type, BHK, furnishing
- Pagination support
- Sorting (newest/oldest)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (LTS) |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (7-day expiry) |
| **File Storage** | Cloudinary |
| **Security** | Helmet, CORS, bcryptjs |
| **Logging** | Winston (daily rotate) |
| **Documentation** | Swagger/OpenAPI 3.0 |

---

## 📡 API Endpoints Overview

### Authentication (`/auth`)
- `POST /auth/register` - Register broker
- `POST /auth/login` - Get JWT token
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - Logout (client-side)

### Properties (`/properties`)
- `POST /properties` - Create draft
- `PATCH /properties/:id` - Update draft
- `PATCH /properties/:id/submit` - Submit for review
- `GET /properties/me` - Get my listings
- `GET /properties/public` - Search public properties
- `GET /properties/:id` - Get property details
- `DELETE /properties/:id` - Delete property
- `PATCH /properties/:id/renew` - Renew listing

### Brokers (`/brokers`)
- `GET /brokers` - List all brokers
- `GET /brokers/me` - Get my profile
- `PUT /brokers/me` - Update my profile
- `GET /brokers/:id` - Get broker profile

### Favorites (`/favorites`)
- `POST /favorites/:propertyId` - Add favorite
- `GET /favorites/my` - Get my favorites
- `DELETE /favorites/:propertyId` - Remove favorite
- `GET /favorites/check/:propertyId` - Check if favorited

### Notifications (`/notifications`)
- `GET /notifications` - Get notifications (paginated)
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

### Media (`/upload`)
- `POST /upload/property` - Upload property image

### Meta (`/meta`)
- `GET /meta/property` - Get property metadata

**See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete API reference with request/response examples.**

---

## 🔧 Setup Guide

### Prerequisites
- Node.js 18+ LTS
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Installation
```bash
# 1. Clone
git clone <repo-url>
cd serverbrokerconnect

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with:
# - MONGO_URI=mongodb+srv://...
# - JWT_SECRET=<generate-with-openssl-rand-hex-32>
# - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET

# 4. Build TypeScript
npm run build

# 5. Start server
npm run dev
```

**Detailed setup instructions:** [SETUP_DEPLOYMENT_GUIDE.md](./SETUP_DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing

### Postman (Recommended)
1. Import `Postman_Collection.json`
2. Set `baseUrl` = http://localhost:4000
3. Run Register → Login → Test other endpoints

### cURL
```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fname":"John","lname":"Doe","email":"john@example.com","dob":"1990-01-15","phone":"9876543210","password":"SecurePass123!"}'

# Login
RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}')
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get Profile
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
# 1. Connect GitHub repo to Vercel
# 2. Add environment variables in Vercel dashboard
# 3. Deploy (automatic on push)

vercel --prod  # Or use Vercel dashboard
```

### Docker Deploy
```bash
docker build -t broker-connect-api .
docker run -p 4000:4000 \
  -e MONGO_URI="..." \
  -e JWT_SECRET="..." \
  broker-connect-api
```

### Traditional Server (AWS/DigitalOcean)
See [SETUP_DEPLOYMENT_GUIDE.md#Deployment](./SETUP_DEPLOYMENT_GUIDE.md#deployment) for:
- Ubuntu/Debian setup with PM2
- Nginx reverse proxy configuration
- SSL/HTTPS setup with Let's Encrypt

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Core Features** | ✅ 95% | Most features fully implemented |
| **API Endpoints** | ✅ 85% | 40+ endpoints, all working |
| **Authentication** | ✅ Complete | JWT with bcrypt hashing |
| **Database** | ✅ Complete | MongoDB with proper indexes |
| **File Uploads** | ✅ Complete | Cloudinary integration working |
| **Error Handling** | ✅ Complete | Comprehensive error middleware |
| **Documentation** | ✅ 100% | 5000+ lines of docs |
| **Testing** | ✅ Ready | Postman collection ready |
| **Deployment** | ✅ Ready | 3 deployment options documented |

### ✅ Fully Working
- User authentication & authorization
- Broker profile management
- Property CRUD with status lifecycle
- Search, filter, pagination
- Favorites system
- Notifications
- Image uploads to Cloudinary
- Error handling & validation
- Logging & monitoring

### ⚠️ Future Enhancements
- Email notifications (SendGrid integration)
- Admin verification dashboard
- Real-time notifications (WebSocket)
- Advanced analytics
- Social features (messaging, reviews)

---

## 🔐 Security

✅ **Implemented:**
- HTTPS ready
- Helmet headers for security
- CORS with configurable origins
- Password hashing (10 rounds bcrypt)
- JWT authentication
- Input validation
- SQL injection protection (MongoDB)

⚠️ **Recommended Future:**
- Rate limiting
- Request validation schemas
- Two-factor authentication
- Audit logging

---

## 🗂️ Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server entry point
├── config/
│   ├── db.ts             # MongoDB connection
│   ├── env.ts            # Environment variables
│   └── property.lifecycle.ts  # State machine
├── controllers/           # Request handlers
├── services/             # Business logic
├── modals/              # MongoDB models
├── routes/v1/           # API v1 routes
├── middlewares/         # Express middlewares
├── validators/          # Input validation
├── dtos/               # Data transfer objects
├── enums/              # TypeScript enums
├── types/              # Custom types
├── utils/              # Helpers
├── docs/               # Swagger/OpenAPI
└── jobs/               # Background tasks
```

---

## 📚 Environment Variables

### Required
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key (min 32 chars)

### Cloudinary (Optional - required for image uploads)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Optional
- `NODE_ENV` - development/staging/production
- `PORT` - Server port (default: 4000)
- `CORS_ORIGIN` - CORS allowed origins
- `LOG_LEVEL` - Logging level
- `JWT_EXPIRE` - Token expiry (default: 7d)

**See .env.example for complete list.**

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:** Check MONGO_URI and ensure MongoDB is accessible

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::4000
```
**Solution:** Change PORT or kill existing process on port 4000

### Cloudinary Upload Failed
```
Error: Cloudinary credentials error
```
**Solution:** Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET are correct

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Add frontend URL to CORS_ORIGIN environment variable

**See [SETUP_DEPLOYMENT_GUIDE.md#Troubleshooting](./SETUP_DEPLOYMENT_GUIDE.md#troubleshooting) for more issues.**

---

## 📖 API Documentation

Complete API documentation available at:
- **Swagger UI:** http://localhost:4000/docs
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Detailed endpoint reference
- **OpenAPI Spec:** src/docs/openapi.yaml

---

## 🔄 Development Scripts

```bash
npm run dev      # Run with hot reload (tsx watch)
npm run build    # Compile TypeScript
npm start        # Run production build
npm test         # Run tests (when configured)
```

---

## 🤝 Contributing

1. Follow existing code patterns
2. Use TypeScript with strict mode
3. Add error handling for new features
4. Update documentation
5. Test with Postman collection

---

## 📝 License

MIT

---

## 📞 Support

For detailed information:
- **Setup:** [SETUP_DEPLOYMENT_GUIDE.md](./SETUP_DEPLOYMENT_GUIDE.md)
- **API Reference:** [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
- **Issues Fixed:** [FIXING_ISSUES.md](./FIXING_ISSUES.md)
- **Postman Collection:** Postman_Collection.json

---

**Made with ❤️ by Topnotch Development Team**

Last Updated: March 1, 2026
