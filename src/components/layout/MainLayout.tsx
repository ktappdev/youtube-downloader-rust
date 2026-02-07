import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FolderOpen, Download, Upload, Play, Radio } from "lucide-react";

interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const MainLayout = React.forwardRef<HTMLDivElement, MainLayoutProps>(
  ({ className, children, header, footer, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen flex flex-col bg-background",
          className
        )}
        {...props}
      >
        {header && (
          <header className="border-b bg-card shadow-sm">
            {header}
          </header>
        )}
        <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        {footer && (
          <footer className="border-t bg-card mt-auto">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);
MainLayout.displayName = "MainLayout";

interface MainLayoutHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const MainLayoutHeader = React.forwardRef<HTMLDivElement, MainLayoutHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {children || (
            <>
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    );
  }
);
MainLayoutHeader.displayName = "MainLayoutHeader";

interface MainLayoutFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MainLayoutFooter = React.forwardRef<HTMLDivElement, MainLayoutFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:px-6 lg:px-8 text-sm text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MainLayoutFooter.displayName = "MainLayoutFooter";

export type AudioMode = 'official' | 'raw' | 'clean';

interface DownloadSettingsProps {
  downloadPath: string;
  onChangePath: () => void;
  onOpenFolder: () => void;
}

function DownloadSettings({ downloadPath, onChangePath, onOpenFolder }: DownloadSettingsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        value={downloadPath || "~/Downloads/Youtube/Multi"}
        readOnly
        placeholder="Select download path..."
        className="flex-1 bg-muted/50"
      />
      <Button variant="outline" size="default" onClick={onChangePath}>
        <FolderOpen className="w-4 h-4 mr-2" />
        Change Path
      </Button>
      <Button variant="outline" size="default" onClick={onOpenFolder}>
        <Play className="w-4 h-4 mr-2" />
        Open Folder
      </Button>
    </div>
  );
}

interface AudioModeSelectorProps {
  value: AudioMode;
  onChange: (mode: AudioMode) => void;
  disabled?: boolean;
}

function AudioModeSelector({ value, onChange, disabled }: AudioModeSelectorProps) {
  const modes: { value: AudioMode; label: string }[] = [
    { value: 'official', label: 'Official Audio' },
    { value: 'raw', label: 'Raw Audio' },
    { value: 'clean', label: 'Clean Audio' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={value === mode.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(mode.value)}
          disabled={disabled}
          className="flex-1 min-w-[100px]"
        >
          <Radio className="w-4 h-4 mr-2" />
          {mode.label}
        </Button>
      ))}
    </div>
  );
}

interface DownloadInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function DownloadInput({ value, onChange, placeholder, disabled }: DownloadInputProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder || "Paste links or song names (one per line)..."}
      className="min-h-[150px] resize-y font-mono text-sm"
      disabled={disabled}
    />
  );
}

interface ActionButtonsProps {
  onImportCsv: () => void;
  onDownload: () => void;
  isImportDisabled?: boolean;
  isDownloadDisabled?: boolean;
}

function ActionButtons({ onImportCsv, onDownload, isImportDisabled, isDownloadDisabled }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onImportCsv}
        disabled={isImportDisabled}
        className="flex-1"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import CSV
      </Button>
      <Button
        variant="default"
        size="lg"
        onClick={onDownload}
        disabled={isDownloadDisabled}
        className="flex-1"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
}

interface ProgressIndicatorProps {
  progress: number;
  status: string;
  currentItem: number;
  itemCount: number;
}

function ProgressIndicator({ progress, status, currentItem, itemCount }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      {itemCount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{status}</span>
          <span className="font-medium">
            {currentItem} of {itemCount}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        className="w-full bg-muted rounded-full h-2.5 overflow-hidden"
      >
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export {
  MainLayout,
  MainLayoutHeader,
  MainLayoutFooter,
  DownloadSettings,
  AudioModeSelector,
  DownloadInput,
  ActionButtons,
  ProgressIndicator,
};
