"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_js_1 = require("./config/db.js");
const socketService_js_1 = require("./services/socketService.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const bugRoutes_js_1 = __importDefault(require("./routes/bugRoutes.js"));
const projectRoutes_js_1 = __importDefault(require("./routes/projectRoutes.js"));
const commentRoutes_js_1 = __importDefault(require("./routes/commentRoutes.js"));
const analyticsRoutes_js_1 = __importDefault(require("./routes/analyticsRoutes.js"));
const notificationRoutes_js_1 = __importDefault(require("./routes/notificationRoutes.js"));
const Bug_js_1 = __importDefault(require("./models/Bug.js"));
const seedData_js_1 = require("./utils/seedData.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
// Socket.IO Setup
(0, socketService_js_1.initSocket)(server);
// Middleware
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Serve Uploaded Screenshots & Static files
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
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
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/bugs', bugRoutes_js_1.default);
app.use('/api/projects', projectRoutes_js_1.default);
app.use('/api/comments', commentRoutes_js_1.default);
app.use('/api/analytics', analyticsRoutes_js_1.default);
app.use('/api/notifications', notificationRoutes_js_1.default);
// Health Check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'BugLens API', version: '1.0.0' });
});
// Global Error Handler
app.use(errorHandler_js_1.errorHandler);
// Start Server
const startServer = async () => {
    await (0, db_js_1.connectDB)();
    // Auto-seed if database has no bugs
    const count = await Bug_js_1.default.countDocuments({});
    if (count === 0) {
        console.log('🌱 Database empty. Executing auto-seed for immediate demo ready state...');
        await (0, seedData_js_1.seedDatabase)();
    }
    server.listen(PORT, () => {
        console.log(`🚀 BugLens Express Server running on http://localhost:${PORT}`);
    });
};
startServer();
