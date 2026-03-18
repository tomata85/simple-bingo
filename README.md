# Koh Lanta Bingo 2026

A mobile-friendly bingo game to track activities during a Koh Lanta trip.

## Features

- ✅ 5×5 mobile-responsive bingo grid
- ✅ Player name input with validation
- ✅ Cookie-based persistence for offline use
- ✅ Server-side JSON file storage for backup
- ✅ Automatic save on every interaction
- ✅ Click animation and hover effects

## Installation

### Using Flask Server (Recommended for server-side data storage)

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python3 app.py
```

3. Open your browser to: `http://localhost:5000`

The app will create a `data/` directory to store user JSON files.

### Using Simple HTTP Server (No server-side storage, cookies only)

```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`

## Data Storage

### Client-side (Cookies)
- Player name
- Tile order
- Clicked tiles

### Server-side (JSON files in `data/` folder)
- Complete player profile with all data
- Timestamp of last update
- Persistent storage across sessions

## Deploy to Production

For GitHub Pages hosting:
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Site will be available at: `https://yourusername.github.io/simple-bingo/`

Note: Server-side storage (`/api` endpoints) will not work with GitHub Pages since it's static hosting. Use cookies only for GitHub Pages.

## Browser Compatibility

Works on all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - Game logic and client-side functionality
- `app.py` - Flask server for data persistence
- `data/` - Server-side JSON storage directory (created automatically)

## License

MIT
