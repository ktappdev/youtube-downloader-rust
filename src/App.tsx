import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">YouTube Downloader</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Enter a name to test the Tauri integration
          </p>
          <div className="flex gap-2">
            <Input
              id="greet-input"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <Button onClick={greet}>Greet</Button>
          </div>
          {greetMsg && (
            <p className="text-center font-medium text-primary">{greetMsg}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
