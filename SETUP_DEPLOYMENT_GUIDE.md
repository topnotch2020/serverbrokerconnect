# 🚀 Broker Connect - Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Testing](#testing)
3. [Deployment](#deployment)
4. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- Node.js v18+ (LTS recommended)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Git

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/topnotch/serverbrokerconnect.git
cd serverbrokerconnect
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment Variables

Create `.env.local` (or copy from `.env.example`):

```bash
# Option A: Copy template
cp .env.local .env

# Option B: Manual setup
cat > .env << EOF
# Server
NODE_ENV=development
PORT=4000

# MongoDB (Atlas)
MONGO_URI=mongodb+srv://superadmin:PASSWORD@cluster.mongodb.net/topnotch?appName=Cluster0

# JWT
JWT_SECRET=7f9b3c2e8d4a1f6b9c0d3e7a5b8c1d2e4f6a9b3c7d1e5f8a2c4b6d9e1f3a7c8
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dbax7k2jn
CLOUDINARY_API_KEY=718457148579411
CLOUDINARY_API_SECRET=YzOX2t0AA2qvLzuQzrh_FJnCkbE

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=debug
ENABLE_SWAGGER=true
EOF
```

**Important Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | Database connection | mongodb+srv://user:pass@cluster.mongodb.net/dbname |
| `JWT_SECRET` | Token signing key | Generate: `openssl rand -hex 32` |
| `CLOUDINARY_*` | Image storage | Get from Cloudinary dashboard |
| `CORS_ORIGIN` | Allowed frontend URLs | http://localhost:3000 |

#### 4. Generate JWT Secret (if needed)
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

#### 5. Build TypeScript
```bash
npm run build
```

#### 6. Start Development Server
```bash
npm run dev
```

You should see:
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected!
🚀 Server running on port 4000
```

#### 7. Verify Installation
```bash
# Health check
curl http://localhost:4000/health

# API info
curl http://localhost:4000/

# Swagger UI
open http://localhost:4000/docs
```

---

## Testing

### Unit Testing (Recommended)

#### Setup Jest
```bash
npm install --save-dev jest @types/jest ts-jest
```

#### Create jest.config.js
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
};
```

#### Create a Test File
```typescript
// src/__tests__/auth.test.ts
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  it('should hash password during registration', async () => {
    const service = new AuthService();
    const result = await service.register({
      fname: 'Test',
      lname: 'User',
      email: 'test@example.com',
      dob: '1990-01-01',
      phone: '9876543210',
      password: 'TestPass123!'
    });
    expect(result.email).toBe('test@example.com');
  });
});
```

#### Run Tests
```bash
npm test
```

### Manual API Testing with Postman

#### 1. Import Collection
- Open Postman
- Click "Import"
- Upload `Postman_Collection.json` from the root directory

#### 2. Set Environment Variables
- Create environment with variables:
  - `baseUrl`: http://localhost:4000
  - `token`: (leave empty, will be filled after login)

#### 3. Test Workflow

**Step 1: Register**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fname": "Test",
  "lname": "Broker",
  "email": "test@example.com",
  "dob": "1990-01-15",
  "phone": "9876543210",
  "password": "TestPass123!"
}
```

**Step 2: Login**
```
POST /api/v1/auth/login
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```
- Copy token from response
- Paste into `token` environment variable

**Step 3: Create Property**
```
POST /api/v1/properties
Authorization: Bearer {{token}}

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
    "line1": "123 Main St",
    "locality": "Downtown",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Step 4: Upload Image**
```
POST /api/v1/upload/property
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Form Data:
- image: [select a JPG/PNG file]
```

**Step 5: Search Properties**
```
GET /api/v1/properties/public?listingType=RENT
```

### cURL Testing

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
    "password": "SecurePass123!"
  }'

# Login (save token)
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}' \
  | jq -r '.token')

