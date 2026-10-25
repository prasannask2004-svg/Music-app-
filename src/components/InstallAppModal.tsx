import React, { useState, useEffect } from 'react';
import { Smartphone, Download, ExternalLink, Check, Copy, Sparkles, Layers } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = 'https://ais-pre-yqq7imih5xttvpxd2blcpw-88922924845.asia-east1.run.app';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      alert('To install directly on Android:\n1. Open this link in Chrome\n2. Tap the ⋮ menu in the top right\n3. Tap "Install App" or "Add to Home Screen"');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white text-base p-1"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Download & Install on Android
            </h2>
            <p className="text-xs text-slate-400">
              Two quick ways to install Aura Beats as an Android app (.APK or PWA)
            </p>
          </div>
        </div>

        {/* Method 1: Instant Direct Installation (Chrome / Android PWA) */}
        <div className="mt-5 space-y-4">
          
          <div className="glass-panel-subtle rounded-2xl p-5 border border-cyan-500/20 bg-cyan-950/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Method 1: Direct Android Install (No download needed)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                Instant
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Installs Aura Beats directly into your Android app drawer with full standalone screen and media notifications.
            </p>

            <button
              onClick={handleNativeInstall}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-950"
            >
              <Download className="w-4 h-4" />
              <span>Install to Android Device</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Or tap Chrome's three dots (<strong className="text-slate-200">⋮</strong>) &rarr; <strong className="text-slate-200">"Install App"</strong> / <strong className="text-slate-200">"Add to Home screen"</strong>.
            </p>
          </div>

          {/* Method 2: Generate Signed .APK with PWABuilder */}
          <div className="glass-panel-subtle rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Method 2: Generate Standalone .APK File
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Free .APK
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Use Microsoft's free tool <strong className="text-emerald-300">PWABuilder</strong> to turn your live URL into a downloadable <code className="text-cyan-300 font-mono text-[11px]">.apk</code> package:
            </p>

            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside mb-4">
              <li>Copy your live App URL below</li>
              <li>Go to <span className="text-emerald-400 font-mono">pwabuilder.com</span> and paste the URL</li>
              <li>Click <strong>Start</strong> &rarr; <strong>Android Package (.apk)</strong></li>
              <li>Download the generated <code className="text-cyan-300 font-mono">.apk</code> and install on your phone!</li>
            </ol>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-slate-300 font-mono truncate"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <span>PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
