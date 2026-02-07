use id3::{Frame, Tag, TagLike};
use std::path::Path;

#[derive(Debug, Clone, Default)]
pub struct TrackMetadata {
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub year: Option<String>,
    pub genre: Option<String>,
    pub track_number: Option<String>,
    pub album_artist: Option<String>,
    pub comment: Option<String>,
}

pub fn tag_mp3(file_path: &str, metadata: TrackMetadata) -> Result<(), String> {
    let path = Path::new(file_path);

    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    if !file_path.ends_with(".mp3") {
        return Err("File is not an MP3 file".to_string());
    }

    let mut tag = Tag::new();

    if let Some(title) = &metadata.title {
        tag.add_frame(Frame::text("TIT2", title.to_string()));
    }

    if let Some(artist) = &metadata.artist {
        tag.add_frame(Frame::text("TPE1", artist.to_string()));
    }

    if let Some(album) = &metadata.album {
        tag.add_frame(Frame::text("TALB", album.to_string()));
    }

    if let Some(year) = &metadata.year {
        if let Ok(_year_num) = year.parse::<u32>() {
            tag.add_frame(Frame::text("TYER", year.to_string()));
            tag.add_frame(Frame::text("TDOR", year.to_string()));
        }
    }

    if let Some(genre) = &metadata.genre {
        tag.add_frame(Frame::text("TCON", genre.to_string()));
    }

    if let Some(track) = &metadata.track_number {
        tag.add_frame(Frame::text("TRCK", track.to_string()));
    }

    if let Some(album_artist) = &metadata.album_artist {
        tag.add_frame(Frame::text("TPE2", album_artist.to_string()));
    }

    if let Some(comment) = &metadata.comment {
        tag.add_frame(Frame::with_content(
            "COMM",
            id3::Content::Comment(id3::frame::Comment {
                lang: "eng".to_string(),
                description: "Downloaded from YouTube".to_string(),
                text: comment.to_string(),
            }),
        ));
    }

    tag.write_to_path(path, id3::Version::Id3v24)
        .map_err(|e| format!("Failed to write ID3 tags: {}", e))?;

    Ok(())
}

#[allow(dead_code)]
pub fn parse_title_for_metadata(title: &str) -> TrackMetadata {
    let mut metadata = TrackMetadata::default();

    let cleaned_title = title.trim();

    let patterns = [r"(.+?)\s*[-–—]\s*(.+)", r"(.+?)\s*:\s*(.+)"];

    for pattern in &patterns {
        if let Ok(regex) = regex::Regex::new(pattern) {
            if let Some(captures) = regex.captures(cleaned_title) {
                if let (Some(artist_cap), Some(title_cap)) = (captures.get(1), captures.get(2)) {
                    let artist = artist_cap.as_str().trim().to_string();
                    let song_title = title_cap.as_str().trim().to_string();

                    if !artist.is_empty()
                        && !song_title.is_empty()
                        && artist.len() < 100
                        && song_title.len() < 200
                    {
                        metadata.artist = Some(artist);
                        metadata.title = Some(song_title);
                        return metadata;
                    }
                }
            }
        }
    }

    metadata.title = Some(cleaned_title.to_string());
    metadata
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_track_metadata_default() {
        let metadata = TrackMetadata::default();
        assert!(metadata.title.is_none());
        assert!(metadata.artist.is_none());
        assert!(metadata.album.is_none());
        assert!(metadata.year.is_none());
        assert!(metadata.genre.is_none());
    }

    #[test]
    fn test_track_metadata_with_values() {
        let metadata = TrackMetadata {
            title: Some("Test Song".to_string()),
            artist: Some("Test Artist".to_string()),
            album: Some("Test Album".to_string()),
            year: Some("2024".to_string()),
            genre: Some("Pop".to_string()),
            track_number: Some("1".to_string()),
            album_artist: Some("Various Artists".to_string()),
            comment: Some("Downloaded".to_string()),
        };

        assert_eq!(metadata.title, Some("Test Song".to_string()));
        assert_eq!(metadata.artist, Some("Test Artist".to_string()));
        assert_eq!(metadata.album, Some("Test Album".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_with_dash() {
        let metadata = parse_title_for_metadata("Artist Name - Song Title");
        assert_eq!(metadata.artist, Some("Artist Name".to_string()));
        assert_eq!(metadata.title, Some("Song Title".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_with_em_dash() {
        let metadata = parse_title_for_metadata("Artist Name – Song Title");
        assert_eq!(metadata.artist, Some("Artist Name".to_string()));
        assert_eq!(metadata.title, Some("Song Title".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_with_en_dash() {
        let metadata = parse_title_for_metadata("Artist Name — Song Title");
        assert_eq!(metadata.artist, Some("Artist Name".to_string()));
        assert_eq!(metadata.title, Some("Song Title".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_with_colon() {
        let metadata = parse_title_for_metadata("Artist Name: Song Title");
        assert_eq!(metadata.artist, Some("Artist Name".to_string()));
        assert_eq!(metadata.title, Some("Song Title".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_plain_title() {
        let metadata = parse_title_for_metadata("Song Title Only");
        assert_eq!(metadata.title, Some("Song Title Only".to_string()));
        assert!(metadata.artist.is_none());
    }

    #[test]
    fn test_parse_title_for_metadata_with_whitespace() {
        let metadata = parse_title_for_metadata("  Artist Name - Song Title  ");
        assert_eq!(metadata.artist, Some("Artist Name".to_string()));
        assert_eq!(metadata.title, Some("Song Title".to_string()));
    }

    #[test]
    fn test_parse_title_for_metadata_complex_title() {
        let metadata = parse_title_for_metadata("The Beatles - Hey Jude");
        assert_eq!(metadata.artist, Some("The Beatles".to_string()));
        assert_eq!(metadata.title, Some("Hey Jude".to_string()));
    }

    #[test]
    fn test_tag_mp3_nonexistent_file() {
        let result = tag_mp3("/nonexistent/file.mp3", TrackMetadata::default());
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("File does not exist"));
    }

    #[test]
    fn test_tag_mp3_non_mp3_extension() {
        let result = tag_mp3("/path/to/file.mp4", TrackMetadata::default());
        assert!(result.is_err());
    }
}