# Get profile
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Create property
curl -X POST http://localhost:4000/api/v1/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingType": "RENT",
    "propertyType": "APARTMENT",
    "bhkType": "2BHK",
    "pricing": {"price": 50000},
    "address": {
      "line1": "123 Main",
      "locality": "Downtown",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

### API Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint responds (/health)
- [ ] Swagger UI loads (/docs)
- [ ] Register creates user
- [ ] Login returns JWT token
- [ ] Protected endpoints require token
- [ ] Create property draft
- [ ] Update property
- [ ] Submit property
- [ ] Search properties with filters
- [ ] Add/remove favorites
- [ ] Upload image to Cloudinary
- [ ] Get/manage notifications
- [ ] Error handling works

---

## Deployment

### Deployment Checklist

- [ ] Build passes: `npm run build`
- [ ] No compilation errors
- [ ] All tests pass: `npm test`
- [ ] Environment variables configured
- [ ] Database has proper indexes
- [ ] Cloudinary credentials valid
- [ ] CORS origins updated
- [ ] JWT SECRET is secure (min 32 chars)
- [ ] Logs directory exists
- [ ] SSL/HTTPS configured

### Option 1: Vercel (Easiest - Recommended)

#### 1. Prepare for Vercel

The project includes `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

#### 2. Connect to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

#### 3. Set Environment Variables
- Go to Vercel Dashboard → Settings → Environment Variables
- Add all variables from `.env.production`

#### 4. Deploy
```bash
vercel --prod
```

#### 5. Access Production
```
https://serverbrokerconnect-xxxx.vercel.app
```

---

### Option 2: Docker (Self-Hosted)

#### 1. Build Docker Image
```bash
docker build -t broker-connect-api:1.0.0 .
```

#### 2. Run Container
```bash
docker run -d \
  --name broker-connect \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e MONGO_URI="mongodb+srv://..." \
  -e JWT_SECRET="..." \
  -e CLOUDINARY_CLOUD_NAME="..." \
  -e CLOUDINARY_API_KEY="..." \
  -e CLOUDINARY_API_SECRET="..." \
  -e CORS_ORIGIN="https://yourdomain.com" \
  broker-connect-api:1.0.0
```

#### 3. View Logs
```bash
docker logs broker-connect -f
```

---

### Option 3: Traditional Server (AWS/DigitalOcean)

#### 1. SSH into Server
```bash
ssh user@your-server-ip
```

#### 2. Install Node.js & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. Clone Repository
```bash
git clone https://github.com/topnotch/serverbrokerconnect.git
cd serverbrokerconnect
npm install
```

#### 4. Configure Environment
```bash
nano .env.production
# Add all production variables
```

#### 5. Build & Test
```bash
npm run build
npm start
```

#### 6. Setup PM2 (Process Manager)
```bash
npm install -g pm2

# Start Server
pm2 start npm --name "broker-connect" -- start

# Setup auto-restart
pm2 startup
pm2 save

# View logs
pm2 logs broker-connect
```

#### 7. Setup Nginx Reverse Proxy
```bash
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/broker-connect

# Add:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable
sudo ln -s /etc/nginx/sites-available/broker-connect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. Setup SSL (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Environment-Specific Setup

### Development (.env)
```dotenv
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug
ENABLE_SWAGGER=true
ENABLE_MOCK_DATA=false
```

### Staging (.env.staging)
```dotenv
NODE_ENV=staging
PORT=4000
LOG_LEVEL=info
ENABLE_SWAGGER=true
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/...
JWT_SECRET=staging-secret-key-min-32-chars
```

### Production (.env.production)
```dotenv
NODE_ENV=production
PORT=4000
LOG_LEVEL=warn
ENABLE_SWAGGER=false
MONGODB_URI=mongodb+srv://produser:secure@prod-cluster.mongodb.net/...
JWT_SECRET=<generate-with-openssl-rand-hex-32>
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

---

## Troubleshooting

### MongoDB Connection Fails
```bash
# Error: connect ECONNREFUSED 127.0.0.1:27017
# Solution: Ensure MongoDB is running or Atlas connection string is valid

# Check connection
nc -zv cluster.mongodb.net 27017

# Test URI locallly
mongo "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
```

### Port Already in Use
```bash
# Error: listen EADDRINUSE: address already in use :::4000
# Solution: Kill process or change port

# Find process
lsof -i :4000

# Kill it
kill -9 <PID>

# Or change PORT
PORT=5000 npm run dev
```

### Cloudinary Upload Fails
```bash
# Error: Cloudinary upload failed
# Solution: Verify credentials

# Check in .env:
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY

# Test upload manually on Cloudinary dashboard
```

### JWT Token Invalid
```bash
# Error: Invalid token
# Solution: Ensure JWT_SECRET matches between environments

# Generate new secret
openssl rand -hex 32

# Update .env
JWT_SECRET=<new-secret>
```

### CORS Headers Blocked
```bash
# Error: Access to XMLHttpRequest blocked by CORS policy
# Solution: Add frontend URL to CORS_ORIGIN

# In .env:
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

### Logs Not Writing
```bash
# Error: EACCES: permission denied, open 'logs/error.log'
# Solution: Create logs directory with permissions

mkdir -p logs
chmod 755 logs
```

---

## Performance Optimization

### Database Optimization
```javascript
// Ensure indexes exist
db.brokers.createIndex({ email: 1 })
db.properties.createIndex({ brokerId: 1, status: 1 })
db.properties.createIndex({ "address.city": 1, "address.locality": 1 })
db.notifications.createIndex({ brokerId: 1, unread: 1 })
```

### Caching (Optional - Future)
```javascript
// Install Redis
npm install redis

// Use in auth service
const cache = redis.createClient();
cache.set(`user:${id}`, JSON.stringify(broker), 'EX', 3600);
```

### Request Compression
```javascript
// Already in app.ts via helmet & cors
// Enable gzip compression (production)
app.use(compression());
```

---

## Monitoring & Maintenance

### Health Monitoring
```bash
# Cron job to check health every 5 minutes
*/5 * * * * curl -f http://localhost:4000/health || systemctl restart broker-connect
```

### Log Rotation
```bash
# Winston already handles daily rotation in logs/
```

### Database Backup
```bash
# Schedule MongoDB backup
mongodump --uri "mongodb+srv://..." --archive=backup.archive

# Restore
mongorestore --uri "mongodb+srv://..." --archive=backup.archive
```

---

## Security Best Practices

✅ **Implemented:**
- HTTPS/TLS (enable in production)
- Helmet headers
- Password hashing (bcrypt)
- JWT authentication
- Input validation
- CORS configuration

⚠️ **To Implement:**
- Rate limiting middleware
- Request validation schemas
- SQL injection prevention (N/A - MongoDB)
- API key management
- Audit logging
- Two-factor authentication

---

**Last Updated:** March 1, 2026
