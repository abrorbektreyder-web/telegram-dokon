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
  Trash2,
  Filter,
  X
} from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { supabase } from './lib/supabase'
import { useCartStore } from './store'
import AdminPanel from './components/AdminPanel'
import BookingSystem from './components/BookingSystem'

export default function App() {
  const [activeTab, setActiveTab] = useState('katalog')
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Hammasi')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const categories = ['Hammasi', 'Tozalash', 'Namlantirish', 'Yuz', 'Tana', 'Aksiya']
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

  useEffect(() => {
    filterProducts()
  }, [searchQuery, activeCategory, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (!error) {
        setProducts(data || [])
        setFilteredProducts(data || [])
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filterProducts = () => {
    let result = products
    if (activeCategory !== 'Hammasi') result = result.filter(p => p.category === activeCategory)
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredProducts(result)
  }

  const haptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try { WebApp.HapticFeedback.impactOccurred(type) } catch (e) {}
  }

  const formatValue = (val: any) => {
    if (!val) return '0'
    const cleanNum = String(val).replace(/[^0-9]/g, '')
    if (cleanNum && String(val).length === cleanNum.length) return parseInt(cleanNum, 10).toLocaleString('fr-FR')
    return val
  }

  const getCurrency = () => {
    if (items.length > 0) return String(items[0].price).replace(/[0-9\s]/g, '') || 'so\'m'
    if (products.length > 0) return String(products[0].price).replace(/[0-9\s]/g, '') || 'so\'m'
    return 'so\'m'
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32 overflow-x-hidden selection:bg-sky-100">
      {/* Header - Slightly Larger */}
      <header className="px-5 py-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-2xl z-[45] border-b border-slate-50">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input autoFocus type="text" placeholder="Qidirish..." className="w-full bg-slate-50 py-2.5 pl-11 pr-4 rounded-2xl text-xs font-bold outline-none border border-slate-100 focus:border-sky-200 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><X className="w-5 h-5" /></button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex justify-between items-center">
              <h1 className="text-lg font-black tracking-tighter text-slate-900 flex items-center gap-2">Cosmo Pro <Sparkles className="w-4 h-4 text-sky-400" /></h1>
              <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100 text-sky-500 active:scale-90 transition-transform"><Search className="w-5 h-5" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-3 max-w-4xl mx-auto">
        {/* KATALOG */}
        {activeTab === 'katalog' && (
          <div className="space-y-6">
            <div className="overflow-x-auto no-scrollbar px-5">
               <div className="flex gap-2.5 pb-2">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { setActiveCategory(cat); haptic(); }} className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-sky-500 text-white shadow-xl shadow-sky-100 scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}>{cat}</button>
                  ))}
               </div>
            </div>

            <div className="px-5 space-y-6">
              <div className="relative h-28 w-full rounded-[2rem] overflow-hidden bg-slate-900 p-6 flex items-center group shadow-2xl shadow-slate-200">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-transparent z-10" />
                <div className="relative z-20">
                   <p className="text-[7px] font-black text-sky-400 uppercase tracking-[0.4em] mb-1.5">Eksklyuziv</p>
                   <h2 className="text-sm font-black text-white uppercase tracking-widest leading-tight">Yozgi<br/>Kolleksiya</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{activeCategory}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {loading ? [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2rem] animate-pulse" />) : filteredProducts.map((p) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.97 }} key={p.id} onClick={() => { setSelectedProduct(p); haptic(); }} className="bg-white rounded-[2rem] border border-slate-50 p-2.5 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                      <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-3 relative">
                         <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="px-1.5 flex-1 flex flex-col justify-between pb-1">
                         <div>
                           <p className="text-[7px] font-black text-sky-400 uppercase tracking-widest mb-1">{p.brand}</p>
                           <h4 className="font-bold text-[11px] leading-tight text-slate-700 line-clamp-1">{p.name}</h4>
                         </div>
                         <div className="flex justify-between items-center mt-4">
                            <span className="text-[12px] font-black text-slate-900">{formatValue(p.price)} <span className="text-[8px] text-slate-300 font-bold ml-0.5">{getCurrency()}</span></span>
                            <div className="w-6 h-6 rounded-xl bg-sky-500 text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-sky-100"><Plus className="w-4 h-4" /></div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* YOZILISH */}
        {activeTab === 'yozilish' && <BookingSystem />}

        {/* SAVAT */}
        {activeTab === 'savat' && (
          <div className="px-5 space-y-5 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-slate-900">Mening Savatim</h2>
            {items.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12 mb-3" /><p className="font-bold text-[11px] uppercase tracking-widest">Bo'sh</p></div>
            ) : (
              <div className="space-y-4">
                 {items.map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-slate-50 flex justify-between items-center shadow-sm">
                      <div className="flex gap-4">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50"><img src={item.image_url} className="w-full h-full object-cover" /></div>
                         <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-[11px] text-slate-800 line-clamp-1">{item.name}</h4>
                            <p className="font-black text-[12px] text-sky-500 mt-1">{formatValue(item.price)} {getCurrency()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
                         <button onClick={() => { item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id); haptic(); }} className="w-8 h-8 flex items-center justify-center text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">{item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}</button>
                         <span className="font-black text-xs text-slate-700 w-6 text-center">{item.quantity}</span>
                         <button onClick={() => { addItem(item); haptic(); }} className="w-8 h-8 flex items-center justify-center text-sky-500 bg-white rounded-xl shadow-sm border border-slate-100"><Plus className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
                 <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-5 shadow-2xl">
                    <div className="flex justify-between items-center"><span className="text-[11px] font-black uppercase tracking-[0.3em]">Jami Summa:</span><span className="text-2xl font-black">{total().toLocaleString('fr-FR')} <span className="text-xs text-sky-400">{getCurrency()}</span></span></div>
                    <button onClick={() => { haptic('heavy'); alert('Tez orada...'); }} className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-transform">XARIDNI YAKUNLASH</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <div className="px-5 space-y-5 animate-in fade-in duration-300">
            <div className="bg-slate-900 p-10 rounded-[2.5rem] flex flex-col items-center text-center text-white"><div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-sky-500 mb-4 shadow-2xl"><User className="w-10 h-10" /></div><h2 className="text-xl font-black mb-1 text-white">Gost User</h2><p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest opacity-80">Premium Member</p></div>
            <div className="grid grid-cols-1 gap-3">
               {[{ icon: ShieldCheck, title: "Xavfsizlik", desc: "PIN-kod va biometriya" }, { icon: Clock, title: "Tarix", desc: "Barcha xaridlar" }].map((it, i) => (
                 <button key={i} className="bg-white p-5 rounded-2xl border border-slate-50 flex justify-between items-center active:bg-slate-50 transition-all shadow-sm"><div className="flex items-center gap-5 text-left"><div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500"><it.icon className="w-5 h-5" /></div><div><p className="font-black text-[12px] text-slate-800">{it.title}</p><p className="text-[9px] font-medium text-slate-400">{it.desc}</p></div></div><ChevronRight className="w-4 h-4 text-slate-200" /></button>
               ))}
               <button onClick={() => { setShowAdmin(true); haptic('medium'); }} className="mt-5 w-full bg-sky-500 text-white p-5.5 rounded-[2rem] flex justify-between items-center shadow-2xl shadow-sky-100 active:scale-95 transition-transform"><div className="flex items-center gap-5"><Sparkles className="w-6 h-6 text-white" /><span className="font-black text-[11px] uppercase tracking-widest text-left">Admin Panel</span></div><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation - 10% Larger & More Spread Out */}
      <nav className="fixed bottom-8 inset-x-6 z-[50] flex justify-center">
        <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-2 rounded-[1.75rem] flex gap-2 shadow-[0_25px_60px_rgba(0,163,255,0.18)]">
          {[
            { id: 'katalog', icon: ShoppingBag, label: 'SHOP' },
            { id: 'yozilish', icon: Calendar, label: 'BOOK' },
            { id: 'savat', icon: ShoppingBag, label: 'CART', count: items.length },
            { id: 'profil', icon: User, label: 'ME' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => { setActiveTab(tab.id); haptic(); }}
              className={`relative h-12 px-5 rounded-[1.25rem] flex items-center gap-2.5 transition-all duration-300 ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-xl shadow-sky-200 min-w-[110px]' : 'text-slate-400 min-w-[54px] justify-center hover:bg-slate-50'}`}
            >
              <tab.icon className={`${activeTab === tab.id ? 'w-4 h-4' : 'w-5 h-5'} transition-all`} />
              {activeTab === tab.id && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] font-black uppercase tracking-[0.15em]">{tab.label}</motion.span>
              )}
              {tab.count && tab.count > 0 && (
                <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-black border-2 border-white shadow-lg ${activeTab === tab.id ? 'bg-white text-sky-500' : 'bg-sky-500 text-white'}`}>
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
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 35, stiffness: 400 }} className="bg-white w-full rounded-t-[3rem] p-8 pb-12 relative z-[110] shadow-2xl border-t border-slate-100 max-w-2xl overflow-hidden">
               <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
               <div className="flex flex-col gap-8 relative z-10">
                  <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl"><img src={selectedProduct.image_url} className="w-full h-full object-cover" /></div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                       <div><p className="text-[9px] font-black text-sky-500 uppercase tracking-[0.4em] mb-1.5">{selectedProduct.brand}</p><h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2></div>
                       <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-lg font-black shadow-xl">{formatValue(selectedProduct.price)} <span className="text-[10px] text-sky-400 ml-1">{getCurrency()}</span></div>
                    </div>
                    <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100/30"><p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Mutaxassis Tavsiyasi</p><p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">{selectedProduct.expert_tip || "Chuqur namlantirish va yoshartirish uchun eng yaxshi yechim."}</p></div>
                    <button onClick={() => { addItem(selectedProduct); setSelectedProduct(null); haptic('heavy'); }} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-transform">SAVATGA QO'SHISH</button>
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
