import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Calendar, 
  User, 
  Search, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  Zap,
  Trash2,
  X,
  Droplets,
  Waves,
  Wind,
  Smile,
  CheckCircle2
} from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { supabase } from './lib/supabase'
import { sendTelegramNotification } from './lib/telegram'
import { useCartStore } from './store'
import { useUIStore } from './hooks/useUIStore'
import { generateClickUrl } from './lib/click'

import BookingSystem from './components/BookingSystem'
import CustomerHistory from './components/CustomerHistory'

export default function ShopApp() {
  const [activeTab, setActiveTab] = useState('katalog')
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Hammasi')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'cash'>('click')
  const [showSuccess, setShowSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)

  
  const categories = ['Hammasi', 'Tozalash', 'Namlantirish', 'Yuz', 'Tana', 'Aksiya']
  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const { t, language, setLanguage } = useUIStore()

  useEffect(() => {
    fetchProducts()
    try {
      WebApp.ready()
      WebApp.expand()
      WebApp.headerColor = '#ffffff'
      WebApp.backgroundColor = '#ffffff'
      if (WebApp.initDataUnsafe.user) {
        setUser(WebApp.initDataUnsafe.user)
      }
    } catch (e) {}
  }, [])



  useEffect(() => {
    filterProducts()
  }, [searchQuery, activeCategory, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      
      if (error) throw error
      setProducts(data || [])
    } catch (e) {
      console.error('Error fetching products:', e)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]
    if (activeCategory !== 'Hammasi') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredProducts(filtered)
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

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    haptic('heavy')
    
    const orderData = {
      user_id: user?.id,
      user_name: user?.username || user?.first_name || 'Guest',
      items: items.map(i => `${i.name} (${i.quantity} dona)`).join(', '),
      total_price: total(),
      status: paymentMethod === 'click' ? 'pending_payment' : 'pending',
      payment_type: paymentMethod
    }

    try {
      const { data, error } = await supabase.from('orders').insert([orderData]).select().single()
      
      if (error) throw error

      await sendTelegramNotification(`🛍 <b>YANGI XARID!</b>\n\n👤 <b>Mijoz:</b> ${orderData.user_name}\n📦 <b>Mahsulotlar:</b> ${orderData.items}\n💰 <b>Jami summa:</b> ${orderData.total_price}\n💳 <b>To'lov usuli:</b> ${orderData.payment_type === 'click' ? 'Click' : 'Naqd pul'}\n\n<i>Mijoz Telegrami:</i> @${user?.username || 'Noma\'lum'}`);

      if (paymentMethod === 'click' && data) {
        const clickUrl = generateClickUrl(total(), data.id.toString())
        try { WebApp.HapticFeedback.notificationOccurred('success') } catch (e) {}
        window.location.href = clickUrl
      } else {
        // Naqd pul uchun maxsus muvaffaqiyat holati
        setShowSuccess(true)
        setActiveTab('katalog')
      }
      
      clearCart()
    } catch (e: any) {
      console.error('Checkout error:', e)
      alert(t('order_error') + ': ' + (e.message || 'Server error'))
    } finally {
      setLoading(false)
    }
  }

  const hero = getHeroData()

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-48 overflow-x-hidden selection:bg-sky-100 font-sans">
      {/* Header - Doktor Guzal Branding */}
      <header className="px-6 py-5 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-3xl z-[45] border-b border-slate-50 transition-all duration-300">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input autoFocus type="text" placeholder={t('search_placeholder')} className="w-full bg-slate-50 py-3 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none border border-slate-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                  
                  {/* Dynamic Glass Content - Pro Integrated Style */}
                  <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end items-start bg-gradient-to-t from-black/80 via-black/10 to-transparent">
                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.2 }}
                       className="max-w-[85%]"
                     >
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-1 h-10 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(0,163,255,0.5)]" />
                           <div>
                              <p className="text-[8px] font-black text-sky-400 uppercase tracking-[0.3em] leading-none mb-1.5 drop-shadow-md">{hero.badge}</p>
                              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{hero.title}</h2>
                           </div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-200/90 uppercase tracking-[0.2em] pl-4 border-l border-white/20 drop-shadow-md">{hero.sub}</p>
                     </motion.div>
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
                      {t(cat as any)}
                    </button>
                  ))}
               </div>
            </div>

            {/* Products Grid */}
            <div className="px-6 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t(activeCategory as any)}</h3>
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
                         {p.description && (
                           <p className="text-[9px] font-medium text-slate-400 mt-2 leading-relaxed line-clamp-2 italic">
                             {p.description}
                           </p>
                         )}
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
            <h2 className="text-2xl font-black text-slate-900">{t('your_cart')}</h2>
            {items.length === 0 ? (
              <div className="py-40 flex flex-col items-center justify-center opacity-20"><ShoppingBag className="w-16 h-16 mb-4" /><p className="font-bold text-[12px] uppercase tracking-widest">{t('cart_empty')}</p></div>
            ) : (
              <div className="space-y-5">
                 {items.map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 flex items-center shadow-sm overflow-hidden gap-3">
                      <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                         <img src={item.image_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <h4 className="font-bold text-[11px] text-slate-800 truncate">{item.name}</h4>
                         <p className="font-black text-[12px] text-sky-500 mt-0.5">{formatValue(item.price)} {getCurrency()}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.2rem] shrink-0">
                         <button onClick={() => { item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id); haptic(); }} className="w-8 h-8 flex items-center justify-center text-slate-400 bg-white rounded-lg shadow-sm border border-slate-50 active:scale-90 transition-transform">
                            {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                         </button>
                         <span className="font-black text-[12px] text-slate-700 w-5 text-center">{item.quantity}</span>
                         <button onClick={() => { addItem(item); haptic(); }} className="w-8 h-8 flex items-center justify-center text-sky-500 bg-white rounded-lg shadow-sm border border-slate-50 active:scale-90 transition-transform">
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
                 <div className="mt-12 p-8 bg-slate-900 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="flex justify-between items-center relative z-10">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t('total_sum')}</span>
                       <span className="text-3xl font-black">{total().toLocaleString('fr-FR')} <span className="text-sm text-sky-400 ml-1">{getCurrency()}</span></span>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{t('payment_method')}</p>
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => { setPaymentMethod('click'); haptic(); }}
                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${paymentMethod === 'click' ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-900/50' : 'bg-slate-800/50 border-slate-700 text-slate-400 opacity-60'}`}
                          >
                             {t('click_payment')}
                          </button>
                          <button 
                            onClick={() => { setPaymentMethod('cash'); haptic(); }}
                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${paymentMethod === 'cash' ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-900/50' : 'bg-slate-800/50 border-slate-700 text-slate-400 opacity-60'}`}
                          >
                             {t('cash')}
                          </button>
                       </div>
                    </div>

                    <button onClick={handleCheckout} className="w-full bg-white text-slate-900 py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-white/5 relative z-10">{t('finish_purchase')}</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <div className="px-6 pt-6 pb-24 space-y-8 animate-in fade-in duration-300">
            <div className="bg-slate-900 p-12 rounded-[3rem] flex flex-col items-center text-center text-white relative overflow-hidden select-none active:scale-[0.98] transition-transform">
               <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/20 blur-3xl" />
               <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-5 shadow-2xl border border-white/20">
                  {user?.photo_url ? <img src={user.photo_url} className="w-full h-full rounded-full object-cover" /> : <User className="w-12 h-12" />}
               </div>
               <h2 className="text-2xl font-black mb-1 text-white">{user?.first_name || t('guest_user')}</h2>
               <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest opacity-80">@{user?.username || 'user'}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{t('language')}</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => { setLanguage('uz'); haptic(); }}
                     className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${language === 'uz' ? 'bg-sky-500 text-white shadow-xl shadow-sky-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                   >
                     🇺🇿 O'zbekcha
                   </button>
                   <button 
                     onClick={() => { setLanguage('ru'); haptic(); }}
                     className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${language === 'ru' ? 'bg-sky-500 text-white shadow-xl shadow-sky-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                   >
                     🇷🇺 Русский
                   </button>
                </div>
             </div>
            
            <CustomerHistory user={user} />


          </div>
        )}
      </main>

      {/* Navigation - Pro Luxe Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-[50] bg-white/95 backdrop-blur-3xl border-t border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-md mx-auto px-8 h-22 flex justify-between items-center">
          {[
            { id: 'katalog', icon: ShoppingBag, label: t('shop') },
            { id: 'yozilish', icon: Calendar, label: t('book') },
            { id: 'savat', icon: ShoppingBag, label: t('cart'), count: items.length },
            { id: 'profil', icon: User, label: t('me') }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => { setActiveTab(tab.id); haptic(); }}
              className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-16 group active:scale-90`}
            >
              <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-xl shadow-sky-200' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
                <tab.icon className="w-5.5 h-5.5" />
                {tab.count && tab.count > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-black border-2 border-white shadow-lg ${activeTab === tab.id ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === tab.id ? 'text-sky-500' : 'text-slate-300 group-hover:text-sky-400'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-sky-500 rounded-full" />
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
                              <div className="p-6 bg-sky-50/50 rounded-[2rem] border border-sky-100/30"><p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-2.5 flex items-center gap-2.5"><ShieldCheck className="w-5 h-5" /> {language === 'uz' ? 'Mutaxassis Tavsiyasi' : 'Совет эксперта'}</p><p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">{selectedProduct.expert_tip || (language === 'uz' ? "Chuqur namlantirish va terini professional parvarish qilish uchun eng yaxshi tanlov." : "Лучший выбор для глубокого увлажнения и профессионального ухода за кожей.")}</p></div>
                    <button 
                      onClick={() => { 
                        addItem(selectedProduct); 
                        setSelectedProduct(null); 
                        haptic('heavy'); 
                      }} 
                      className="w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_25px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-transform bg-slate-900 text-white"
                    >
                      {t('add_to_cart')}
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-2xl flex items-center justify-center p-8"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
               className="w-full max-w-sm bg-white rounded-[4rem] p-10 shadow-2xl border border-slate-50 flex flex-col items-center text-center relative overflow-hidden"
             >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500" />
                
                <div className="w-24 h-24 bg-sky-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-sky-500/20 rounded-[2.5rem] animate-ping" />
                   <CheckCircle2 className="w-12 h-12 text-sky-500 relative z-10" />
                </div>

                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-none">
                  {t('order_success')}
                </h3>
                
                <div className="w-12 h-1 bg-slate-100 rounded-full mb-6" />
                
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed mb-10 max-w-[200px]">
                   Tez orada operator <span className="text-sky-500">aloqaga chiqadi</span>
                </p>

                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 active:scale-95 transition-all"
                >
                  Tushunarli
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
