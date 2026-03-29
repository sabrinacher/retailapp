"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Menu, X, Target, BarChart3, TrendingUp, Plus, Share2, Check } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TKDemoDay() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ventes, setVentes] = useState<any[]>([])
  const [montant, setMontant] = useState("")
  const [vendeur, setVendeur] = useState("")
  
  const targetJour = 2500

  // 1. REFRESH DATA
  const fetchData = async () => {
    const { data } = await supabase.from('ventes_retail').select('*').order('created_at', { ascending: false })
    if (data) setVentes(data)
  }

  useEffect(() => { fetchData() }, [])

  // 2. AJOUTER VENTE (L'effet Waouh pour le manager)
  const handleAddSale = async (e: any) => {
    e.preventDefault()
    if(!montant || !vendeur) return
    const { error } = await supabase.from('ventes_retail').insert([{ vendeur_nom: vendeur, montant: parseInt(montant), enseigne: 'The Kooples' }])
    if(!error) {
      setMontant(""); setIsModalOpen(false); fetchData();
    }
  }

  // 3. GENERER LE RAPPORT (Ton argument de vente)
  const generateReport = () => {
    const texte = `📈 TK REPORT - ${new Date().toLocaleDateString()}\n---\n💰 TOTAL CA: ${caJour}€\n🎯 OBJ: ${targetJour}€ (${((caJour/targetJour)*100).toFixed(0)}%)\n🏆 TOP: ${ventes[0]?.vendeur_nom || 'N/A'}\n---\nEnvoyé via RetailTrack 🚀`;
    navigator.clipboard.writeText(texte);
    alert("Rapport copié ! Prêt à être collé sur WhatsApp.");
  }

  const caJour = ventes.reduce((acc, v) => acc + v.montant, 0)
  const progression = (caJour / targetJour) * 100

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* --- MODAL AJOUT VENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 p-8 rounded-[3rem]">
            <div className="flex justify-between items-center mb-8">
               <h2 className="font-black uppercase tracking-widest italic">New Sale</h2>
               <button onClick={() => setIsModalOpen(false)}><X/></button>
            </div>
            <form onSubmit={handleAddSale} className="space-y-6">
              <input type="text" placeholder="Vendeur" className="w-full bg-transparent border-b border-white/10 p-4 outline-none focus:border-white font-bold" value={vendeur} onChange={e => setVendeur(e.target.value)} />
              <input type="number" placeholder="Montant €" className="w-full bg-transparent border-b border-white/10 p-4 outline-none focus:border-white text-4xl font-black" value={montant} onChange={e => setMontant(e.target.value)} />
              <button className="w-full bg-white text-black p-5 rounded-2xl font-black uppercase tracking-widest text-xs">Confirm Sale</button>
            </form>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-0 bg-black/80 z-50 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-[280px] bg-[#0A0A0A] h-full p-10 border-r border-white/5 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsSidebarOpen(false)} className="mb-12"><X/></button>
          <nav className="space-y-8">
            <button onClick={generateReport} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-indigo-400">
               <Share2 size={18}/> Copy EOD Report
            </button>
            <div className="h-px bg-white/5 w-full"></div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Coming Soon</p>
            <button className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-700 cursor-not-allowed"><Target size={18}/> Personal Target</button>
          </nav>
        </div>
      </div>

      <div className="p-6 pt-10 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Menu size={24}/></button>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 text-center">My Retail Track</p>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold">TK</div>
        </div>

        {/* LOGO */}
        <div className="text-center mb-20 scale-90 md:scale-100">
          <h1 className="font-serif text-5xl md:text-7xl font-black uppercase tracking-tight italic">The Kooples</h1>
          <p className="text-[9px] tracking-[0.8em] text-gray-500 mt-4 uppercase font-bold">Management Tool</p>
        </div>

        {/* CARROUSEL CA */}
        <div className="mb-24">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={50} slidesPerView={1} className="pb-12">
            <SwiperSlide>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-500 mb-6">Today's Revenue</p>
                <p className="text-8xl md:text-9xl font-black italic tracking-tighter">{caJour}€</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center opacity-40">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-500 mb-6">Weekly (Demo)</p>
                <p className="text-8xl md:text-9xl font-black italic tracking-tighter">--€</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* STATS BAR */}
        <div className="space-y-12">
           <div>
              <div className="flex justify-between items-end mb-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 text-center w-full">Daily Achievement</p>
              </div>
              <div className="w-full h-[2px] bg-white/5 relative">
                 <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${Math.min(progression, 100)}%` }}></div>
              </div>
              <div className="flex justify-between mt-4">
                 <p className="text-[10px] font-black">{progression.toFixed(1)}%</p>
                 <p className="text-[10px] font-black text-gray-600">Goal: {targetJour}€</p>
              </div>
           </div>
        </div>

        {/* BOUTON FLOTTANT + */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Plus size={32} />
        </button>

      </div>
      
      <style jsx global>{`
        .swiper-pagination-bullet { background: #222 !important; opacity: 1 !important; }
        .swiper-pagination-bullet-active { background: #fff !important; }
      `}</style>
    </main>
  )
}