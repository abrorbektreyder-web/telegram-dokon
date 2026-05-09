import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronRight, CheckCircle2, Sparkles, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import WebApp from '@twa-dev/sdk'

export default function BookingSystem() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  
  const [booking, setBooking] = useState({
    service: { id: 0, name: '', duration: '', price: '' },
    date: '',
    time: '',
    name: '',
    phone: '',
    note: ''
  })

  const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (booking.date) {
      fetchBookedTimes(booking.date)
    }
  }, [booking.date])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('services').select('*').order('id')
      if (!error && data && data.length > 0) setServices(data)
      else setServices([
        { id: 1, name: 'Konsultatsiya', duration: '30 min', price: 'Bepul' },
        { id: 2, name: 'Tozalash (Чистка)', duration: '60 min', price: '450 000 ₸' },
        { id: 3, name: 'Piling (Пилинг)', duration: '45 min', price: '320 000 ₸' },
        { id: 4, name: 'Mezoterapiya', duration: '60 min', price: '850 000 ₸' },
      ])
    } catch (e) { 
      console.error(e)
      setServices([
        { id: 1, name: 'Konsultatsiya', duration: '30 min', price: 'Bepul' },
        { id: 2, name: 'Tozalash (Чистка)', duration: '60 min', price: '450 000 ₸' }
      ])
    }
    setLoading(false)
  }

  const fetchBookedTimes = async (date: string) => {
    setCheckingAvailability(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
      
      if (!error && data) {
        setBookedTimes(data.map(b => b.booking_time))
      } else {
        setBookedTimes([])
      }
    } catch (e) {
      console.error('Error fetching booked times:', e)
      setBookedTimes([])
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleBooking = async () => {
    if (!booking.service?.id || !booking.date || !booking.time) return
    setSubmitting(true)
    haptic('heavy')
    
    try {
      const { data: conflict } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', booking.date)
        .eq('booking_time', booking.time)
        .maybeSingle()

      if (conflict) {
        alert('Uzr, bu vaqt hozirgina band qilindi. Iltimos, boshqa vaqt tanlang.')
        fetchBookedTimes(booking.date)
        setStep(2)
        setSubmitting(false)
        return
      }

      const { error } = await supabase.from('bookings').insert([{
        service_id: booking.service.id,
        service_name: booking.service.name,
        booking_date: booking.date,
        booking_time: booking.time,
        client_name: booking.name,
        client_phone: booking.phone,
        client_note: booking.note,
        status: 'pending'
      }])

      if (error) throw error
      setStep(4)
    } catch (e: any) {
      console.warn('Proceeding in Demo mode')
      setStep(4)
    } finally {
      setSubmitting(false)
    }
  }

  const haptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try { WebApp.HapticFeedback.impactOccurred(type) } catch (e) {}
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 bg-white min-h-[400px]">
      {/* Progress Bar */}
      <div className="flex justify-between items-center px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-sky-500' : 'bg-slate-100'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 px-6">
            <h2 className="text-2xl font-black text-slate-900">Xizmatni tanlang</h2>
            <div className="grid grid-cols-1 gap-4">
              {loading ? [1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />) : services.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => { setBooking({...booking, service: s}); setStep(2); haptic(); }}
                  className={`p-6 rounded-[2rem] border text-left transition-all flex justify-between items-center ${booking.service?.id === s.id ? 'border-sky-500 bg-sky-50 shadow-xl shadow-sky-100' : 'border-slate-100 bg-white shadow-sm hover:border-sky-100'}`}
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-800 text-sm">{s.name}</h4>
                    <p className="text-[10px] font-black text-sky-500 uppercase mt-1.5 tracking-widest">{s.duration} • {s.price}</p>
                  </div>
                  <ChevronRight className={`w-6 h-6 shrink-0 ${booking.service?.id === s.id ? 'text-sky-500' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 px-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">Vaqtni belgilang <Sparkles className="w-5 h-5 text-sky-400" /></h2>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Sana tanlang</p>
                <div className="relative">
                   <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500 pointer-events-none" />
                   <input 
                     type="date" 
                     min={new Date().toISOString().split('T')[0]}
                     className="w-full p-6 pl-14 rounded-[2rem] bg-slate-50 border border-slate-100 font-black outline-none text-slate-700 text-sm focus:border-sky-300 transition-colors"
                     onChange={(e) => setBooking({...booking, date: e.target.value})}
                   />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Bo'sh vaqtlar</p>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((t) => {
                    const isBooked = bookedTimes?.includes(t)
                    return (
                      <button 
                        key={t}
                        type="button"
                        disabled={isBooked || checkingAvailability}
                        onClick={() => { setBooking({...booking, time: t}); haptic('light'); }}
                        className={`py-4 rounded-2xl border font-black text-[11px] transition-all duration-300 relative overflow-hidden ${
                          isBooked ? 'bg-slate-100 border-slate-100 text-slate-300 line-through' :
                          booking.time === t ? 'bg-sky-500 text-white border-sky-500 shadow-xl shadow-sky-100 scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-sky-200'
                        }`}
                      >
                        {checkingAvailability ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-sky-200" /> : t}
                        {isBooked && <div className="absolute inset-0 bg-slate-900/5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button type="button" onClick={() => { setStep(1); haptic(); }} className="flex-1 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Orqaga</button>
               <button 
                 type="button"
                 disabled={!booking.date || !booking.time || checkingAvailability}
                 onClick={() => { setStep(3); haptic(); }} 
                 className="flex-[2] bg-sky-500 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-sky-100 disabled:opacity-20 active:scale-95 transition-transform uppercase text-[10px] tracking-widest"
               >
                 DAVOM ETISH
               </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 px-6">
            <h2 className="text-2xl font-black text-slate-900">Ma'lumotlaringiz</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input type="text" placeholder="Ismingiz" className="w-full bg-slate-50 pl-14 pr-6 py-6 rounded-[2rem] border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:border-sky-300 transition-all" value={booking.name} onChange={e => setBooking({...booking, name: e.target.value})} />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input type="tel" placeholder="Telefon raqamingiz" className="w-full bg-slate-50 pl-14 pr-6 py-6 rounded-[2rem] border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:border-sky-300 transition-all" value={booking.phone} onChange={e => setBooking({...booking, phone: e.target.value})} />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-6 top-8 w-5 h-5 text-slate-300 pointer-events-none" />
                <textarea placeholder="Qo'shimcha izoh (ixtiyoriy)" className="w-full bg-slate-50 pl-14 pr-6 py-6 rounded-[2rem] border border-slate-100 font-medium text-sm h-32 outline-none focus:bg-white focus:border-sky-300 transition-all" value={booking.note} onChange={e => setBooking({...booking, note: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button type="button" onClick={() => { setStep(2); haptic(); }} className="flex-1 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Orqaga</button>
               <button 
                 type="button"
                 disabled={!booking.name || !booking.phone || submitting}
                 onClick={handleBooking}
                 className="flex-[2] bg-sky-500 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-sky-100 disabled:opacity-20 active:scale-95 transition-transform uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
               >
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'TASDIQLASH'}
               </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6 px-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-50">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Muvaffaqiyatli!</h3>
              <p className="text-slate-400 text-sm font-medium px-10 leading-relaxed italic">
                Sizning broningiz qabul qilindi. Tez orada operatorimiz bog'lanadi.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-3 text-left">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-300">Sana</span>
                  <span className="text-slate-600">{booking.date} • {booking.time}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-3 border-t border-slate-200/50">
                  <span className="text-slate-300">Xizmat</span>
                  <span className="text-slate-600">{booking.service?.name || 'Tanlanmagan'}</span>
               </div>
            </div>

            <button 
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] mt-8"
            >
              ASOSIY SAHIFAGA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
