import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import bugRoutes from './routes/bugRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Bug from './models/Bug.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.IO Setup
initSocket(server);

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve Uploaded Screenshots & Static files
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Root Endpoint Banner & Instructions
app.get('/', (_req, res) => {
  res.send(`
    <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; text-align: center; padding: 60px 20px; background-color: #0B0F17; color: #fff; min-height: 100vh; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; padding: 40px; border-radius: 24px; border: 1px solid #1F2937; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
        <h1 style="color: #818cf8; margin-bottom: 8px; font-size: 28px;">🚀 BugLens API Server is Running!</h1>
        <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">Stop describing bugs. Show them.</p>
        <div style="background: #1e1b4b; border: 1px solid #4338ca; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #c7d2fe;">👉 To use the <strong>BugLens Web Application</strong>, open your browser at:</p>
          <p style="margin: 10px 0 0 0;"><a href="http://localhost:3000" style="color: #6366f1; background: #fff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">http://localhost:3000</a></p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin: 0;">API Status: <a href="/api/health" style="color: #818cf8;">/api/health (HTTP 200 OK)</a></p>
      </div>
    </div>
  `);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'BugLens API', version: '1.0.0' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();

  // Auto-seed if database has no bugs
  const count = await Bug.countDocuments({});
  if (count === 0) {
    console.log('🌱 Database empty. Executing auto-seed for immediate demo ready state...');
    await seedDatabase();
  }

  server.listen(PORT, () => {
    console.log(`🚀 BugLens Express Server running on http://localhost:${PORT}`);
  });
};

startServer();
