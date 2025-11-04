// Configuration
const SUPABASE_URL = 'https://vfkalemgmhobyuqvzreh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZma2FsZW1nbWhvYnl1cXZ6cmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTkzMTksImV4cCI6MjA2MzY5NTMxOX0.oLcwsfd7ZAXaWilOmFxkRZs59qD54G4-geS3YMm2v5M';

// Get the base URL for the counter widget
// This will be your GitHub Pages URL for the counter repository
const BASE_URL = 'https://themadcurve.github.io/music-jam-counter/';

// DOM elements
const songIdInput = document.getElementById('song-id');
const refreshRateInput = document.getElementById('refresh-rate');
const generateBtn = document.getElementById('generate-btn');
const previewSection = document.getElementById('preview-section');
const generatedUrlInput = document.getElementById('generated-url');
const copyBtn = document.getElementById('copy-btn');
const previewFrame = document.getElementById('preview-frame');

// Style radio buttons
const styleRadios = document.querySelectorAll('input[name="style"]');

// Event listeners
generateBtn.addEventListener('click', generateUrl);
copyBtn.addEventListener('click', copyUrl);

// Generate the counter URL
function generateUrl() {
  const songId = songIdInput.value.trim();
  const refreshRate = refreshRateInput.value;
  const style = document.querySelector('input[name="style"]:checked').value;

  if (!songId) {
    alert('Please enter your Song ID');
    songIdInput.focus();
    return;
  }

  // Validate UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(songId)) {
    alert('Please enter a valid Song ID (UUID format)');
    songIdInput.focus();
    return;
  }

  // Build the counter URL with parameters
  const params = new URLSearchParams({
    id: songId,
    refresh: refreshRate,
    style: style
  });

  const counterUrl = `${BASE_URL}counter.html?${params.toString()}`;

  // Display the generated URL
  generatedUrlInput.value = counterUrl;
  previewSection.style.display = 'block';

  // Load preview
  previewFrame.src = counterUrl;

  // Scroll to preview
  previewSection.scrollIntoView({ behavior: 'smooth' });
}

// Copy URL to clipboard
async function copyUrl() {
  const url = generatedUrlInput.value;

  try {
    await navigator.clipboard.writeText(url);
    
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    // Fallback for older browsers
    generatedUrlInput.select();
    document.execCommand('copy');
    alert('URL copied to clipboard!');
  }
}