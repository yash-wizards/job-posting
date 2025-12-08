# Job Postings XML Feed Service

A production-ready RESTful API service that exposes job postings in XML format for the Swedish Public Employment Service (Arbetsförmedlingen/Platsbanken). Built with Node.js, Express, and MongoDB with enterprise-grade architecture.


## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

##  Features

### Core Features
- ✅ **XML Feed Generation** - Standards-compliant XML output for Arbetsförmedlingen
- ✅ **Multi-Format Support** - Both XML and JSON response formats
- ✅ **Pagination** - Efficient handling of large datasets
- ✅ **Health Monitoring** - Comprehensive health check endpoints

### Enterprise Features
- **Security Hardened** - Helmet.js, CORS, input validation
- **Structured Logging** - Winston-based logging with multiple transports
- **Docker Ready** - Multi-stage builds for optimized images
- **Performance Optimized** - Database indexing, connection pooling, compression
- **CI/CD Pipeline** - GitHub Actions for automated testing and deployment

## Architecture

### Technology Stack

- **Runtime**: Node.js 18+
- **Database**: MongoDB 7.x
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

### Design Patterns

- **Service Layer Pattern** - Separation of business logic
- **Controller Pattern** - Request handling and response formatting
- **Middleware Pattern** - Cross-cutting concerns (logging, error handling)
- **Repository Pattern** - Data access abstraction through Mongoose models

### Key Architectural Decisions

1. **Separation of Concerns**: Clear boundaries between controllers, services, and models
2. **Error Handling**: Centralized error handling with custom error classes
3. **Validation**: Joi-based schema validation for all inputs
4. **Database Optimization**: Strategic indexes on frequently queried fields

## Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Docker**: >= 20.10.0 (optional, for containerized deployment)
- **Docker Compose**: >= 2.0.0 (optional)

## Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yash-wizards/job-posting.git
cd job-postings-service

# 2. Create environment file
cp .env.example .env

# 3. Build and start services
docker compose up 

# 4. Verify the service is running
curl http://localhost:8080/health
```

The API will be available at `http://localhost:5000`

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yash-wizards/job-posting.git
cd job-postings-service

# 2. Install dependencies
npm install

# 3. Set up MongoDB
# Make sure MongoDB is running locally on port 27017
# Or update MONGODB_URI in .env

# 4. Create environment file
cp .env.example .env

# 5. Seed the database
npm run seed

# 6. Start the development server
npm run dev
```

## 📖 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. Get All Job Postings (Paginated)

```http
GET /api/job-postings
GET /api/job-postings?format=json
GET /api/job-postings?page=1&pageSize=20
GET /api/job-postings?page=1&pageSize=20&format=json
```

<?xml version="1.0" encoding="UTF-8"?>
<jobPostings xmlns="http://www.arbetsformedlingen.se/xml/schema" 
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
             generatedAt="2025-12-07T10:30:00.000Z" 
             totalJobs="10">
  <jobPosting>
    <title>Senior Full-Stack Developer</title>
    <description>We are looking for an experienced developer...</description>
    <url>https://example.com/jobs/1</url>
    <company>Tech Innovations AB</company>
    <location>Stockholm, Sweden</location>
    <employmentType>full-time</employmentType>
    <salary>
        <min>42000</min>
        <max>55000</max>
        <currency>SEK</currency>
    </salary>
    <enabled>true</enabled>
    <publishedAt>Mon Dec 08 2025</publishedAt>
  </jobPosting>
</jobPostings>
```

**Response:**
```json
{
  "message": "Success",
  "data": {
   {
            "_id": "693685986c9398dda12f877d",
            "title": "QA Automation Engineer",
            "description": "Help ensure our software quality by developing and maintaining automated test suites. You will work with developers to create comprehensive testing strategies.",
            "url": "https://example.com/jobs/qa-automation-engineer",
            "company": "Quality First AB",
            "location": "Remote, Sweden",
            "employmentType": "full-time",
            "salary": {
                "min": 42000,
                "max": 55000,
                "currency": "SEK"
            },
            "enabled": true,
            "publishedAt": "2025-12-08T08:00:24.470Z",
            "__v": 0,
            "createdAt": "2025-12-08T08:00:24.477Z",
            "updatedAt": "2025-12-08T08:00:24.477Z"
        },
  }
}
```
// XML
{
  "title": "Senior Developer",
  "description": "We are looking for...",
  "url": "https://example.com/job",
  "company": "Tech Corp",
  "location": "Stockholm",
  "employmentType": "full-time",
  "salary": {
    "min": 50000,
    "max": 70000,
    "currency": "SEK"
  },
  "enabled": true,
  "publishedAt": "Mon Dec 08 2025"
}

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8080
API_VERSION=v1

MONGODB_URI=
MONGODB_DATABASE=
MONGODB_USER=
MONGODB_PASSWORD=

CACHE_TTL=300
CACHE_ENABLED=true

DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

LOG_LEVEL=info

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

CORS_ORIGIN=*
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | `development` |
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://yashmalawant99_db_user:TUFKjPlJ4q6KJyYg@cluster0.1qmqhmk.mongodb.net/` |
| `CACHE_TTL` | Cache time-to-live in seconds | `300` |
| `DEFAULT_PAGE_SIZE` | Default items per page | `20` |
| `MAX_PAGE_SIZE` | Maximum items per page | `100` |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | `info` |

### 1. Database Optimizations

**Indexes:**
- Text index on `title` and `description` for search
- Compound index on `enabled` and `publishedAt`
- Single indexes on frequently queried fields

- **Gzip compression** for all responses
- Reduces bandwidth by 60-80%
- Automatic compression for responses >1KB

### 2. Docker Optimization

- **Multi-stage builds** - Smaller final image size
- **Layer caching** - Faster rebuilds
- **Non-root user** - Enhanced security
- **Health checks** - Container orchestration support

## 🌐 Deployment

### Docker Compose (Production)

```bash
# Build
docker compose build 

# Build
docker compose up 

### Environment-Specific Deployments

#### Development
```bash
NODE_ENV=development npm run dev
```

#### Production
```bash
NODE_ENV=production docker-compose up -d
```

### Scaling

**Horizontal Scaling:**
```bash
docker-compose up -d --scale app=3
```
## 📁 Project Structure

```
job-postings-service/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   └── logger.js        # Winston logger setup
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── requestLogger.js # Request logging
│   ├── models/              # Mongoose models
│   │   └── JobPosting.js    # Job posting schema
│   ├── routes/              # API routes
│   │   └── jobPostings.js
│   ├── scripts/             # Utility scripts
│   │   └── seed.js          # Database seeding
│   ├── services/            # Business logic
│   │   ├── jobPosting.js
│   ├── utils/               # Utility functions
│   │   └── responseFormatter.js
│   │   ├── validator.js     # Input validation
│   └── app.js               # Express application
|   └── .env                 # Secret Credentials 
├── .gitignore
├── Dockerfile               # Multi-stage Docker build
├── package-lock.json
├── package.json
└── README.md
```

## 🔐 Security Considerations

### Implemented Security Measures

1. **Helmet.js** - Security headers
2. **CORS** - Configurable cross-origin requests
3. **Input Validation** - Joi schema validation
4. **Non-root Docker User** - Container security
5. **Dependency Scanning** - Regular security audits
6. **Error Handling** - No sensitive info in errors
7. **MongoDB Injection Prevention** - Mongoose sanitization

## 📊 Monitoring

### Health Endpoint

```bash
curl http://localhost:8080/health
```

### Logs

```bash
# Docker logs
docker-compose logs -f app
```
