"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bugSchema = new mongoose_1.Schema({
    bugId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    severity: {
        type: String,
        enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
        default: 'MEDIUM',
        index: true,
    },
    priority: {
        type: String,
        enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW'],
        default: 'NORMAL',
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN PROGRESS', 'IN REVIEW', 'TESTING', 'RESOLVED', 'CLOSED'],
        default: 'OPEN',
        index: true,
    },
    reporter: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    labels: [{ type: String, trim: true }],
    environment: {
        browser: { type: String, default: 'Chrome 128.0' },
        os: { type: String, default: 'macOS Sonoma 14.5' },
        device: { type: String, default: 'MacBook Pro' },
        resolution: { type: String, default: '1920x1080' },
        url: { type: String, default: '' },
    },
    reproduction: {
        steps: { type: String, default: '' },
        expected: { type: String, default: '' },
        actual: { type: String, default: '' },
    },
    screenshotUrl: { type: String, default: '' },
    attachments: [
        {
            name: String,
            url: String,
            size: Number,
        },
    ],
}, { timestamps: true });
bugSchema.index({ title: 'text', description: 'text', bugId: 'text' });
exports.default = mongoose_1.default.model('Bug', bugSchema);
