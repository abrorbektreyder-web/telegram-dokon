// Supabase bookings jadvaliga user_id va user_name ustunlarini qo'shish
const SUPABASE_URL = 'https://jyoosniusahlxokpxhxt.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5b29zbml1c2FobHhva3B4aHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTE1MjIsImV4cCI6MjA5Mzg4NzUyMn0.pN8VuwKpfMw0XKcdMtac6Hp_okz9qMxasFuErLDXQIM'

async function addColumns() {
  // Avval bookings jadvalida user_id ustuni borligini tekshiramiz
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?limit=1`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  })
  
  if (!checkRes.ok) {
    console.error('❌ Supabase ulanishda xatolik:', checkRes.status, await checkRes.text())
    return
  }
  
  console.log('✅ Supabase ulanishi muvaffaqiyatli')
  console.log('')
  console.log('⚠️  MUHIM: Supabase SQL Editor da quyidagi SQL ni ishga tushiring:')
  console.log('=' .repeat(60))
  console.log(`
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS user_id bigint,
  ADD COLUMN IF NOT EXISTS user_name text;
`)
  console.log('=' .repeat(60))
  console.log('')
  console.log('📌 Supabase Dashboard: https://supabase.com/dashboard/project/jyoosniusahlxokpxhxt/editor')
}

addColumns()
