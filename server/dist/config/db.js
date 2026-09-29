"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoMemoryServer = null;
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.log('⚡ No MONGODB_URI found. Initializing in-memory MongoDB server for instant setup...');
            mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            mongoUri = mongoMemoryServer.getUri();
            console.log(`✅ In-Memory MongoDB running at: ${mongoUri}`);
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('🌱 Connected to MongoDB successfully.');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const closeDB = async () => {
    await mongoose_1.default.disconnect();
    if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
    }
};
exports.closeDB = closeDB;
