-- 익명 기기 기반 진도 동기화.
-- 보안 주의: anon 키에는 행 단위 식별 클레임이 없어 RLS로 device_id별 접근을
-- 실제로 제한할 수 없다. 아래 정책은 의도적으로 anon에 전체 CRUD를 허용하며,
-- device_id는 실질적으로 "추측 불가능한 공유 토큰" 수준의 신뢰만 제공한다.
-- 민감 정보를 이 테이블에 넣지 말 것.

create table if not exists public.device_progress (
  device_id     text primary key,
  total_xp      integer not null default 0,
  streak_days   integer not null default 0,
  work_progress jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

alter table public.device_progress enable row level security;

create policy "anon full access to device_progress"
  on public.device_progress for all to anon
  using (true) with check (true);

create or replace function public.set_device_progress_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger device_progress_touch_updated_at
  before update on public.device_progress
  for each row execute function public.set_device_progress_updated_at();
