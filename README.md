# Music Jam Vote Counter

A customizable vote counter widget for OBS that displays real-time vote counts for Music Jam event participants.

## For Artists

1. Visit the generator page: `https://themadcurve.github.io/music-jam-counter/`
2. Enter your unique Song ID (provided by event organizers)
3. Choose your preferred style
4. Set your refresh rate
5. Click "Generate Browser Source URL"
6. Copy the URL and add it to OBS as a Browser Source

## OBS Setup

1. Open OBS Studio
2. Add a new **Browser** source
3. Paste your generated URL
4. Set dimensions: **400x200** (or adjust as needed)
5. Check "Shutdown source when not visible"
6. Click OK

## Styles

- **Minimal**: Clean, compact design
- **Detailed**: Larger, more prominent display
- **Animated**: Includes animations and effects

## Features

- Real-time vote updates
- Customizable refresh rate
- Three different visual styles
- Transparent background for OBS
- Secure (only shows votes for your song ID)

## Development

To deploy your own instance:

1. Fork this repository
2. Update the Supabase credentials in the code
3. Enable GitHub Pages in repository settings
4. Access at `https://yourusername.github.io/music-jam-counter/`

## License

MIT License