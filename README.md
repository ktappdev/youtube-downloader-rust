# YouTube Downloader

A modern, cross-platform desktop application for downloading audio from YouTube. Built with speed and simplicity in mind.

![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **MP3 Audio Downloads** - Download YouTube videos as high-quality MP3 files
- **Flexible Input** - Accepts YouTube URLs or search by song/artist name
- **Audio Modes** - Choose between Official, Raw, or Clean audio versions
- **Bulk Downloads** - Import CSV files for batch downloading entire playlists or libraries
- **Automatic Metadata** - MP3 files are automatically tagged with artist, title, album, and more
- **Smart Search** - Automatically finds the best match when searching by name
- **Progress Tracking** - Real-time download progress with visual indicators
- **Cross-Platform** - Native apps for macOS and Windows

## Installation

### Download from Releases

1. Go to the [Releases](https://github.com/kentaylor yt-downloader-tauri/releases) page
2. Download the appropriate version for your operating system:
   - **macOS**: Download the `.dmg` file
   - **Windows**: Download the `.msi` installer or `.exe` file
3. Run the installer and follow the prompts

### First Launch

On first launch, the app will automatically download and set up `yt-dlp` (the engine that powers the downloads). This only happens once and takes a few seconds.

## How to Use

### Downloading Audio

1. **Set Download Location**: Click "Select Folder" to choose where your MP3s will be saved
2. **Add Songs**: Paste YouTube URLs or type song/artist names (one per line) in the text area
3. **Choose Audio Mode**:
   - **Official**: Searches for official audio versions (recommended)
   - **Raw**: Finds raw/unprocessed audio
   - **Clean**: Looks for clean/edited versions without explicit content
4. **Click Download**: The app will process each item and save MP3s to your chosen folder

### Bulk Import with CSV

Perfect for downloading entire playlists or music libraries:

1. Prepare a CSV file with these columns:
   - `Artist Name(s)`
   - `Track Name`
   - `Album Name` (optional)
   - `Artist Genres` (optional)
   - `Album Release Date` (optional)
   - `BPM/Tempo` (optional)

2. Click "Import CSV" and select your file
3. The app will map CSV metadata to each downloaded MP3

**Example CSV format:**
```csv
Artist Name(s),Track Name,Album Name,Artist Genres
The Beatles,Hey Jude,Abbey Road,Rock
Queen,Bohemian Rhapsody,A Night at the Opera,Rock
```

### Supported YouTube URLs

The app recognizes various YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

### Managing Downloads

- **Progress Bar**: Shows overall progress when downloading multiple songs
- **Status Messages**: Real-time updates on what's currently happening
- **Open Folder**: Click to open your download location in Finder/Explorer
- **Reset**: Clear the queue and start fresh

## Audio Quality

Downloads use the highest available audio quality:
- Format: MP3
- Quality: 320kbps (when available)
- Source: Best available audio stream from YouTube

## File Naming

Downloaded files are automatically cleaned and renamed:
- Video IDs are removed from filenames
- Invalid characters are stripped
- Format: `Artist - Title.mp3`

## Metadata Tagging

MP3 files include ID3 tags for:
- Title
- Artist
- Album
- Year
- Genre
- Comments (includes "Downloaded from YouTube")

When using CSV import, metadata from your spreadsheet is automatically applied to each file.

## Troubleshooting

### App won't open (macOS)
If you see " cannot be opened because the developer cannot be verified":
1. Right-click the app and select "Open"
2. Click "Open" in the dialog
3. Or go to System Preferences > Security & Privacy > General and click "Open Anyway"

### Download fails
- Ensure you have a stable internet connection
- Check that the YouTube URL is valid and the video is accessible
- Try switching audio modes if a search query isn't finding results

### yt-dlp setup fails
The app requires yt-dlp to function. If automatic setup fails:
1. Check your internet connection
2. Restart the app
3. The app will retry the download automatically

## System Requirements

### macOS
- macOS 11 (Big Sur) or later
- Intel or Apple Silicon (Universal Binary)

### Windows
- Windows 10 or later
- 64-bit processor

## Privacy

This app:
- Does not collect any personal data
- Does not track usage
- Does not require an account
- Only connects to YouTube for downloads
- Stores settings locally on your device

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [Tauri](https://tauri.app/) - Rust-based desktop framework
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloader engine
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Note**: This tool is for personal use only. Please respect copyright laws and YouTube's Terms of Service.
