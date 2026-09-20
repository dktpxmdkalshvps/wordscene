// Supabase Edge Function (Deno runtime).
// Generates natural English speech via the Gemini TTS API so pronunciation
// no longer depends on whatever voices happen to be installed on the user's
// OS/browser (Korean Windows installs often ship with zero English voices).
// Reuses the same GEMINI_API_KEY already set for sentence-tutor.
// Deploy with: npx supabase functions deploy text-to-speech --project-ref <ref>
// Model/voice are overridable without redeploying, same pattern as
// sentence-tutor's GEMINI_MODEL override:
//   npx supabase secrets set GEMINI_TTS_MODEL=<model>
//   npx supabase secrets set GEMINI_TTS_VOICE=<voice>

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_TEXT_LENGTH = 300;

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

const buildWavHeader = (dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number): Uint8Array => {
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);
  return new Uint8Array(buffer);
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'POST 요청만 지원합니다.' }, 405);
  }

  try {
    const { text } = (await req.json()) as { text?: string };
    const trimmed = (text ?? '').trim();
    if (!trimmed) {
      return jsonResponse({ error: '텍스트가 비어 있습니다.' }, 400);
    }
    if (trimmed.length > MAX_TEXT_LENGTH) {
      return jsonResponse({ error: `텍스트는 ${MAX_TEXT_LENGTH}자 이내여야 합니다.` }, 400);
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return jsonResponse({ error: '음성 합성이 아직 설정되지 않았습니다.' }, 500);
    }
    const model = Deno.env.get('GEMINI_TTS_MODEL') ?? 'gemini-2.5-flash-preview-tts';
    const voiceName = Deno.env.get('GEMINI_TTS_VOICE') ?? 'Kore';

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: trimmed }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini TTS error', geminiResponse.status, await geminiResponse.text());
      return jsonResponse({ error: '음성 생성에 실패했습니다.' }, 502);
    }

    const data = await geminiResponse.json();
    const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineData?.data) {
      console.error('Gemini TTS returned no audio', JSON.stringify(data));
      return jsonResponse({ error: '음성 생성에 실패했습니다.' }, 502);
    }

    const rateMatch = /rate=(\d+)/.exec(inlineData.mimeType ?? '');
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

    const pcmBytes = Uint8Array.from(atob(inlineData.data), c => c.charCodeAt(0));
    const header = buildWavHeader(pcmBytes.length, sampleRate, 1, 16);
    const wavBytes = new Uint8Array(header.length + pcmBytes.length);
    wavBytes.set(header, 0);
    wavBytes.set(pcmBytes, header.length);

    return new Response(wavBytes, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'audio/wav' },
    });
  } catch (error) {
    console.error('text-to-speech unexpected error', error);
    return jsonResponse({ error: '요청을 처리하지 못했습니다.' }, 500);
  }
});
