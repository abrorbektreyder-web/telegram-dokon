import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import WebApp from '@twa-dev/sdk'

export default function CustomerHistory() {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const user = WebApp.initDataUnsafe.user

  useEffect(() => {
    if (user && user.id) {
      fetchHistory()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchHistory = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHistory(data || [])
    } catch (error) {
      console.warn('History fetch error:', error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
    </div>
  )

  if (!user?.id) return (
    <div className="text-center py-20 opacity-30">
       <Clock className="w-12 h-12 mx-auto mb-4" />
       <p className="font-black text-[10px] uppercase tracking-widest">Tarixni ko'rish uchun Telegram orqali kiring</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-400">Sizning faolligingiz</h3>
        <button onClick={fetchHistory} className="text-sky-500 text-[10px] font-bold">Yangilash</button>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] p-10 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hali hech qanday bronlar yo'q</p>
        </div>
      ) : (
        history.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                  {item.service_name ? <Calendar className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
               </div>
               <div>
                  <h4 className="font-black text-sm text-slate-800">{item.service_name || 'Mahsulot xaridi'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-bold text-slate-400">{item.booking_date || new Date(item.created_at).toLocaleDateString()}</span>
                     <span className="w-1 h-1 bg-slate-200 rounded-full" />
                     <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                       item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' : 
                       item.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'
                     }`}>
                       {item.status === 'confirmed' ? 'Tasdiqlangan' : item.status === 'pending' ? 'Kutilmoqda' : item.status}
                     </span>
                  </div>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-200" />
          </motion.div>
        ))
      )}
    </div>
  )
}
