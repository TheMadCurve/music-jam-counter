// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('id');
const refreshRate = parseInt(urlParams.get('refresh')) || 5;
const style = urlParams.get('style') || 'minimal';

// Supabase configuration
const SUPABASE_URL = 'https://vfkalemgmhobyuqvzreh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZma2FsZW1nbWhvYnl1cXZ6cmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTkzMTksImV4cCI6MjA2MzY5NTMxOX0.oLcwsfd7ZAXaWilOmFxkRZs59qD54G4-geS3YMm2v5M';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const counterContainer = document.getElementById('counter-container');
const voteCountElement = document.getElementById('vote-count');
const counter = document.querySelector('.counter');

// Apply style
counter.classList.remove('minimal', 'detailed', 'animated');
counter.classList.add(style);

// Fetch vote count
async function fetchVoteCount() {
  if (!songId) {
    voteCountElement.textContent = 'ERROR';
    counter.classList.add('error');
    console.error('No song ID provided');
    return;
  }

  try {
    // Get sum of all votes for this song
    const { data, error } = await supabase
      .from('votes')
      .select('points')
      .eq('song_id', songId);

    if (error) {
      throw error;
    }

    // Calculate total votes
    const totalVotes = data.reduce((sum, vote) => sum + vote.points, 0);
    
    // Animate count change
    animateCount(parseInt(voteCountElement.textContent), totalVotes);

  } catch (error) {
    console.error('Error fetching votes:', error);
    counter.classList.add('error');
  }
}

// Animate count change
function animateCount(from, to) {
  if (from === to) return;

  const duration = 500; // ms
  const steps = 20;
  const stepValue = (to - from) / steps;
  const stepDuration = duration / steps;

  let current = from;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    current += stepValue;
    voteCountElement.textContent = Math.round(current);

    if (step >= steps) {
      voteCountElement.textContent = to;
      clearInterval(interval);
      
      // Trigger animation for animated style
      if (style === 'animated') {
        counter.querySelector('.count').style.animation = 'none';
        setTimeout(() => {
          counter.querySelector('.count').style.animation = '';
        }, 10);
      }
    }
  }, stepDuration);
}

// Subscribe to real-time updates
function subscribeToVotes() {
  const subscription = supabase
    .channel('vote-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `song_id=eq.${songId}`
      },
      (payload) => {
        console.log('Vote update received:', payload);
        fetchVoteCount();
      }
    )
    .subscribe();

  return subscription;
}

// Initialize
let subscription = null;

async function init() {
  // Initial fetch
  await fetchVoteCount();

  // Set up real-time subscription
  subscription = subscribeToVotes();

  // Fallback polling (in case real-time doesn't work)
  setInterval(fetchVoteCount, refreshRate * 1000);
}

// Start the counter
init();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
});