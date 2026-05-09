import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Edit, Save, Upload, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminPanel({ products, onClose, onRefresh }: any) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [useUrl, setUseUrl] = useState(false)
  
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', price: '', category: 'Tozalash', description: '', expert_tip: '', image_url: '', is_top: false
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const { error: uploadError } = await supabase.storage.from('produckt-images').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('produckt-images').getPublicUrl(fileName)
      setNewProduct(prev => ({ ...prev, image_url: publicUrl }))
      setPreviewUrl(publicUrl)
    } catch (error: any) {
      alert('Rasm yuklashda xatolik: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalImageUrl = useUrl ? newProduct.image_url : previewUrl;
    if (!finalImageUrl) return alert('Iltimos, rasm yuklang!');
    setLoading(true)
    try {
      const { error } = await supabase.from('products').insert([{ ...newProduct, image_url: finalImageUrl }])
      if (error) alert('Xatolik: ' + error.message)
      else {
        onRefresh(); setShowAddForm(false); setPreviewUrl(null);
        setNewProduct({ name: '', brand: '', price: '', category: 'Tozalash', description: '', expert_tip: '', image_url: '', is_top: false })
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-50 overflow-hidden flex flex-col">
      {/* Header - Light */}
      <div className="p-5 pt-8 flex justify-between items-center bg-white border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Dashboard <Sparkles className="w-5 h-5 text-sky-500" />
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-40 space-y-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full bg-sky-500 text-white p-5 rounded-[2.5rem] flex items-center justify-center gap-3 font-black text-sm shadow-xl shadow-sky-100 uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> YANGI MAHSULOT QO'SHISH
        </button>

        <div className="space-y-3">
           {products.map((p: any) => (
             <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                 <img src={p.image_url} className="w-14 h-14 rounded-2xl object-cover bg-slate-50" />
                 <div>
                   <h4 className="font-bold text-xs text-slate-700 leading-tight">{p.name}</h4>
                   <p className="text-[10px] font-black text-sky-500 mt-1">{p.price} ₸</p>
                 </div>
               </div>
               <button onClick={() => { if(confirm('O\'chirilsinmi?')) supabase.from('products').delete().eq('id', p.id).then(() => onRefresh()) }} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition-transform">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           ))}
        </div>
      </div>

      {/* ADD FORM - TEPADA VA OQ RANGLI */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddForm(false)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-[90] border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-slate-900">Yangi Mahsulot</h3>
                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                  <button onClick={() => setUseUrl(false)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${!useUrl ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400'}`}>Fayl</button>
                  <button onClick={() => setUseUrl(true)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${useUrl ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400'}`}>URL</button>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="h-40 w-full rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-sky-100 overflow-hidden flex items-center justify-center relative group transition-colors hover:bg-sky-50">
                  {previewUrl ? (
                    <img src={previewUrl} className="h-full w-full object-contain p-4" />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-sky-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black text-sky-300 mt-2 uppercase tracking-widest">Rasm yuklang</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                </div>

                <div className="space-y-4">
                  <input type="text" placeholder="Mahsulot nomi" required className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-bold text-xs outline-none focus:bg-white focus:border-sky-300 transition-all" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Brend" required className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-bold text-xs outline-none focus:bg-white focus:border-sky-300 transition-all" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                    <input type="text" placeholder="Narxi" required className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-black text-xs text-sky-500 outline-none focus:bg-white focus:border-sky-300 transition-all" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>

                  <textarea placeholder="Mutaxassis tavsiyasi..." className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 font-medium text-xs italic h-24 outline-none focus:bg-white focus:border-sky-300 transition-all" value={newProduct.expert_tip} onChange={e => setNewProduct({...newProduct, expert_tip: e.target.value})} />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-400">Bekor</button>
                  <button disabled={loading || uploading} className="flex-[2] bg-sky-500 text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl shadow-sky-100 uppercase tracking-widest">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'SAQLASH'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
