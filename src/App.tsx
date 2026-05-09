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
  Clock,
  Trash2
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
  
  const { items, addItem, removeItem, updateQuantity, total } = useCartStore()

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
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (!error) setProducts(data || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const haptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try { WebApp.HapticFeedback.impactOccurred(type) } catch (e) {}
  }

  // Universal Currency Formatter
  const formatValue = (val: any) => {
    if (!val) return '0'
    // Agar raqam bo'lsa, chiroyli formatlash, aks holda kiritilgan stringni qaytarish
    const cleanNum = String(val).replace(/[^0-9]/g, '')
    if (cleanNum && String(val).length === cleanNum.length) {
      return parseInt(cleanNum, 10).toLocaleString('fr-FR')
    }
    return val // Valyuta belgisi bilan kiritilgan bo'lsa aynan o'zini qaytaradi
  }

  // Get dynamic currency symbol from products
  const getCurrency = () => {
    if (items.length > 0) {
      const p = items[0].price
      const symbol = String(p).replace(/[0-9\s]/g, '')
      return symbol || 'so\'m'
    }
    if (products.length > 0) {
       const p = products[0].price
       const symbol = String(p).replace(/[0-9\s]/g, '')
       return symbol || 'so\'m'
    }
    return 'so\'m'
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-2.5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-xl z-[40] border-b border-slate-100">
        <h1 className="text-sm font-black tracking-tighter text-slate-900 flex items-center gap-1">
          Cosmo Pro <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        </h1>
        <button className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100">
          <Search className="w-4 h-4 text-sky-500" />
        </button>
      </header>

      <main className="px-3 pt-4">
        {/* KATALOG */}
        {activeTab === 'katalog' && (
          <div className="space-y-4">
            <div className="relative h-16 w-full rounded-xl overflow-hidden bg-gradient-to-r from-sky-400 to-sky-500 p-4 flex items-center shadow-sm">
              <div className="relative z-10">
                 <h2 className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Yozgi<br/>Kolleksiya</h2>
                 <div className="mt-1.5 bg-white text-sky-500 px-2 py-0.5 rounded-full text-[5px] font-black uppercase w-fit">Ko'rish</div>
              </div>
              <div className="absolute right-[-5%] top-0 bottom-0 w-1/2 bg-white/5 skew-x-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">Mahsulotlar</h3>
              <div className="grid grid-cols-3 gap-2">
                {loading ? (
                  [1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-50 rounded-xl animate-pulse" />)
                ) : (
                  products.map((p) => (
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      key={p.id} onClick={() => { setSelectedProduct(p); haptic(); }}
                      className="bg-white rounded-xl border border-slate-50 p-1.5 shadow-sm flex flex-col"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-50 mb-1.5">
                         <img src={p.image_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="px-0.5">
                         <h4 className="font-bold text-[8px] leading-tight text-slate-700 line-clamp-1">{p.name}</h4>
                         <div className="flex justify-between items-center mt-1">
                            <span className="text-[8px] font-black text-slate-900">{formatValue(p.price)}</span>
                            <div className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center">
                               <Plus className="w-2.5 h-2.5" />
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* YOZILISH */}
        {activeTab === 'yozilish' && (
          <BookingSystem />
        )}

        {/* SAVAT */}
        {activeTab === 'savat' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-base font-black px-1 text-slate-900">Savatingiz</h2>
            
            {items.length === 0 ? (
              <div className="py-20 flex flex-col items-center opacity-20">
                 <ShoppingBag className="w-8 h-8 mb-2" />
                 <p className="font-bold text-[8px]">Hozircha bo'sh</p>
              </div>
            ) : (
              <div className="space-y-2">
                 {items.map(item => (
                   <div key={item.id} className="bg-white p-2 rounded-xl flex justify-between items-center border border-slate-100 shadow-sm">
                      <div className="flex gap-2">
                         <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                            <img src={item.image_url} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-[8px] text-slate-700 line-clamp-1">{item.name}</h4>
                            <p className="font-black text-[9px] text-sky-500">{formatValue(item.price)}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-lg">
                         <button 
                           onClick={(e) => { e.stopPropagation(); item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id); haptic(); }}
                           className="w-5 h-5 flex items-center justify-center text-slate-400"
                         >
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3" />}
                         </button>
                         <span className="font-black text-[9px] w-3 text-center">{item.quantity}</span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); haptic(); }}
                           className="w-5 h-5 flex items-center justify-center text-sky-500"
                         >
                            <Plus className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                 ))}
                 
                 <div className="pt-4 mt-2 border-t border-slate-100 space-y-4 px-1">
                    <div className="flex justify-between items-center">
                       <span className="text-slate-400 font-bold text-[8px] uppercase tracking-widest">Umumiy:</span>
                       <span className="text-base font-black text-slate-900">{total().toLocaleString('fr-FR')} {getCurrency()}</span>
                    </div>
                    <button className="w-full bg-sky-500 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-50 active:scale-95 transition-transform">Xaridni yakunlash</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-sky-50/50 p-4 rounded-xl flex items-center gap-3 border border-sky-100/20">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-500 shadow-sm">
                  <User className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="text-sm font-black text-slate-900">Gost User</h2>
                  <p className="text-[7px] font-bold text-sky-400 uppercase tracking-widest">Active Member</p>
               </div>
            </div>
            
            <button 
               onClick={() => { setShowAdmin(true); haptic('medium'); }}
               className="w-full bg-slate-900 text-white p-3.5 rounded-xl flex justify-between items-center shadow-lg active:scale-95 transition-transform"
            >
               <span className="font-black text-[8px] uppercase tracking-widest">Admin Dashboard</span>
               <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-3 inset-x-4 z-[50]">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-100 p-1 rounded-xl flex justify-between shadow-xl">
          {[
            { id: 'katalog', icon: ShoppingBag, label: 'Katalog' },
            { id: 'yozilish', icon: Calendar, label: 'Yozilish' },
            { id: 'savat', icon: ShoppingBag, label: 'Savat', count: items.length },
            { id: 'profil', icon: User, label: 'Profil' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => { setActiveTab(tab.id); haptic(); }}
              className={`relative flex-1 flex flex-col items-center py-1.5 rounded-lg transition-all duration-200 ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400'}`}
            >
              <tab.icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[6px] font-black uppercase tracking-tight">{tab.label}</span>
              {tab.count && tab.count > 0 && (
                <span className={`absolute top-0.5 right-3 w-2.5 h-2.5 rounded-full text-[5px] flex items-center justify-center font-bold border border-white ${activeTab === tab.id ? 'bg-white text-sky-500' : 'bg-sky-500 text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white w-full rounded-t-2xl p-4 pb-8 relative z-[110] shadow-2xl border-t border-slate-100"
            >
               <div className="w-8 h-1 bg-slate-100 rounded-full mx-auto mb-4" />
               <div className="flex gap-4 items-center mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-50 shrink-0 shadow-sm">
                    <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[10px] font-black leading-tight text-slate-900">{selectedProduct.name}</h2>
                    <p className="text-[6px] font-black text-sky-500 uppercase mt-0.5">{selectedProduct.brand}</p>
                    <p className="text-xs font-black mt-1.5 text-slate-800">{formatValue(selectedProduct.price)}</p>
                  </div>
               </div>
               <button 
                  onClick={() => { addItem(selectedProduct); setSelectedProduct(null); haptic('medium'); }}
                  className="w-full bg-sky-500 text-white py-3 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md active:scale-95 transition-transform"
                >
                  SAVATGA QO'SHISH
                </button>
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
