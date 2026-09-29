import React from 'react';
import { EnvironmentInfo, User } from '../../types';
import { Monitor, Smartphone, Globe, Maximize2, Clock, UserCheck, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';

interface ReproductionContextProps {
  environment: EnvironmentInfo;
  reporter?: User;
  createdAt: string;
}

export const ReproductionContext: React.FC<ReproductionContextProps> = ({
  environment,
  reporter,
  createdAt,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyEnvironmentPayload = () => {
    const payload = JSON.stringify(
      {
        browser: environment?.browser || 'Unknown Browser',
        os: environment?.os || 'Unknown OS',
        device: environment?.device || 'Unknown Device',
        resolution: environment?.resolution || 'Unknown Resolution',
        url: environment?.url || 'N/A',
        reportedBy: reporter?.name,
        timestamp: createdAt,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    {
      label: 'Browser Version',
      value: environment?.browser || 'Chrome 128.0 (macOS)',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
    },
    {
      label: 'Operating System',
      value: environment?.os || 'macOS Sonoma 14.5',
      icon: <Monitor className="w-4 h-4 text-indigo-500" />,
    },
    {
      label: 'Hardware Device',
      value: environment?.device || 'MacBook Pro 16"',
      icon: <Smartphone className="w-4 h-4 text-purple-500" />,
    },
    {
      label: 'Display Resolution',
      value: environment?.resolution || '2560 x 1600 (Retina)',
      icon: <Maximize2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: 'Target URL',
      value: environment?.url || 'https://app.buglens.dev/checkout',
      icon: <Globe className="w-4 h-4 text-amber-500" />,
      isUrl: true,
    },
    {
      label: 'Capture Timestamp',
      value: new Date(createdAt).toLocaleString(),
      icon: <Clock className="w-4 h-4 text-rose-500" />,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-slate-900 text-white border-gray-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-wide text-white">
              Reproduction Context
            </h3>
            <p className="text-xs text-gray-400">Captured environment parameters & client runtime state</p>
          </div>
        </div>

        <button
          onClick={copyEnvironmentPayload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors border border-gray-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON' : 'Copy Payload'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-start gap-3 hover:border-gray-600 transition-colors"
          >
            <div className="p-2 rounded-lg bg-gray-900/80 shrink-0">{it.icon}</div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                {it.label}
              </span>
              <p
                className={`text-xs font-semibold text-gray-100 truncate ${
                  it.isUrl ? 'text-brand-400 underline font-mono' : ''
                }`}
                title={it.value}
              >
                {it.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
