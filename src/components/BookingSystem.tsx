import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, User, Phone, MessageSquare, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react'

const SERVICES = [
  { id: 1, name: 'Konsultatsiya', duration: '30 min', price: 'Bepul' },
  { id: 2, name: 'Tozalash (Чистка)', duration: '60 min', price: '450 000 ₸' },
  { id: 3, name: 'Piling (Пилинг)', duration: '45 min', price: '320 000 ₸' },
  { id: 4, name: 'Mezoterapiya', duration: '60 min', price: '850 000 ₸' },
]

const TIME_SLOTS = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00']

export default function BookingSystem() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    service: null as any,
    date: '',
    time: '',
    name: '',
    phone: '',
    note: ''
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex justify-between items-center px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-sky-500' : 'bg-slate-100'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Xizmatni tanlang</h2>
            <div className="grid grid-cols-1 gap-3">
              {SERVICES.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => { setBooking({...booking, service: s}); nextStep(); }}
                  className={`p-5 rounded-3xl border text-left transition-all flex justify-between items-center ${booking.service?.id === s.id ? 'border-sky-500 bg-sky-50' : 'border-slate-100 bg-white shadow-sm'}`}
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{s.name}</h4>
                    <p className="text-[10px] font-bold text-sky-500 uppercase mt-1 tracking-widest">{s.duration} • {s.price}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${booking.service?.id === s.id ? 'text-sky-500' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">Vaqtni belgilang <Sparkles className="w-5 h-5 text-sky-400" /></h2>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sana</p>
                <input 
                  type="date" 
                  className="w-full p-5 rounded-3xl bg-slate-50 border border-slate-100 font-bold outline-none text-slate-700"
                  onChange={(e) => setBooking({...booking, date: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bo'sh vaqtlar</p>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((t) => (
                    <button 
                      key={t}
                      onClick={() => setBooking({...booking, time: t})}
                      className={`p-4 rounded-2xl border font-bold text-xs transition-all ${booking.time === t ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' : 'bg-white border-slate-100 text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
               <button onClick={prevStep} className="flex-1 py-5 text-xs font-black text-slate-300 uppercase">Orqaga</button>
               <button 
                 disabled={!booking.date || !booking.time}
                 onClick={nextStep} 
                 className="flex-[2] bg-sky-500 text-white py-5 rounded-[2rem] font-black shadow-lg shadow-sky-100 disabled:opacity-30"
               >
                 DAVOM ETISH
               </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900">Ma'lumotlaringiz</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-5 top-5 w-5 h-5 text-sky-400" />
                <input 
                  type="text" placeholder="Ismingiz" 
                  className="w-full bg-slate-50 p-5 pl-14 rounded-3xl border border-slate-100 font-bold text-sm outline-none"
                  value={booking.name} onChange={(e) => setBooking({...booking, name: e.target.value})}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-5 top-5 w-5 h-5 text-sky-400" />
                <input 
                  type="tel" placeholder="Telefon raqamingiz" 
                  className="w-full bg-slate-50 p-5 pl-14 rounded-3xl border border-slate-100 font-bold text-sm outline-none"
                  value={booking.phone} onChange={(e) => setBooking({...booking, phone: e.target.value})}
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-sky-400" />
                <textarea 
                  placeholder="Muammo haqida qisqacha (ixtiyoriy)" 
                  className="w-full bg-slate-50 p-5 pl-14 rounded-3xl border border-slate-100 font-medium text-sm outline-none h-32"
                  value={booking.note} onChange={(e) => setBooking({...booking, note: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={!booking.name || !booking.phone}
              onClick={() => setStep(4)} 
              className="w-full bg-sky-500 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl shadow-sky-100"
            >
              YAZILISHNI TASDIQLASH
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-500">
               <CheckCircle2 className="w-16 h-16 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Muvaffaqiyatli!</h2>
              <p className="text-sm font-medium text-slate-400 mt-2 px-6">Sizning so'rovingiz qabul qilindi. Tez orada mutaxassisimiz bog'lanadi.</p>
            </div>
            
            <div className="w-full bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-left space-y-2">
               <p className="text-[10px] font-black text-sky-500 uppercase">Buyurtma tafsilotlari:</p>
               <h4 className="font-bold text-slate-800">{booking.service?.name}</h4>
               <p className="text-xs font-medium text-slate-500">{booking.date} • {booking.time}</p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest"
            >
              ASOSIY SAHIFAGA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { AnimatePresence } from 'framer-motion'
