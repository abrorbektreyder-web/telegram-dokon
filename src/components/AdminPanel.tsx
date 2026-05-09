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
      {/* Header - Compact */}
      <div className="p-4 pt-6 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          Admin <Sparkles className="w-4 h-4 text-sky-500" />
        </h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full bg-sky-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] shadow-lg shadow-sky-50 uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> QO'SHISH
        </button>

        <div className="space-y-2">
           {products.map((p: any) => (
             <div key={p.id} className="bg-white p-3 rounded-2xl border border-slate-50 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-3">
                 <img src={p.image_url} className="w-10 h-10 rounded-xl object-cover bg-slate-50" />
                 <div>
                   <h4 className="font-bold text-[10px] text-slate-700 line-clamp-1">{p.name}</h4>
                   <p className="text-[9px] font-black text-sky-500 mt-0.5">{p.price} ₸</p>
                 </div>
               </div>
               <button onClick={() => { if(confirm('O\'chirilsinmi?')) supabase.from('products').delete().eq('id', p.id).then(() => onRefresh()) }} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center active:scale-90">
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
             </div>
           ))}
        </div>
      </div>

      {/* FORM - IXCHAM VA TEPADA */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddForm(false)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative z-[90] border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-base text-slate-900">Yangi Mahsulot</h3>
                <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                  <button onClick={() => setUseUrl(false)} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${!useUrl ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'}`}>Fayl</button>
                  <button onClick={() => setUseUrl(true)} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${useUrl ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'}`}>URL</button>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div className="h-28 w-full rounded-2xl bg-slate-50 border-2 border-dashed border-sky-100 overflow-hidden flex items-center justify-center relative transition-colors hover:bg-sky-50">
                  {previewUrl ? (
                    <img src={previewUrl} className="h-full w-full object-contain p-2" />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-6 h-6 text-sky-300" />
                      <span className="text-[8px] font-black text-sky-300 mt-1 uppercase tracking-widest">Rasm</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="Nomi" required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-bold text-[10px] outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Brend" required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-bold text-[10px] outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                    <input type="text" placeholder="Narxi" required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-black text-[10px] text-sky-500 outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>

                  <textarea placeholder="Mutaxassis tavsiyasi..." className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-medium text-[9px] italic h-16 outline-none" value={newProduct.expert_tip} onChange={e => setNewProduct({...newProduct, expert_tip: e.target.value})} />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-[8px] font-black text-slate-300 uppercase tracking-widest">Bekor</button>
                  <button disabled={loading || uploading} className="flex-[2] bg-sky-500 text-white py-3 rounded-xl font-black text-[10px] shadow-lg shadow-sky-50 uppercase tracking-widest">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'SAQLASH'}
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
