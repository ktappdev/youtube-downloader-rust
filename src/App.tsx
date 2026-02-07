import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";
import { MainLayout, MainLayoutHeader, MainLayoutFooter } from "./components/layout/MainLayout";
import { DownloadProvider, useDownloadStore } from "./store/DownloadStore";

function DownloadForm() {
  const { url, mode, downloadPath, setUrl, setMode, setDownloadPath, reset } = useDownloadStore();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">YouTube Downloader</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium mb-1">
              YouTube URL
            </label>
            <Input
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              placeholder="Enter YouTube URL..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Download Mode</label>
            <div className="flex gap-2">
              <Button
                variant={mode === 'audio' ? 'default' : 'outline'}
                onClick={() => setMode('audio')}
                className="flex-1"
              >
                Audio
              </Button>
              <Button
                variant={mode === 'video' ? 'default' : 'outline'}
                onClick={() => setMode('video')}
                className="flex-1"
              >
                Video
              </Button>
              <Button
                variant={mode === 'playlist' ? 'default' : 'outline'}
                onClick={() => setMode('playlist')}
                className="flex-1"
              >
                Playlist
              </Button>
            </div>
          </div>

          <div>
            <label htmlFor="path-input" className="block text-sm font-medium mb-1">
              Download Path
            </label>
            <Input
              id="path-input"
              value={downloadPath}
              onChange={(e) => setDownloadPath(e.currentTarget.value)}
              placeholder="Select download path..."
            />
          </div>

          <div className="pt-4 space-y-2">
            <div className="text-sm text-muted-foreground">
              <p>URL: {url || '(empty)'}</p>
              <p>Mode: {mode}</p>
              <p>Path: {downloadPath || '(empty)'}</p>
            </div>
            <Button onClick={reset} variant="outline" className="w-full">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  return (
    <DownloadProvider>
      <MainLayout
        header={
          <MainLayoutHeader
            title="YouTube Downloader"
            description="Download YouTube videos, audio, or entire playlists"
          />
        }
        footer={<MainLayoutFooter>YouTube Downloader - Tauri App</MainLayoutFooter>}
      >
        <DownloadForm />
      </MainLayout>
    </DownloadProvider>
  );
}

export default App;
