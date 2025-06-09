export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

// IMPORTANT: Replace with your actual Google Client ID from Google Cloud Console
export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; 

// Google Sheet ID from the provided URL (part after /d/ and before /pub or /edit)
// For published URLs like "https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub", this is the "e/2PACX-1v..." part.
export const GOOGLE_SHEET_ID = 'e/2PACX-1vReV67vOL4k_qtIxV3irWtLc4e71J9IwDQpGDp5Arx9FksFy4Whfe-3JkKZ7WaOXcQsIg-9YBIiTEGS'; 
// Google Sheet GID (from gid=0 in the URL)
export const GOOGLE_SHEET_GID = '0'; 

// Base URL for fetching Google Sheet data as JSON using gviz API
// The final URL will be constructed as: `${GOOGLE_SHEET_BASE_URL}${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`
export const GOOGLE_SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/';
