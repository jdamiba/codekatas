# CodeKatas Setup Guide

## Overview

CodeKatas is a typing-focused coding practice application where users reproduce known solutions to improve muscle memory and pattern recognition.

## Architecture Summary

### Core Features

- **Character-level performance tracking** with real-time metrics
- **Gamification system** with achievements, streaks, and leaderboards
- **Clerk authentication** with webhook integration
- **Neon Postgres database** for data persistence
- **JavaScript-only** initially (extensible to other languages)

### Database Schema

- `users` - Extended Clerk user data
- `problems` - Curated coding problems with solutions
- `attempt_sessions` - High-level attempt tracking
- `keystroke_events` - Character-level performance data
- `user_progress` - Aggregated user performance
- `user_streaks` - Daily practice streaks
- `achievements` - Gamification achievements
- `user_achievements` - User-earned achievements
- `leaderboard_entries` - Rankings and metrics

### API Endpoints

- `GET/POST /api/problems` - Problem management
- `GET /api/problems/[id]` - Individual problem details
- `POST/GET /api/attempts` - Attempt session management
- `PUT/GET /api/attempts/[sessionId]` - Session updates and details
- `POST /api/webhooks/clerk` - Clerk user webhook integration

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Database
DATABASE_URL=your_neon_postgres_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Setup

1. Create a Neon Postgres database
2. Run the schema initialization:

```bash
psql $DATABASE_URL -f database/schema.sql
```

### 3. Clerk Configuration

1. Create a Clerk application
2. Configure webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Enable user.created, user.updated, user.deleted webhook events

### 4. Install Dependencies

```bash
npm install
```

### 5. Development Server

```bash
npm run dev
```

## Key Components

### Performance Tracking

- Real-time character-level accuracy monitoring
- Keystroke timing analysis
- Consistency scoring
- Error pattern analysis

### Gamification Features

- **Achievements**: 10 predefined achievements (First Steps, Speed Demon, etc.)
- **Streaks**: Daily practice tracking with streak bonuses
- **Leaderboards**: Rankings by accuracy, speed, streaks, and problem completion
- **Points System**: Experience points based on performance metrics

### Scoring Algorithm

- **Accuracy**: Percentage of correct characters
- **Speed**: Characters per minute (CPM)
- **Consistency**: Variance in typing speed
- **Mastery**: 0-5 scale based on attempts and accuracy

## Sample Data

The schema includes 5 sample JavaScript problems:

- Two Sum (Arrays)
- Valid Parentheses (Strings)
- Reverse String (Strings)
- Maximum Subarray (Arrays)
- Binary Search (Arrays)

## Next Steps

1. Set up environment variables
2. Initialize database with schema
3. Configure Clerk authentication
4. Test webhook integration
5. Build frontend components
6. Implement typing interface
7. Add real-time performance tracking
8. Deploy to production

## File Structure

```
/app
  /api
    /problems - Problem management endpoints
    /attempts - Attempt tracking endpoints
    /webhooks/clerk - Clerk webhook handler
/lib
  db.ts - Database connection and utilities
  performance-tracker.ts - Character-level tracking
  gamification.ts - Achievements and scoring
/database
  schema.sql - Database initialization script
```
