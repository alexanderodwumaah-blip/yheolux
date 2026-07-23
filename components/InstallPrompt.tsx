"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handler(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4 rounded-xl border border-gold-500/30 bg-emerald-950/80 px-4 py-3 text-sm text-ivory sm:px-6 animate-fadeUp">
      <span>Install YHEOLUX on your phone for quick access.</span>
      <div className="flex items-center gap-2">
        <button
          onClick={async () => {
            deferredPrompt?.prompt();
            await deferredPrompt?.userChoice;
            setVisible(false);
          }}
          className="rounded-full bg-gold-500 px-4 py-1.5 font-semibold text-emerald-950 transition-transform hover:scale-105"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="text-ivory/50 hover:text-ivory"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
