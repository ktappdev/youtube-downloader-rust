import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

interface YtdlpProgress {
  status: string;
  message: string;
}

interface SetupOverlayProps {
  onComplete: () => void;
  onRetry: () => void;
}

export function SetupOverlay({ onComplete, onRetry }: SetupOverlayProps) {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Checking for yt-dlp...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unlisten = listen<YtdlpProgress>("ytdlp-progress", (event) => {
      const { status: newStatus, message: newMessage } = event.payload;
      setStatus(newStatus);
      setMessage(newMessage);

      if (newStatus === "complete" || newStatus === "already_installed") {
        setTimeout(onComplete, 500);
      } else if (newStatus === "error") {
        setError(newMessage);
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-6 p-8 max-w-md text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Setting Up</h1>
          <p className="text-gray-400">Getting things ready for you...</p>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            {status === "error" ? (
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
            )}
            <span className="text-gray-300 text-sm">{message}</span>
          </div>

          {status !== "error" && status !== "complete" && status !== "already_installed" && (
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ 
                  width: status === "downloading" ? "60%" : status === "installing" ? "90%" : "30%" 
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
