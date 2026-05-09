import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Calendar, 
  User, 
  Search, 
  ChevronRight, 
  Star, 
  Plus, 
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { supabase } from './lib/supabase'
import { useCartStore } from './store'
import AdminPanel from './components/AdminPanel'
import BookingSystem from './components/BookingSystem'

export default function App() {
  const [activeTab, setActiveTab] = useState('katalog')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const { items, addItem, removeItem, total } = useCartStore()

  useEffect(() => {
    fetchProducts()
    try {
      WebApp.ready()
      WebApp.expand()
      WebApp.headerColor = '#ffffff'
      WebApp.backgroundColor = '#ffffff'
    } catch (e) {}
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (!error) setProducts(data)
    setLoading(false)
  }

  const haptic = () => {
    try { WebApp.HapticFeedback.impactOccurred('light') } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-28">
      {/* Header */}
      <header className="p-5 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl z-40">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Cosmo Pro <Sparkles className="w-5 h-5 text-sky-400" />
          </h1>
          <p className="text-[9px] font-bold text-sky-500/60 uppercase tracking-[0.2em]">Skin & Beauty Clinic</p>
        </div>
        <button className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100">
          <Search className="w-5 h-5 text-sky-500" />
        </button>
      </header>

      <main className="px-5">
        <AnimatePresence mode="wait">
          {activeTab === 'katalog' && (
            <motion.div key="katalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Promo Banner */}
              <div className="relative aspect-[16/8] w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-sky-400 to-sky-600 p-8 flex flex-col justify-center text-white shadow-lg shadow-sky-200">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-20 h-20" /></div>
                <h2 className="text-2xl font-black leading-tight">Yozgi Parvarish<br/>Kolleksiyasi</h2>
                <button className="mt-4 bg-white text-sky-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-lg">Batafsil</button>
              </div>

              {/* Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Katalog</h3>
                <div className="grid grid-cols-2 gap-4">
                  {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] animate-pulse" />)
                  ) : (
                    products.map((p) => (
                      <motion.div 
                        whileTap={{ scale: 0.96 }}
                        key={p.id} onClick={() => { setSelectedProduct(p); haptic(); }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 p-3 premium-shadow flex flex-col"
                      >
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 mb-3">
                           <img src={p.image_url} className="w-full h-full object-cover" />
                        </div>
                        <div className="px-1">
                           <p className="text-[8px] font-black text-sky-500 uppercase tracking-widest mb-1">{p.brand}</p>
                           <h4 className="font-bold text-[11px] leading-tight text-slate-700 line-clamp-2 h-8">{p.name}</h4>
                           <div className="flex justify-between items-center mt-3">
                              <span className="text-sm font-black text-slate-900">{p.price} ₸</span>
                              <button className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200 active:scale-90 transition-transform">
                                 <Plus className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'yozilish' && (
            <motion.div key="yozilish" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BookingSystem />
            </motion.div>
          )}

          {activeTab === 'savat' && (
            <motion.div key="savat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Savatingiz</h2>
              {items.length === 0 ? (
                <div className="py-20 flex flex-col items-center opacity-20">
                   <ShoppingBag className="w-16 h-16 mb-4" />
                   <p className="font-bold">Hozircha bo'sh</p>
                </div>
              ) : (
                <div className="space-y-3">
                   {items.map(item => (
                     <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                        <div className="flex gap-4">
                           <img src={item.image_url} className="w-14 h-14 rounded-2xl object-cover bg-slate-50" />
                           <div>
                              <h4 className="font-bold text-xs text-slate-700">{item.name}</h4>
                              <p className="font-black text-sm text-sky-500 mt-1">{item.price} ₸</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                           <Minus className="w-3.5 h-3.5 text-slate-400" onClick={() => removeItem(item.id)} />
                           <span className="font-bold text-xs">{item.quantity}</span>
                           <Plus className="w-3.5 h-3.5 text-sky-500" onClick={() => addItem(item)} />
                        </div>
                     </div>
                   ))}
                   <div className="pt-8 space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-slate-400 font-bold text-sm uppercase">Jami:</span>
                         <span className="text-2xl font-black text-slate-900">{total()} ₸</span>
                      </div>
                      <button className="w-full bg-sky-500 text-white py-5 rounded-[2rem] font-black text-lg shadow-lg shadow-sky-100 active:scale-95 transition-transform">Buyurtma berish</button>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profil' && (
            <motion.div key="profil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center shadow-sm">
                 <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center border-4 border-white shadow-xl mb-4 text-sky-500">
                    <User className="w-10 h-10" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900">Gost User</h2>
                 <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mt-1">Elite Clinic Member</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {[
                   { icon: ShieldCheck, title: "Buyurtmalar tarixi" },
                   { icon: Star, title: "Bonus ballar" },
                   { icon: Clock, title: "Yozilishlar" }
                 ].map((item, i) => (
                   <button key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-colors">
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500"><item.icon className="w-5 h-5" /></div>
                         <span className="font-bold text-sm text-slate-700">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                   </button>
                 ))}
                 
                 <button 
                   onClick={() => setShowAdmin(true)}
                   className="mt-6 bg-slate-900 text-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-slate-200"
                 >
                    <div className="flex gap-4 items-center">
                       <Sparkles className="w-6 h-6 text-sky-400" />
                       <span className="font-black text-sm uppercase tracking-widest">Admin Dashboard</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 inset-x-6 z-50">
        <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/50 p-2 rounded-full flex justify-between shadow-2xl shadow-sky-100">
          {[
            { id: 'katalog', icon: ShoppingBag, label: 'Katalog' },
            { id: 'yozilish', icon: Calendar, label: 'Yozilish' },
            { id: 'savat', icon: ShoppingBag, label: 'Savat', count: items.length },
            { id: 'profil', icon: User, label: 'Profil' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => { setActiveTab(tab.id); haptic(); }}
              className={`relative flex-1 flex flex-col items-center py-3 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'text-slate-400'}`}
            >
              <tab.icon className={`w-4 h-4 mb-0.5 ${activeTab === tab.id ? 'scale-110' : ''}`} />
              <span className="text-[9px] font-black uppercase tracking-tight">{tab.label}</span>
              {tab.count && tab.count > 0 && activeTab !== tab.id && (
                <span className="absolute top-2 right-4 w-4 h-4 bg-sky-500 text-white rounded-full text-[8px] flex items-center justify-center font-black animate-pulse shadow-md">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3.5rem] p-8 pt-4 pb-12 relative z-[110] shadow-2xl"
            >
               <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
               <div className="aspect-square w-full rounded-[3rem] overflow-hidden bg-slate-50 mb-8 border border-slate-100">
                  <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
               </div>
               <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedProduct.name}</h2>
                    <p className="text-xs font-black text-sky-500 uppercase tracking-widest mt-2">{selectedProduct.brand}</p>
                  </div>
                  <div className="bg-sky-50/50 p-6 rounded-[2.5rem] border border-sky-100">
                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-2">Expert Tip</p>
                    <p className="text-sm italic font-medium text-slate-600 leading-relaxed">{selectedProduct.expert_tip || "Mahsulot haqida ma'lumot kiritilmagan."}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Narxi</p>
                      <span className="text-3xl font-black text-slate-900">{selectedProduct.price} ₸</span>
                    </div>
                    <button 
                      onClick={() => { addItem(selectedProduct); setSelectedProduct(null); haptic(); }}
                      className="flex-[2] bg-sky-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-sky-200 uppercase tracking-widest"
                    >
                      SAVATGA QO'SHISH
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && <AdminPanel products={products} onClose={() => setShowAdmin(false)} onRefresh={fetchProducts} />}
      </AnimatePresence>
    </div>
  )
}
