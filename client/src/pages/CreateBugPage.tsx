import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { Project, User } from '../types';
import { AnnotationCanvas } from '../components/bug/AnnotationCanvas';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import {
  UploadCloud,
  Sparkles,
  Camera,
  CheckCircle2,
  Bug,
  Monitor,
  Globe,
  ArrowRight,
} from 'lucide-react';

export const CreateBugPage: React.FC = () => {
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [annotatedScreenshot, setAnnotatedScreenshot] = useState<string>('');
  const [isAnnotating, setIsAnnotating] = useState<boolean>(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [priority, setPriority] = useState('NORMAL');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [labelsStr, setLabelsStr] = useState('ui, checkout');

  // Reproduction
  const [steps, setSteps] = useState('1. Navigate to checkout\n2. Select payment method\n3. Click Submit Order');
  const [expected, setExpected] = useState('Order is processed successfully with HTTP 200 OK');
  const [actual, setActual] = useState('500 Internal Server Error occurs on submission');

  // Auto-detected environment
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');
  const [resolution, setResolution] = useState('');
  const [url, setUrl] = useState('https://app.buglens.dev/checkout');

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-detect environment info
    const ua = navigator.userAgent;
    let b = 'Chrome 128.0';
    if (ua.includes('Firefox')) b = 'Firefox 129.0';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) b = 'Safari 17.4';
    else if (ua.includes('Edg')) b = 'Edge 127.0';

    let osName = 'macOS Sonoma';
    if (ua.includes('Windows')) osName = 'Windows 11 Pro';
    else if (ua.includes('Linux')) osName = 'Ubuntu Linux';
    else if (ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS 17.5';

    setBrowser(b);
    setOs(osName);
    setResolution(`${window.screen.width} x ${window.screen.height}`);

    // Fetch Projects & Users
    Promise.all([
      apiRequest<Project[]>('/projects'),
      apiRequest<User[]>('/auth/users'),
    ]).then(([projs, usr]) => {
      setProjects(projs);
      setUsers(usr);
      if (projs.length > 0) setProjectId(projs[0]._id);
      if (usr.length > 0) setAssigneeId(usr[0]._id);
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setScreenshotUrl(dataUrl);
        setAnnotatedScreenshot(dataUrl);
        setIsAnnotating(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) {
      toast('Required fields missing', 'Please provide a title and select a project.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const labels = labelsStr.split(',').map((l) => l.trim()).filter(Boolean);

      const bugPayload = {
        title,
        description,
        severity,
        priority,
        status: 'OPEN',
        project: projectId,
        assignee: assigneeId || null,
        labels,
        environment: {
          browser,
          os,
          device: os.includes('Windows') ? 'PC Workstation' : 'MacBook Pro 16"',
          resolution,
          url,
        },
        reproduction: {
          steps,
          expected,
          actual,
        },
        screenshotUrl: annotatedScreenshot || screenshotUrl,
      };

      const created = await apiRequest<any>('/bugs', {
        method: 'POST',
        body: JSON.stringify(bugPayload),
      });

      toast('Bug Report Created!', `Bug ${created.bugId} reported successfully.`, 'success');
      navigate(`/bugs/${created.bugId || created._id}`);
    } catch (err: any) {
      toast('Failed to create bug', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Visual Bug Reporter Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Report Visual Bug
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload a screenshot, annotate highlighted regions, and auto-capture system context.
        </p>
      </div>

      {/* Step 1: Upload or Annotate Screenshot */}
      <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              1. Visual Evidence & Annotation
            </h3>
          </div>
          {screenshotUrl && (
            <button
              type="button"
              onClick={() => setIsAnnotating(!isAnnotating)}
              className="text-xs text-brand-500 font-semibold hover:underline"
            >
              {isAnnotating ? 'Hide Editor' : 'Edit Annotation'}
            </button>
          )}
        </div>

        {!screenshotUrl ? (
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/30 group">
            <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-500 group-hover:scale-110 transition-transform mb-3">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Click to upload or drag & drop screenshot
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports PNG, JPG, WebP up to 10MB
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        ) : isAnnotating ? (
          <AnnotationCanvas
            imageSrc={screenshotUrl}
            onExport={(annotatedDataUrl) => {
              setAnnotatedScreenshot(annotatedDataUrl);
              toast('Screenshot Attached', 'Annotated image saved and attached to bug report.', 'success');
              setIsAnnotating(false);
            }}
          />
        ) : (
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden group max-h-96 flex items-center justify-center bg-gray-950">
            <img
              src={annotatedScreenshot || screenshotUrl}
              alt="Bug Screenshot"
              className="max-h-96 object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button size="sm" onClick={() => setIsAnnotating(true)} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Re-Annotate Screenshot
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setScreenshotUrl('');
                  setAnnotatedScreenshot('');
                }}
              >
                Remove Image
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Metadata & Reproduction Details */}
      <form onSubmit={handleCreateBug} className="space-y-6">
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            2. Issue Details & Team Assignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Bug Title *"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Checkout modal backdrop prevents dropdown selection"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Target Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Assign Developer
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-brand-500"
              >
                <option value="CRITICAL">🔥 CRITICAL</option>
                <option value="HIGH">⚠️ HIGH</option>
                <option value="MEDIUM">⚡ MEDIUM</option>
                <option value="LOW">🔵 LOW</option>
              </select>
            </div>

            <div>
              <Input
                label="Labels (comma separated)"
                type="text"
                value={labelsStr}
                onChange={(e) => setLabelsStr(e.target.value)}
                placeholder="ui, modal, z-index"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              3. Reproduction Steps
            </h4>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Steps to Reproduce
              </label>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Expected Behavior
                </label>
                <textarea
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Actual Behavior
                </label>
                <textarea
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate('/bugs')}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Bug className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Submit Bug Report
          </Button>
        </div>
      </form>
    </div>
  );
};
