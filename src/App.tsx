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
  X,
  Droplets,
  Waves,
  Stethoscope,
  Wind,
  Smile,
  ZapOff
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

  // Dynamic Hero Data
  const getHeroData = () => {
    switch (activeCategory) {
      case 'Tozalash':
        return {
          title: 'Deep Clean',
          sub: 'Tiniq va sog\'lom teri siri',
          img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-blue-900/20',
          badge: 'Professional Karov 2026',
          icon: Waves
        }
      case 'Namlantirish':
        return {
          title: 'Aqua Luxe',
          sub: 'Chuqur namlantirish kompleksi',
          img: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-emerald-900/20',
          badge: 'Nature First',
          icon: Droplets
        }
      case 'Yuz':
        return {
          title: 'Facial Pro',
          sub: 'Yuz terisi uchun maxsus parvarish',
          img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-rose-900/20',
          badge: 'Expert Care',
          icon: Smile
        }
      case 'Tana':
        return {
          title: 'Body Spa',
          sub: 'Tana uchun dam olish va parvarish',
          img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-amber-900/20',
          badge: 'Relax Season',
          icon: Wind
        }
      case 'Aksiya':
        return {
          title: 'Gift Box',
          sub: 'Maxsus sovg\'alar va chegirmalar',
          img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-purple-900/20',
          badge: 'Limited Offer',
          icon: Zap
        }
      default:
        return {
          title: 'Yozgi Nafas',
          sub: 'Professional Karov 2026',
          img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1500',
          color: 'bg-sky-900/20',
          badge: 'Yangi Mavsum',
          icon: Waves
        }
    }
  }

  const hero = getHeroData()

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-36 overflow-x-hidden selection:bg-sky-100 font-sans">
      {/* Header - Doktor Guzal Branding */}
      <header className="px-6 py-5 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-3xl z-[45] border-b border-slate-50 transition-all duration-300">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input autoFocus type="text" placeholder="Qidirish..." className="w-full bg-slate-50 py-3 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none border border-slate-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-6 h-6" /></button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex justify-between items-center">
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2 uppercase">
                  Doktor Guzal <Sparkles className="w-5 h-5 text-sky-400" />
                </h1>
                <p className="text-[7px] font-bold text-sky-400 uppercase tracking-[0.3em] mt-0.5">Professional Cosmetology</p>
              </div>
              <button onClick={() => setIsSearchOpen(true)} className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-100 text-sky-500 active:scale-90 transition-transform"><Search className="w-6 h-6" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* TAB 1: KATALOG */}
        {activeTab === 'katalog' && (
          <div className="space-y-8">
            {/* DYNAMIC HERO BANNER */}
            <div className="px-6 pt-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-64 w-full rounded-[3.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200 border-[6px] border-white group"
                >
                  <img 
                    src={hero.img} 
                    alt={hero.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[15s] ease-out" 
                  />
                  
                  {/* Dynamic Glass Content */}
                  <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end bg-gradient-to-t from-slate-900/40 via-transparent to-transparent">
                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.2 }}
                       className="max-w-[280px] bg-white/20 backdrop-blur-3xl p-7 rounded-[3rem] border border-white/30 shadow-2xl"
                     >
                        <div className="flex items-center gap-2.5 mb-3">
                           <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                              <hero.icon className="w-4 h-4 text-white" />
                           </div>
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-md">
                              {hero.badge}
                           </p>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2 drop-shadow-xl">{hero.title}</h2>
                        <p className="text-[9px] font-bold text-sky-50 opacity-90 uppercase tracking-widest drop-shadow-md">{hero.sub}</p>
                     </motion.div>
                  </div>

                  {/* Floating Aesthetic Element */}
                  <div className="absolute top-10 right-10 z-20">
                     <div className="bg-white/40 backdrop-blur-2xl p-5 rounded-full shadow-2xl border border-white/40 active:scale-90 transition-transform cursor-pointer">
                        <hero.icon className="w-7 h-7 text-white animate-pulse" />
                     </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div className="overflow-x-auto no-scrollbar px-6">
               <div className="flex gap-3 pb-2">
                  {categories.map((cat) => (
                    <button 
                      key={cat} onClick={() => { setActiveCategory(cat); haptic(); }} 
                      className={`whitespace-nowrap px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-sky-500 text-white shadow-2xl shadow-sky-100 scale-105' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-sky-50 hover:border-sky-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {/* Products Grid */}
            <div className="px-6 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{activeCategory}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {loading ? [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2.5rem] animate-pulse" />) : filteredProducts.map((p) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.97 }} 
                    key={p.id} onClick={() => { setSelectedProduct(p); haptic(); }} 
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm hover:shadow-2xl transition-all flex flex-col group relative overflow-hidden"
                  >
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4 relative">
                       <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="px-1 flex-1 flex flex-col justify-between pb-1">
                       <div>
                         <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-1.5">{p.brand}</p>
                         <h4 className="font-bold text-[13px] leading-tight text-slate-700 line-clamp-1">{p.name}</h4>
                       </div>
                       <div className="flex justify-between items-center mt-5">
                          <span className="text-sm font-black text-slate-900">{formatValue(p.price)} <span className="text-[9px] text-slate-300 font-bold ml-0.5">{getCurrency()}</span></span>
                          <div className="w-8 h-8 rounded-2xl bg-sky-500 text-white flex items-center justify-center active:scale-90 transition-transform shadow-xl shadow-sky-100">
                            <Plus className="w-5 h-5" />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: YOZILISH */}
        {activeTab === 'yozilish' && <BookingSystem />}

        {/* TAB 3: SAVAT */}
        {activeTab === 'savat' && (
          <div className="px-6 pt-6 space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-900">Mening Savatim</h2>
            {items.length === 0 ? (
              <div className="py-40 flex flex-col items-center justify-center opacity-20"><ShoppingBag className="w-16 h-16 mb-4" /><p className="font-bold text-[12px] uppercase tracking-widest">Bo'sh</p></div>
            ) : (
              <div className="space-y-5">
                 {items.map(item => (
                   <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="flex gap-5">
                         <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-50 shrink-0 border border-slate-50"><img src={item.image_url} className="w-full h-full object-cover" /></div>
                         <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-[12px] text-slate-800 line-clamp-1">{item.name}</h4>
                            <p className="font-black text-[14px] text-sky-500 mt-1">{formatValue(item.price)} {getCurrency()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-[1.5rem]">
                         <button onClick={() => { item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id); haptic(); }} className="w-10 h-10 flex items-center justify-center text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">{item.quantity === 1 ? <Trash2 className="w-5 h-5 text-red-400" /> : <Minus className="w-5 h-5" />}</button>
                         <span className="font-black text-sm text-slate-700 w-8 text-center">{item.quantity}</span>
                         <button onClick={() => { addItem(item); haptic(); }} className="w-10 h-10 flex items-center justify-center text-sky-500 bg-white rounded-xl shadow-sm border border-slate-100"><Plus className="w-5 h-5" /></button>
                      </div>
                   </div>
                 ))}
                 <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center"><span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Jami Summa:</span><span className="text-3xl font-black">{total().toLocaleString('fr-FR')} <span className="text-sm text-sky-400 ml-1">{getCurrency()}</span></span></div>
                    <button onClick={() => { haptic('heavy'); alert('Tez orada...'); }} className="w-full bg-white text-slate-900 py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] active:scale-95 transition-transform">XARIDNI YAKUNLASH</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <div className="px-6 pt-6 space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 p-12 rounded-[3rem] flex flex-col items-center text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/20 blur-3xl" />
               <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-sky-500 mb-5 shadow-2xl"><User className="w-12 h-12" /></div>
               <h2 className="text-2xl font-black mb-1 text-white">Gost User</h2>
               <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest opacity-80">Premium Member</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {[{ icon: ShieldCheck, title: "Xavfsizlik", desc: "PIN-kod va biometriya" }, { icon: Clock, title: "Tarix", desc: "Barcha xaridlar" }].map((it, i) => (
                 <button key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-all shadow-sm hover:border-sky-100"><div className="flex items-center gap-6 text-left"><div className="w-12 h-12 rounded-[1rem] bg-sky-50 flex items-center justify-center text-sky-500"><it.icon className="w-6 h-6" /></div><div><p className="font-black text-sm text-slate-800">{it.title}</p><p className="text-[10px] font-medium text-slate-400">{it.desc}</p></div></div><ChevronRight className="w-5 h-5 text-slate-200" /></button>
               ))}
               <button onClick={() => { setShowAdmin(true); haptic('medium'); }} className="mt-6 w-full bg-sky-500 text-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-2xl shadow-sky-100 active:scale-95 transition-transform"><div className="flex items-center gap-6"><Sparkles className="w-7 h-7 text-white" /><span className="font-black text-sm uppercase tracking-widest text-left">Admin Panel</span></div><ArrowRight className="w-6 h-6" /></button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation - Ultra Luxe Pill */}
      <nav className="fixed bottom-10 inset-x-8 z-[50] flex justify-center">
        <div className="bg-white/80 backdrop-blur-3xl border border-slate-100 p-2.5 rounded-[2.5rem] flex gap-3 shadow-[0_30px_70px_rgba(0,163,255,0.22)]">
          {[
            { id: 'katalog', icon: ShoppingBag, label: 'SHOP' },
            { id: 'yozilish', icon: Calendar, label: 'BOOK' },
            { id: 'savat', icon: ShoppingBag, label: 'CART', count: items.length },
            { id: 'profil', icon: User, label: 'ME' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => { setActiveTab(tab.id); haptic(); }}
              className={`relative h-14 px-6 rounded-[1.75rem] flex items-center gap-3 transition-all duration-300 ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-2xl shadow-sky-200 min-w-[130px]' : 'bg-slate-100/50 text-slate-500 min-w-[64px] justify-center hover:bg-sky-50 hover:text-sky-500 border border-transparent hover:border-sky-100'}`}
            >
              <tab.icon className={`${activeTab === tab.id ? 'w-5 h-5' : 'w-6 h-6'} transition-all`} />
              {activeTab === tab.id && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</motion.span>
              )}
              {tab.count && tab.count > 0 && (
                <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full text-[9px] flex items-center justify-center font-black border-2 border-white shadow-xl ${activeTab === tab.id ? 'bg-white text-sky-500' : 'bg-sky-500 text-white'}`}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 35, stiffness: 400 }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 relative z-[110] shadow-2xl border-t border-slate-100 max-w-3xl overflow-hidden">
               <div className="w-16 h-2 bg-slate-100 rounded-full mx-auto mb-10" />
               <div className="flex flex-col gap-10 relative z-10">
                  <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl"><img src={selectedProduct.image_url} className="w-full h-full object-cover" /></div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <div><p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em] mb-2">{selectedProduct.brand}</p><h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2></div>
                       <div className="bg-slate-900 text-white px-6 py-3 rounded-[1.5rem] text-xl font-black shadow-2xl">{formatValue(selectedProduct.price)} <span className="text-xs text-sky-400 ml-1">{getCurrency()}</span></div>
                    </div>
                    <div className="p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100/30"><p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-2.5 flex items-center gap-2.5"><ShieldCheck className="w-5 h-5" /> Mutaxassis Tavsiyasi</p><p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">{selectedProduct.expert_tip || "Chuqur namlantirish va terini professional parvarish qilish uchun eng yaxshi tanlov."}</p></div>
                    <button 
                      onClick={() => { 
                        addItem(selectedProduct); 
                        setSelectedProduct(null); 
                        haptic('heavy'); 
                      }} 
                      className="w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_25px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-transform bg-slate-900 text-white"
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
