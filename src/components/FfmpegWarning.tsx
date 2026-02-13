import { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "./ui/Modal";
import { Button } from "./ui/Button";
import { invoke } from "@tauri-apps/api/core";

export function FfmpegWarning({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "error">("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloadStatus("downloading");
    setDownloadError(null);
    try {
      await invoke<string>("download_ffmpeg");
      setDownloadStatus("idle");
      onClose();
    } catch (e) {
      setDownloadStatus("error");
      setDownloadError(String(e));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>FFmpeg Not Detected</ModalTitle>
        <ModalDescription>
          FFmpeg is required to extract and convert audio. Install it on your system or use a bundled build.
        </ModalDescription>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-3 text-sm text-gray-300">
          <p className="text-gray-400">Options:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Install on macOS: brew install ffmpeg</li>
            <li>Install on Windows: choco install ffmpeg or scoop install ffmpeg</li>
            <li>Install on Linux (Debian/Ubuntu): sudo apt-get install ffmpeg</li>
          </ul>
          {downloadError && (
            <p className="text-red-400 break-words">
              Download failed: {downloadError}
            </p>
          )}
          <p className="text-gray-400">
            This app can also bundle FFmpeg as a sidecar. Include platform binaries in src-tauri/bin for packaging.
          </p>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button
          onClick={handleDownload}
          disabled={downloadStatus === "downloading"}
          variant="ghost"
          className="text-red-400 hover:text-red-300"
        >
          {downloadStatus === "downloading" ? "Downloading..." : "Download FFmpeg"}
        </Button>
        <Button onClick={onClose} variant="outline">Okay</Button>
      </ModalFooter>
    </Modal>
  );
}
