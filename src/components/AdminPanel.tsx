import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Calendar, ChevronRight, CheckCircle2, Loader2, Clock, DollarSign, Edit2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import WebApp from '@twa-dev/sdk'
import { useUIStore } from '../hooks/useUIStore'

interface AdminPanelProps {
  onClose: () => void
  products: any[]
  onRefresh: () => void
}

export default function AdminPanel({ onClose, products = [], onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'bookings'>('products')
  const [bookings, setBookings] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { t } = useUIStore()

  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    brand: '', 
    price: '', 
    image_url: '', 
    description: '',
    stock_quantity: 10 
  })

  const [editingService, setEditingService] = useState<any>(null)
  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: ''
  })

  useEffect(() => {
    fetchBookings()
    fetchServices()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
      if (!error && data) setBookings(data)
    } catch (e) { 
      console.error('Fetch bookings error:', e) 
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('name')
      if (!error && data) setServices(data)
    } catch (e) {
      console.error('Fetch services error:', e)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        alert('Rasm hajmi juda katta (maksimum 2MB)')
        return
      }

      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        setNewProduct(prev => ({ ...prev, image_url: urlData.publicUrl }))
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Xatolik: ${error.message}`)
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Nom va narx majburiy!')
      return
    }

    setUploading(true)
    try {
      const productData = {
        name: newProduct.name,
        brand: newProduct.brand || 'Doktor Guzal',
        description: newProduct.description,
        price: parseInt(newProduct.price.toString()),
        image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        stock_quantity: newProduct.stock_quantity || 10,
        category: 'Boshqa'
      }

      const { error } = await supabase.from('products').insert([productData])

      if (error) throw error

      setShowAddForm(false)
      setShowSuccess(true)
      setNewProduct({ name: '', brand: '', price: '', image_url: '', description: '', stock_quantity: 10 })
      onRefresh()
      
      try {
        WebApp.HapticFeedback.notificationOccurred('success')
      } catch (e) {}
      setTimeout(() => setShowSuccess(false), 3500)
    } catch (e: any) { 
      alert(`Saqlashda xatolik: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert('Nom va narx majburiy!')
      return
    }

    setUploading(true)
    try {
      const serviceData = {
        name: newService.name,
        duration: newService.duration || '60 min',
        price: parseInt(newService.price.toString())
      }

      let error;
      if (editingService) {
        const { error: updateError } = await supabase.from('services').update(serviceData).eq('id', editingService.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase.from('services').insert([serviceData])
        error = insertError
      }

      if (error) throw error

      setShowServiceForm(false)
      setEditingService(null)
      setShowSuccess(true)
      setNewService({ name: '', duration: '', price: '' })
      fetchServices()
      
      try {
        WebApp.HapticFeedback.notificationOccurred('success')
      } catch (e) {}
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (e: any) {
      alert(`Xatolik: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const deleteBooking = async (id: number) => {
    if (!confirm('O\'chirilsinmi?')) return
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id)
      if (!error) fetchBookings()
    } catch (e) { console.error(e) }
  }

  const markBookingCompleted = async (id: number) => {
    if (!confirm('Ushbu bronni bajarilgan deb belgilaysizmi?')) return
    try {
      const { error } = await supabase.from('bookings').update({ status: 'completed' }).eq('id', id)
      if (!error) {
        fetchBookings()
        setSelectedBooking(null)
      }
    } catch (e) { console.error(e) }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('O\'chirilsinmi?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) onRefresh()
    } catch (e) { console.error(e) }
  }

  const deleteService = async (id: number) => {
    if (!confirm('Ushbu xizmatni o\'chirishni xohlaysizmi?')) return
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (!error) fetchServices()
    } catch (e) { console.error(e) }
  }

  const startEditService = (service: any) => {
    setEditingService(service)
    setNewService({
      name: service.name,
      duration: service.duration,
      price: service.price.toString()
    })
    setShowServiceForm(true)
  }

  const productList = Array.isArray(products) ? products : []
  const bookingList = Array.isArray(bookings) ? bookings : []
  const serviceList = Array.isArray(services) ? services : []

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-hidden flex flex-col">
      <div className="px-6 pt-12 pb-5 border-b border-slate-50 flex justify-between items-center bg-white/90 backdrop-blur-xl shrink-0 sticky top-0 z-50">
        <button onClick={onClose} className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-[2rem] active:scale-95 transition-transform shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
           <ChevronRight className="w-5 h-5 rotate-180" />
           <span className="text-[10px] font-black uppercase tracking-widest">{t('back')}</span>
        </button>
        <div className="flex items-center gap-3">
           <h2 className="text-xl font-black text-slate-900 italic tracking-tighter">Admin<span className="text-sky-500">PRO</span></h2>
        </div>
      </div>

      <div className="flex p-2 bg-slate-50/50 m-6 rounded-[2.5rem] border border-slate-100 shrink-0">
        <button onClick={() => setActiveTab('products')} className={`flex-1 py-4 rounded-[2.1rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-sky-500 text-white shadow-xl shadow-sky-100' : 'text-slate-400'}`}>
          {t('manage_products')}
        </button>
        <button onClick={() => setActiveTab('services')} className={`flex-1 py-4 rounded-[2.1rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-sky-500 text-white shadow-xl shadow-sky-100' : 'text-slate-400'}`}>
          {t('manage_services')}
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-4 rounded-[2.1rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'bookings' ? 'bg-sky-500 text-white shadow-xl shadow-sky-100' : 'text-slate-400'}`}>
          {bookingList.length > 0 && <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[7px]">{bookingList.length}</span>}
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {activeTab === 'products' ? (
          <div className="space-y-4">
             {productList.map(p => (
               <div key={p.id} className="p-5 bg-white rounded-[2rem] border border-slate-50 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden shadow-inner">
                        <img src={p.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200'} className="w-full h-full object-cover" />
                     </div>
                     <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
                        <p className="text-[10px] font-black text-sky-500 mt-0.5">{p.price?.toLocaleString()} so'm</p>
                     </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             ))}
          </div>
        ) : activeTab === 'services' ? (
          <div className="space-y-4">
            {serviceList.length === 0 ? (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                     <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Xizmatlar yo'q</p>
               </div>
            ) : (
              serviceList.map(s => (
                <div key={s.id} className="p-5 bg-white rounded-[2rem] border border-slate-50 shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                         <Clock className="w-6 h-6" />
                      </div>
                      <div className="overflow-hidden">
                         <p className="font-bold text-slate-800 text-sm truncate">{s.name}</p>
                         <p className="text-[10px] font-black text-slate-400 mt-0.5 uppercase tracking-tighter">{s.duration} • <span className="text-sky-500">{s.price?.toLocaleString()} so'm</span></p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => startEditService(s)} className="p-3 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteService(s.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
             {bookingList.length === 0 ? (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                     <Calendar className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Bronlar yo'q</p>
               </div>
             ) : bookingList.map(b => (
               <div key={b.id} className={`p-6 bg-white rounded-[2.5rem] border ${b.status === 'completed' ? 'border-emerald-100 opacity-60' : 'border-slate-100'} shadow-sm group`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full inline-block truncate max-w-full">{b.service_name}</span>
                        {b.status === 'completed' && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3 inline mr-1" />Bajarildi</span>}
                      </div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight truncate">{b.client_name}</h4>
                    </div>
                    <div className="flex gap-2 shrink-0">
                       <button onClick={() => setSelectedBooking(b)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-sky-50 hover:text-sky-500 transition-all"><ChevronRight className="w-4 h-4" /></button>
                       <button onClick={() => deleteBooking(b.id)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-hidden">
                        <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Vaqt</p>
                        <p className="font-bold text-slate-700 text-[10px] truncate">{b.booking_date} • {b.booking_time}</p>
                     </div>
                     <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-hidden">
                        <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Tel</p>
                        <p className="font-bold text-slate-700 text-[10px] truncate">{b.client_phone}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md">
         {activeTab === 'products' ? (
           <button onClick={() => setShowAddForm(true)} className="w-full py-6 bg-sky-500 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-sky-100 flex items-center justify-center gap-3 active:scale-95 transition-transform">
              <Plus className="w-5 h-5" /> {t('manage_products')}
           </button>
         ) : activeTab === 'services' ? (
           <button onClick={() => { setEditingService(null); setNewService({ name: '', duration: '', price: '' }); setShowServiceForm(true); }} className="w-full py-6 bg-sky-500 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-sky-100 flex items-center justify-center gap-3 active:scale-95 transition-transform">
              <Plus className="w-5 h-5" /> {t('add_service')}
           </button>
         ) : null}
      </div>

      <AnimatePresence mode="wait">
        {selectedBooking && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-4 h-4 text-slate-400" /></button>
                <div className="space-y-6 pt-4">
                   <div className="space-y-1"><p className="text-[10px] font-black text-sky-500 uppercase">Mijoz</p><p className="text-xl font-black text-slate-900">{selectedBooking?.client_name}</p></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[10px] font-black text-slate-300 uppercase">Telefon</p><p className="font-bold text-slate-700">{selectedBooking?.client_phone}</p></div>
                      <div><p className="text-[10px] font-black text-slate-300 uppercase">Sana</p><p className="font-bold text-slate-700">{selectedBooking?.booking_date}</p></div>
                   </div>
                   <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100"><p className="text-[10px] font-black text-sky-400 uppercase mb-1">Xizmat</p><p className="font-bold text-sky-600">{selectedBooking?.service_name}</p></div>
                   {selectedBooking?.client_note && <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black text-slate-300 uppercase mb-1">Izoh</p><p className="text-sm font-medium text-slate-500 italic">"{selectedBooking?.client_note}"</p></div>}
                </div>
                <div className="flex gap-3 mt-8">
                   {selectedBooking?.status !== 'completed' && (
                     <button onClick={() => markBookingCompleted(selectedBooking.id)} className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                       <CheckCircle2 className="w-4 h-4" /> Bajarildi
                     </button>
                   )}
                   <button onClick={() => setSelectedBooking(null)} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">YOPISH</button>
                </div>
             </motion.div>
          </motion.div>
        )}

        {showAddForm && (
          <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Yangi <span className="text-sky-500">Mahsulot</span></h3>
                   <button onClick={() => setShowAddForm(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 no-scrollbar">
                   <input placeholder="Nom" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newProduct.name} onChange={e => setNewProduct(prev => ({...prev, name: e.target.value}))} />
                   <input placeholder="Brend" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newProduct.brand} onChange={e => setNewProduct(prev => ({...prev, brand: e.target.value}))} />
                   <input type="number" placeholder="Narx" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newProduct.price} onChange={e => setNewProduct(prev => ({...prev, price: e.target.value}))} />
                   <textarea placeholder="Izoh" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border border-slate-100 h-24 resize-none" value={newProduct.description} onChange={e => setNewProduct(prev => ({...prev, description: e.target.value}))} />
                   <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-sky-50 transition-all">
                      {newProduct.image_url ? <img src={newProduct.image_url} className="h-full w-full object-cover rounded-2xl" /> : uploading ? <Loader2 className="animate-spin text-sky-500" /> : <><Plus className="text-slate-300" /><span className="text-[10px] text-slate-400 uppercase font-black mt-2">Rasm yuklash</span></>}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                   </label>
                </div>
                <button onClick={handleAddProduct} disabled={uploading} className="w-full mt-6 py-6 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-2">
                   {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                   {uploading ? 'Saqlanmoqda...' : t('save')}
                </button>
             </motion.div>
          </motion.div>
        )}

        {showServiceForm && (
          <motion.div key="service" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">{editingService ? t('edit') : t('add_service')}</h3>
                   <button onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="p-2 bg-slate-50 rounded-full"><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                   <div className="relative">
                      <Edit2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input placeholder={t('service_name')} className="w-full bg-slate-50 p-5 pl-12 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newService.name} onChange={e => setNewService(prev => ({...prev, name: e.target.value}))} />
                   </div>
                   <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input placeholder={t('duration')} className="w-full bg-slate-50 p-5 pl-12 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newService.duration} onChange={e => setNewService(prev => ({...prev, duration: e.target.value}))} />
                   </div>
                   <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="number" placeholder={t('price')} className="w-full bg-slate-50 p-5 pl-12 rounded-2xl font-bold text-sm outline-none border border-slate-100" value={newService.price} onChange={e => setNewService(prev => ({...prev, price: e.target.value}))} />
                   </div>
                </div>
                <button onClick={handleAddService} disabled={uploading} className="w-full mt-8 py-6 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                   {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                   {uploading ? 'Saqlanmoqda...' : t('save')}
                </button>
             </motion.div>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-8">
             <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }} className="bg-white w-full max-w-sm rounded-[4rem] p-10 flex flex-col items-center text-center shadow-2xl relative">
                <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-sky-200"><CheckCircle2 className="w-10 h-10 text-white" /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Muvaffaqiyat!</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">Ma'lumotlar yangilandi</p>
                <button onClick={() => setShowSuccess(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">TUSHUNARLI</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
