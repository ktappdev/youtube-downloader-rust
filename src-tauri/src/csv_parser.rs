use csv::ReaderBuilder;
use serde::{Deserialize, Serialize};
use std::io::Cursor;

pub const EXPECTED_HEADERS: &[&str] = &[
    "Artist Name(s)",
    "Track Name",
    "Album Name",
    "Artist Genres",
    "Album Release Date",
    "BPM/Tempo",
];

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default)]
pub struct CsvTrackMetadata {
    pub artist_names: Option<String>,
    pub track_name: Option<String>,
    pub album_name: Option<String>,
    pub artist_genres: Option<String>,
    pub album_release_date: Option<String>,
    pub bpm_tempo: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CsvImportResult {
    pub tracks: Vec<CsvTrackEntry>,
    pub total_count: usize,
    pub success_count: usize,
    pub error_count: usize,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CsvTrackEntry {
    pub row_number: usize,
    pub metadata: CsvTrackMetadata,
    pub search_query: String,
}

fn normalize_header(header: &str) -> String {
    header
        .to_lowercase()
        .replace([' ', '-', '/'], "_")
        .replace(['(', ')', '[', ']', '"'], "")
}

fn find_column_index(headers: &[String], target: &str) -> Option<usize> {
    let normalized_target = normalize_header(target);

    for (index, header) in headers.iter().enumerate() {
        let normalized_header = normalize_header(header);
        if normalized_header == normalized_target
            || normalized_header.contains(&normalized_target)
            || normalized_target.contains(&normalized_header)
        {
            return Some(index);
        }
    }
    None
}

pub fn parse_csv_content(content: &str) -> Result<CsvImportResult, String> {
    let mut reader = ReaderBuilder::new()
        .has_headers(true)
        .flexible(true)
        .from_reader(Cursor::new(content));

    let headers: Vec<String> = reader
        .headers()
        .map_err(|e| format!("Failed to read CSV headers: {}", e))?
        .iter()
        .map(|s| s.to_string())
        .collect();

    let mut tracks: Vec<CsvTrackEntry> = Vec::new();
    let mut errors: Vec<String> = Vec::new();
    let mut success_count = 0;

    for (row_number, result) in reader.records().enumerate() {
        let row_number = row_number + 2;

        match result {
            Ok(record) => {
                let artist_names = find_column_index(&headers, "Artist Name(s)")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let track_name = find_column_index(&headers, "Track Name")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let album_name = find_column_index(&headers, "Album Name")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let artist_genres = find_column_index(&headers, "Artist Genres")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let album_release_date = find_column_index(&headers, "Album Release Date")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let bpm_tempo = find_column_index(&headers, "BPM/Tempo")
                    .and_then(|idx| record.get(idx).map(|s| s.to_string()))
                    .filter(|s| !s.is_empty());

                let search_query = match (&artist_names, &track_name) {
                    (Some(artist), Some(track)) => format!("{} - {}", artist, track),
                    (Some(artist), None) => artist.clone(),
                    (None, Some(track)) => track.clone(),
                    (None, None) => {
                        errors.push(format!(
                            "Row {}: Missing both 'Artist Name(s)' and 'Track Name' - cannot create search query",
                            row_number
                        ));
                        continue;
                    }
                };

                tracks.push(CsvTrackEntry {
                    row_number,
                    metadata: CsvTrackMetadata {
                        artist_names,
                        track_name,
                        album_name,
                        artist_genres,
                        album_release_date,
                        bpm_tempo,
                    },
                    search_query: search_query.clone(),
                });
                success_count += 1;
            }
            Err(e) => {
                errors.push(format!(
                    "Row {}: Failed to parse CSV record: {}",
                    row_number, e
                ));
            }
        }
    }

    let total_count = tracks.len() + errors.len();

    Ok(CsvImportResult {
        tracks,
        total_count,
        success_count,
        error_count: errors.len(),
        errors,
    })
}

pub fn validate_csv_headers(content: &str) -> Result<Vec<String>, String> {
    let mut reader = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(Cursor::new(content));

    let headers: Vec<String> = reader
        .headers()
        .map_err(|e| format!("Failed to read CSV headers: {}", e))?
        .iter()
        .map(|s| s.to_string())
        .collect();

    let mut found_headers: Vec<String> = Vec::new();

    for expected in EXPECTED_HEADERS {
        if find_column_index(&headers, expected).is_some() {
            found_headers.push(expected.to_string());
        }
    }

    Ok(found_headers)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_csv_content_with_valid_data() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name,Artist Genres,Album Release Date,BPM/Tempo
The Beatles,Hey Jude,Abbey Road,rock,1968,140
Queen,Bohemian A Night At The Opera,rock,1975,145
Led Zeppelin,Stairway To Heaven,Led Zeppelin IV,rock,1971,146"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.total_count, 3);
        assert_eq!(result.success_count, 3);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.tracks.len(), 3);

        assert_eq!(
            result.tracks[0].metadata.artist_names,
            Some("The Beatles".to_string())
        );
        assert_eq!(
            result.tracks[0].metadata.track_name,
            Some("Hey Jude".to_string())
        );
        assert_eq!(
            result.tracks[0].metadata.album_name,
            Some("Abbey Road".to_string())
        );
        assert_eq!(result.tracks[0].search_query, "The Beatles - Hey Jude");

        assert_eq!(
            result.tracks[1].metadata.artist_names,
            Some("Queen".to_string())
        );
        assert_eq!(
            result.tracks[1].metadata.track_name,
            Some("Bohemian A Night At The Opera".to_string())
        );
        assert_eq!(
            result.tracks[1].search_query,
            "Queen - Bohemian A Night At The Opera"
        );
    }

