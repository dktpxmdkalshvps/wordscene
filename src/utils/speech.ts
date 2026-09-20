const audioUrlCache = new Map<string, string>();

const synthesizeViaServer = async (text: string): Promise<string | null> => {
  const cached = audioUrlCache.get(text);
  if (cached) return cached;

  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/functions/v1/text-to-speech`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) return null;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    audioUrlCache.set(text, objectUrl);
    return objectUrl;
  } catch {
    return null;
  }
};

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  if (voicesReadyPromise) return voicesReadyPromise;

  voicesReadyPromise = new Promise(resolve => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }

    const handleVoicesChanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Some browsers never fire voiceschanged reliably - fall back after a beat.
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 1000);
  });

  return voicesReadyPromise;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

// Ordered best-to-worst. Desktop "SAPI" voices (e.g. "Microsoft David Desktop",
// "Microsoft Zira Desktop") are deliberately not matched here - they're the
// robotic-sounding fallback we're trying to avoid, and win only if nothing
// else on the device qualifies. This whole path is now a last-resort fallback
// for when the server TTS call fails (e.g. offline, function not deployed).
const PREFERRED_VOICE_PATTERNS = [
  /Google US English/i,
  /Online.*Natural/i,
  /Natural/i,
  /Samantha/i,
  /Google/i,
];

const pickBestVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
  const enVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
  for (const pattern of PREFERRED_VOICE_PATTERNS) {
    const match = enVoices.find(v => pattern.test(v.name));
    if (match) return match;
  }
  return enVoices[0];
};

const speakWithBrowserVoice = async (cleanText: string, rate: number): Promise<boolean> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this browser.');
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = cachedVoices.length > 0 ? cachedVoices : await loadVoices();
    const bestVoice = pickBestVoice(voices);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('Browser TTS fallback failed:', error);
    return false;
  }
};

export async function speakEnglishText(text: string, rate: number = 0.9): Promise<boolean> {
  const cleanText = text.replace(/[“”"']/g, '').trim();
  if (!cleanText) return false;

  const audioUrl = await synthesizeViaServer(cleanText);
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      audio.playbackRate = rate;
      await audio.play();
      return true;
    } catch (error) {
      console.error('Server TTS playback failed, falling back to browser voice:', error);
    }
  }

  return speakWithBrowserVoice(cleanText, rate);
}
