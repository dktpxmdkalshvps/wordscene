// Supabase Edge Function (Deno runtime).
// Lets the admin review screen approve/reject candidate content without ever
// shipping a service-role key to the browser. Gated by a shared passcode —
// this is NOT real authentication, just enough friction to keep the write
// path out of casual reach. Deploy with:
//   npx supabase functions deploy admin-review --project-ref <ref>
// Requires the ADMIN_PASSCODE secret:
//   npx supabase secrets set ADMIN_PASSCODE=<passcode>
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by the
// Supabase platform for every edge function — no need to set them manually.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ALLOWED_TABLES: Record<string, { idColumn: string }> = {
  book_contents: { idColumn: 'candidate_id' },
  movie_quotes_ko_en: { idColumn: 'id' },
  generated_questions: { idColumn: 'id' },
};

type ReviewRequestBody = {
  passcode?: string;
  table?: string;
  id?: string | number;
  action?: 'approve' | 'reject';
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'POST 요청만 지원합니다.' }, 405);
  }

  try {
    const { passcode, table, id, action } = (await req.json()) as ReviewRequestBody;

    const expectedPasscode = Deno.env.get('ADMIN_PASSCODE');
    if (!expectedPasscode) {
      console.error('ADMIN_PASSCODE is not configured');
      return jsonResponse({ error: '관리자 기능이 아직 설정되지 않았습니다.' }, 500);
    }
    if (!passcode || passcode !== expectedPasscode) {
      return jsonResponse({ error: '패스코드가 올바르지 않습니다.' }, 401);
    }

    const tableConfig = table ? ALLOWED_TABLES[table] : undefined;
    if (!tableConfig) {
      return jsonResponse({ error: '지원하지 않는 테이블입니다.' }, 400);
    }
    if (id === undefined || id === null || id === '') {
      return jsonResponse({ error: 'id가 필요합니다.' }, 400);
    }
    if (action !== 'approve' && action !== 'reject') {
      return jsonResponse({ error: '지원하지 않는 작업입니다.' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not available');
      return jsonResponse({ error: '관리자 기능이 아직 설정되지 않았습니다.' }, 500);
    }

    const newStatus = action === 'approve' ? 'selected' : 'rejected';
    const patchResponse = await fetch(
      `${supabaseUrl}/rest/v1/${table}?${tableConfig.idColumn}=eq.${encodeURIComponent(String(id))}`,
      {
        method: 'PATCH',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ review_status: newStatus }),
      }
    );

    if (!patchResponse.ok) {
      console.error('admin-review patch failed', patchResponse.status, await patchResponse.text());
      return jsonResponse({ error: '검수 처리에 실패했습니다.' }, 502);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('admin-review unexpected error', error);
    return jsonResponse({ error: '요청을 처리하지 못했습니다.' }, 500);
  }
});