    #[test]
    fn test_parse_csv_content_with_missing_columns() {
        let csv_content = r#"Artist Name(s),Track Name
The Beatles,Hey Jude"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.total_count, 1);
        assert_eq!(result.success_count, 1);
        assert_eq!(result.tracks[0].metadata.album_name, None);
        assert_eq!(result.tracks[0].metadata.artist_genres, None);
    }

    #[test]
    fn test_parse_csv_content_with_missing_required_fields() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
,,"Abbey Road""#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 0);
        assert_eq!(result.error_count, 1);
        assert!(result.errors[0].contains("Missing both"));
    }

    #[test]
    fn test_parse_csv_content_with_only_track_name() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
,Hey Jude,Abbey Road"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 1);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.tracks[0].search_query, "Hey Jude");
    }

    #[test]
    fn test_parse_csv_content_with_only_artist_name() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
The Beatles,,Abbey Road"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 1);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.tracks[0].search_query, "The Beatles");
    }

    #[test]
    fn test_parse_csv_content_with_empty_rows() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
The Beatles,Hey Jude,Abbey Road

Queen,Bohemian A Night At The Opera,A Night At The Opera"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 2);
        assert_eq!(result.error_count, 0);
    }

    #[test]
    fn test_parse_csv_content_with_special_characters() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
Artist & Band,Song "Title" (Remix),Greatest Hits"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 1);
        assert_eq!(
            result.tracks[0].metadata.track_name,
            Some("Song \"Title\" (Remix)".to_string())
        );
    }

    #[test]
    fn test_parse_csv_content_handles_missing_header_row() {
        let csv_content = r#"Artist Name(s),Track Name"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 0);
        assert_eq!(result.error_count, 0);
        assert_eq!(result.tracks.len(), 0);
    }

    #[test]
    fn test_validate_csv_headers_finds_expected_headers() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name,Artist Genres,Album Release Date,BPM/Tempo
The Beatles,Hey Jude,Abbey Road,rock,1968,140"#;

        let found = validate_csv_headers(csv_content).unwrap();

        assert_eq!(found.len(), 6);
        assert!(found.contains(&"Artist Name(s)".to_string()));
        assert!(found.contains(&"Track Name".to_string()));
        assert!(found.contains(&"Album Name".to_string()));
    }

    #[test]
    fn test_validate_csv_headers_with_partial_match() {
        let csv_content = r#"Artist,Track,Album,Genres,Release Date,Tempo
The Beatles,Hey Jude,Abbey Road,rock,1968,140"#;

        let found = validate_csv_headers(csv_content).unwrap();

        assert!(found.len() > 0);
    }

    #[test]
    fn test_normalize_header_various_formats() {
        assert_eq!(normalize_header("Artist Name(s)"), "artist_names");
        assert_eq!(normalize_header("BPM/Tempo"), "bpm_tempo");
        assert_eq!(normalize_header("Album Release Date"), "album_release_date");
    }

    #[test]
    fn test_parse_csv_content_with_duplicate_artists() {
        let csv_content = r#"Artist Name(s),Track Name,Album Name
Artist One & Artist Two,Great Song,Great Album
Artist One,Solo Song,Great Album"#;

        let result = parse_csv_content(csv_content).unwrap();

        assert_eq!(result.success_count, 2);
        assert_eq!(
            result.tracks[0].metadata.artist_names,
            Some("Artist One & Artist Two".to_string())
        );
        assert_eq!(
            result.tracks[0].search_query,
            "Artist One & Artist Two - Great Song"
        );
    }
}
