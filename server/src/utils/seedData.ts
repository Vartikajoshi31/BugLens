import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Bug from '../models/Bug.js';
import Comment from '../models/Comment.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';

export const seedDatabase = async () => {
  console.log('🌱 Seeding BugLens realistic production database...');

  await User.deleteMany({});
  await Project.deleteMany({});
  await Bug.deleteMany({});
  await Comment.deleteMany({});
  await Activity.deleteMany({});
  await Notification.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create 8 Users
  const usersData = [
    {
      name: 'Vartika Sharma',
      email: 'vartika@buglens.dev',
      password: passwordHash,
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@buglens.dev',
      password: passwordHash,
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya@buglens.dev',
      password: passwordHash,
      role: 'QA Tester',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Siddharth Patel',
      email: 'siddharth@buglens.dev',
      password: passwordHash,
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Meera Kulkarni',
      email: 'meera@buglens.dev',
      password: passwordHash,
      role: 'QA Tester',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@buglens.dev',
      password: passwordHash,
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Priya Nair',
      email: 'priya@buglens.dev',
      password: passwordHash,
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Arjun Gupta',
      email: 'arjun@buglens.dev',
      password: passwordHash,
      role: 'QA Tester',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const createdUsers = await User.insertMany(usersData);
  const [vartika, rahul, ananya, siddharth, meera, rohan, priya, arjun] = createdUsers;

  console.log(`✅ Seeded ${createdUsers.length} users.`);

  // 2. Create 3 Projects
  const projectsData = [
    {
      name: 'BugLens Web Platform',
      key: 'BL',
      description: 'Next-gen visual bug tracking SaaS web app and browser extension integration',
      owner: vartika._id,
      members: [vartika._id, rahul._id, ananya._id, siddharth._id, meera._id],
    },
    {
      name: 'Acme Payment Gateway',
      key: 'PAY',
      description: 'Core billing API, checkout widgets, subscription management, and Stripe integration',
      owner: priya._id,
      members: [priya._id, rohan._id, arjun._id, rahul._id],
    },
    {
      name: 'DevPulse Analytics Hub',
      key: 'DEV',
      description: 'Engineering velocity, code review throughput, and automated regression analytics dashboard',
      owner: vartika._id,
      members: [vartika._id, meera._id, siddharth._id, rohan._id],
    },
  ];

  const createdProjects = await Project.insertMany(projectsData);
  const [blProject, payProject, devProject] = createdProjects;

  console.log(`✅ Seeded ${createdProjects.length} projects.`);

  // Sample Annotated Screenshots (SVG Data URLs)
  const sampleScreenshots = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230F172A"/><rect x="40" y="40" width="720" height="60" rx="8" fill="%231E293B"/><circle cx="70" cy="70" r="10" fill="%23EF4444"/><circle cx="100" cy="70" r="10" fill="%23F59E0B"/><circle cx="130" cy="70" r="10" fill="%2310B981"/><text x="400" y="75" fill="%2394A3B8" font-family="sans-serif" font-size="14" text-anchor="middle">https://app.buglens.dev/checkout</text><rect x="40" y="120" width="460" height="280" rx="8" fill="%231E293B"/><rect x="520" y="120" width="240" height="280" rx="8" fill="%231E293B"/><rect x="540" y="150" width="200" height="40" rx="6" fill="%23EF4444" fill-opacity="0.3" stroke="%23EF4444" stroke-width="2" stroke-dasharray="4 4"/><text x="640" y="175" fill="%23FCA5A5" font-family="sans-serif" font-size="12" text-anchor="middle">500 Server Error on Submit</text><text x="70" y="160" fill="%23F8FAFC" font-family="sans-serif" font-size="18" font-weight="bold">Checkout Payment Summary</text><text x="70" y="200" fill="%2394A3B8" font-family="sans-serif" font-size="14">Enterprise Plan - \$499/mo</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230F172A"/><rect x="50" y="50" width="700" height="350" rx="12" fill="%231E293B"/><text x="80" y="100" fill="%23F8FAFC" font-family="sans-serif" font-size="20" font-weight="bold">Kanban Board View</text><rect x="80" y="130" width="200" height="230" rx="8" fill="%23334155"/><rect x="300" y="130" width="200" height="230" rx="8" fill="%23334155"/><rect x="520" y="130" width="200" height="230" rx="8" fill="%23334155"/><rect x="90" y="150" width="180" height="70" rx="6" fill="%230F172A" stroke="%236366F1" stroke-width="2"/><text x="100" y="180" fill="%23818CF8" font-family="sans-serif" font-size="14">BL-1039 Card Overlap Bug</text><line x1="280" y1="180" x2="330" y2="180" stroke="%23EF4444" stroke-width="3" marker-end="url(%23arrow)"/><text x="310" y="270" fill="%23FCA5A5" font-family="sans-serif" font-size="12">Fails on Drag & Drop</text></svg>',
  ];

  // 3. Generate 42 Realistic Bugs
  const bugTemplates = [
    {
      title: 'Modal backdrop prevents pointer events on nested dropdowns',
      severity: 'HIGH',
      priority: 'HIGH',
      status: 'IN PROGRESS',
      project: blProject._id,
      reporter: ananya._id,
      assignee: rahul._id,
      labels: ['ui', 'modal', 'z-index'],
      browser: 'Chrome 128.0 (macOS)',
      os: 'macOS Sonoma 14.5',
      device: 'MacBook Pro 16"',
      resolution: '2560 x 1600',
      url: 'https://app.buglens.dev/bugs/new',
      steps: '1. Open Create Bug Modal.\n2. Click Project Selector dropdown.\n3. Try selecting item from list.',
      expected: 'Dropdown menu receives click events and selects project.',
      actual: 'Backdrop intercepts click event, closing modal immediately.',
    },
    {
      title: 'Stripe webhook 401 unauthorized on production endpoint',
      severity: 'CRITICAL',
      priority: 'URGENT',
      status: 'OPEN',
      project: payProject._id,
      reporter: arjun._id,
      assignee: rohan._id,
      labels: ['stripe', 'api', 'webhook', 'security'],
      browser: 'Safari 17.4 (iOS)',
      os: 'iOS 17.5',
      device: 'iPhone 15 Pro',
      resolution: '1179 x 2556',
      url: 'https://api.acme.com/v1/stripe/webhook',
      steps: '1. Trigger subscription upgraded webhook in Stripe Dashboard.\n2. Observe server logs.',
      expected: 'Webhook signature is verified and returns HTTP 200 OK.',
      actual: 'Server responds with HTTP 401 Unauthorized due to missing signature header.',
    },
    {
      title: 'Kanban card drag optimistic update reverts on WebSocket disconnect',
      severity: 'HIGH',
      priority: 'HIGH',
      status: 'TESTING',
      project: blProject._id,
      reporter: meera._id,
      assignee: siddharth._id,
      labels: ['kanban', 'socket.io', 'dnd-kit'],
      browser: 'Firefox 129.0',
      os: 'Windows 11 Pro',
      device: 'Dell XPS 15',
      resolution: '1920 x 1080',
      url: 'https://app.buglens.dev/kanban',
      steps: '1. Disconnect internet briefly.\n2. Drag card from OPEN to IN PROGRESS.\n3. Reconnect internet.',
      expected: 'Optimistic state syncs smoothly upon socket reconnect.',
      actual: 'Card flickers and reverts back to original column twice.',
    },
    {
      title: 'Canvas annotation text tool leaks memory when zooming past 200%',
      severity: 'MEDIUM',
      priority: 'NORMAL',
      status: 'IN REVIEW',
      project: blProject._id,
      reporter: ananya._id,
      assignee: rahul._id,
      labels: ['canvas', 'performance', 'memory'],
      browser: 'Chrome 128.0 (Windows)',
      os: 'Windows 11 Home',
      device: 'Custom PC',
      resolution: '3840 x 2160',
      url: 'https://app.buglens.dev/bugs/new',
      steps: '1. Upload 4K screenshot.\n2. Add text annotation.\n3. Zoom in to 250%.',
      expected: 'Smooth rendering at 60 FPS.',
      actual: 'Memory usage spikes by 800MB and browser tab becomes sluggish.',
    },
    {
      title: 'CSV export truncates bug descriptions containing double quotes',
      severity: 'LOW',
      priority: 'LOW',
      status: 'RESOLVED',
      project: devProject._id,
      reporter: meera._id,
      assignee: siddharth._id,
      labels: ['export', 'csv', 'formatter'],
      browser: 'Edge 127.0',
      os: 'Windows 11',
      device: 'Surface Laptop 5',
      resolution: '2256 x 1504',
      url: 'https://app.buglens.dev/analytics',
      steps: '1. Export bugs to CSV.\n2. Open in Microsoft Excel.',
      expected: 'Escaped quotes inside CSV cells.',
      actual: 'Description field cuts off after the first double quote mark.',
    },
    {
      title: 'JWT token refresh race condition causes random logout on page refresh',
      severity: 'CRITICAL',
      priority: 'URGENT',
      status: 'IN PROGRESS',
      project: blProject._id,
      reporter: vartika._id,
      assignee: rahul._id,
      labels: ['auth', 'jwt', 'security'],
      browser: 'Chrome 128.0',
      os: 'macOS Sonoma 14.5',
      device: 'MacBook Air M2',
      resolution: '2560 x 1664',
      url: 'https://app.buglens.dev/dashboard',
      steps: '1. Open multiple tabs simultaneously.\n2. Reload all tabs at once when token is near expiration.',
      expected: 'Token refreshes once and all tabs remain logged in.',
      actual: 'One tab invalidates refresh token, logging out user across all tabs.',
    },
    {
      title: 'Command Palette Cmd+K modal does not trap focus in dark mode',
      severity: 'MEDIUM',
      priority: 'NORMAL',
      status: 'RESOLVED',
      project: blProject._id,
      reporter: arjun._id,
      assignee: rahul._id,
      labels: ['accessibility', 'keyboard', 'cmd-k'],
      browser: 'Safari 17.4',
      os: 'macOS Sonoma',
      device: 'Mac Studio',
      resolution: '2560 x 1440',
      url: 'https://app.buglens.dev/dashboard',
      steps: '1. Press Cmd+K.\n2. Tab through elements.',
      expected: 'Focus cycles only inside the command palette modal.',
      actual: 'Tab key focus escapes to background navbar links.',
    },
    {
      title: 'Analytics Recharts area graph tooltip offset offscreen on mobile viewports',
      severity: 'LOW',
      priority: 'LOW',
      status: 'CLOSED',
      project: devProject._id,
      reporter: meera._id,
      assignee: rohan._id,
      labels: ['charts', 'mobile', 'recharts'],
      browser: 'Chrome Mobile 128.0',
      os: 'Android 14',
      device: 'Pixel 8 Pro',
      resolution: '1080 x 2400',
      url: 'https://app.buglens.dev/analytics',
      steps: '1. Open analytics on mobile device.\n2. Tap rightmost data point on line chart.',
      expected: 'Tooltip positions cleanly inside viewport bounds.',
      actual: 'Tooltip extends past screen edge causing horizontal overflow scrollbar.',
    },
  ];

  const statuses: ('OPEN' | 'IN PROGRESS' | 'IN REVIEW' | 'TESTING' | 'RESOLVED' | 'CLOSED')[] = [
    'OPEN',
    'IN PROGRESS',
    'IN REVIEW',
    'TESTING',
    'RESOLVED',
    'CLOSED',
  ];
  const severities: ('CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const priorities: ('URGENT' | 'HIGH' | 'NORMAL' | 'LOW')[] = ['URGENT', 'HIGH', 'NORMAL', 'LOW'];

  const generatedBugs = [];

  for (let i = 1; i <= 42; i++) {
    const template = bugTemplates[(i - 1) % bugTemplates.length];
    const project = i % 3 === 0 ? payProject : i % 2 === 0 ? devProject : blProject;
    const bugId = `${project.key}-${1030 + i}`;
    const status = i <= 8 ? template.status : statuses[i % statuses.length];
    const severity = i <= 8 ? template.severity : severities[i % severities.length];
    const priority = i <= 8 ? template.priority : priorities[i % priorities.length];
    const reporter = createdUsers[i % createdUsers.length];
    const assignee = createdUsers[(i + 1) % createdUsers.length];

    const screenshotUrl = i % 2 === 0 ? sampleScreenshots[0] : sampleScreenshots[1];

    generatedBugs.push({
      bugId,
      title: i > 8 ? `${template.title} (Module #${i})` : template.title,
      description: `Detailed report regarding ${template.title.toLowerCase()}. Observed across multi-environment testing suites.`,
      severity,
      priority,
      status,
      reporter: reporter._id,
      assignee: assignee._id,
      project: project._id,
      labels: template.labels,
      environment: {
        browser: template.browser,
        os: template.os,
        device: template.device,
        resolution: template.resolution,
        url: template.url,
      },
      reproduction: {
        steps: template.steps,
        expected: template.expected,
        actual: template.actual,
      },
      screenshotUrl,
      attachments: [
        { name: 'console-log.txt', url: '#', size: 1024 * 45 },
        { name: 'network-trace.har', url: '#', size: 1024 * 180 },
      ],
      createdAt: new Date(Date.now() - (42 - i) * 6 * 60 * 60 * 1000), // Spaced out over recent days
      updatedAt: new Date(Date.now() - (42 - i) * 2 * 60 * 60 * 1000),
    });
  }

  const createdBugs = await Bug.insertMany(generatedBugs);
  console.log(`✅ Seeded ${createdBugs.length} bugs with rich metadata.`);

  // 4. Seed Comments
  const commentsData = [
    {
      bug: createdBugs[0]._id,
      author: rahul._id,
      text: 'I investigated the modal backdrop issue. The `@z-index` property on `.dropdown-content` needs to be set to `z-50` relative to the wrapper.',
      mentions: [ananya._id],
    },
    {
      bug: createdBugs[0]._id,
      author: ananya._id,
      text: 'Thanks @Rahul! Verified that fixing z-index resolves pointer event trapping on Chrome and Firefox.',
      mentions: [rahul._id],
    },
    {
      bug: createdBugs[1]._id,
      author: rohan._id,
      text: 'Checking the Stripe signature secret in `.env.production`. It looks like the key was missing the `whsec_` prefix.',
      mentions: [arjun._id],
    },
    {
      bug: createdBugs[2]._id,
      author: siddharth._id,
      text: 'Working on a optimistic retry queue for `@dnd-kit/core` events when WebSocket state drops.',
      mentions: [],
    },
  ];

  await Comment.insertMany(commentsData);
  console.log(`✅ Seeded comments.`);

  // 5. Seed Activities
  const activitiesData = [
    {
      bug: createdBugs[0]._id,
      project: blProject._id,
      actor: ananya._id,
      action: 'created bug BL-1031',
    },
    {
      bug: createdBugs[0]._id,
      project: blProject._id,
      actor: rahul._id,
      action: 'changed status from OPEN to IN PROGRESS',
    },
    {
      bug: createdBugs[1]._id,
      project: payProject._id,
      actor: arjun._id,
      action: 'created bug PAY-1032',
    },
    {
      bug: createdBugs[2]._id,
      project: blProject._id,
      actor: meera._id,
      action: 'moved BL-1033 to TESTING',
    },
    {
      bug: createdBugs[3]._id,
      project: blProject._id,
      actor: vartika._id,
      action: 'assigned BL-1034 to Rahul Verma',
    },
  ];

  await Activity.insertMany(activitiesData);
  console.log(`✅ Seeded recent activities.`);

  // 6. Seed Notifications
  const notificationsData = [
    {
      recipient: rahul._id,
      actor: ananya._id,
      type: 'BUG_ASSIGNED',
      bug: createdBugs[0]._id,
      message: 'Ananya Iyer assigned you to BL-1031: Modal backdrop prevents pointer events',
      read: false,
    },
    {
      recipient: rohan._id,
      actor: arjun._id,
      type: 'BUG_ASSIGNED',
      bug: createdBugs[1]._id,
      message: 'Arjun Gupta assigned you to PAY-1032: Stripe webhook 401 unauthorized',
      read: false,
    },
    {
      recipient: rahul._id,
      actor: ananya._id,
      type: 'MENTION',
      bug: createdBugs[0]._id,
      message: 'Ananya Iyer mentioned you in a comment on BL-1031',
      read: true,
    },
  ];

  await Notification.insertMany(notificationsData);
  console.log(`✅ Seeded notifications.`);

  console.log('🚀 Seed process completed successfully!');
};

if (process.argv[1].includes('seedData')) {
  connectDB().then(async () => {
    await seedDatabase();
    await closeDB();
    process.exit(0);
  });
}
