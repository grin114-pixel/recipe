-- Supabase에서 실행할 SQL
-- SQL Editor에서 아래 쿼리를 실행하세요

CREATE TABLE IF NOT EXISTS foods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  recipe TEXT,
  is_keep BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) 설정 - 필요시 활성화
-- ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON foods FOR ALL USING (true);

-- 모든 유저가 읽기/쓰기 가능하도록 (인증 없이 사용 시)
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON foods
  FOR ALL
  USING (true)
  WITH CHECK (true);
