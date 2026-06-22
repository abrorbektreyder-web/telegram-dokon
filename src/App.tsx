import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShopApp from './ShopApp'
import AdminPanel from './components/AdminPanel'
import { supabase } from './lib/supabase'
import WebApp from '@twa-dev/sdk'

function AdminRoute() {
  const [products, setProducts] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('name')
      if (data) setProducts(data)
    } catch (e) { console.error(e) }
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center mb-6">
             <h2 className="text-2xl font-black text-sky-500">PRO</h2>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-widest">Admin Panel</h3>
          <input 
            type="password" 
            placeholder="PIN kodni kiriting" 
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-center tracking-widest text-lg outline-none mb-4"
          />
          <button 
            onClick={() => {
              if (pin === '2026') setIsAuthenticated(true)
              else alert('PIN kod xato!')
            }}
            className="w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-sky-100 active:scale-95 transition-transform"
          >
            Kirish
          </button>
          <button 
            onClick={() => WebApp.close()}
            className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"
          >
            Chiqish
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel 
    onClose={() => WebApp.close()} 
    products={products} 
    onRefresh={fetchProducts} 
  />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopApp />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
