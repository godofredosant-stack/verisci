import React, { useState, useEffect } from "react";

// VeriSci - Frontend Prototype (single-file)
// Paste this component into a Next.js page (e.g., pages/index.js) or integrate into your React app.

export default function VeriSciDashboard() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [analysisPreview, setAnalysisPreview] = useState(null);

  useEffect(() => {
    const mock = [
      {
        id: "a1",
        title: "Nutrillermo - Reel 2025-10-17",
        source: "YouTube",
        timestamp: "2025-10-17T08:21:00Z",
        credibility: 42,
        status: "pending"
      }
    ];
    setFiles(mock);
  }, []);

  async function handleUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    setUploading(true);
    const newItem = {
      id: 'u_' + Date.now(),
      title: f.name,
      source: 'local',
      timestamp: new Date().toISOString(),
      credibility: null,
      status: 'queued'
    };
    setFiles(prev => [newItem, ...prev]);
    setTimeout(() => {
      setFiles(prev => prev.map(it => it.id === newItem.id ? { ...it, status: 'processing' } : it));
      setTimeout(() => {
        setFiles(prev => prev.map(it => it.id === newItem.id ? { ...it, status: 'reviewed', credibility: 64 } : it));
        setUploading(false);
      }, 2200);
    }, 800);
  }

  async function fetchAnalysis(id) {
    setSelected(id);
    setAnalysisPreview(null);
    const mockAnalysis = {
      analysis_id: id,
      executive_summary: "Resumen ejecutivo simulado.",
      overall_credibility: Math.floor(Math.random() * 50) + 40,
      claims: [
        {
          id: 1,
          text: "El azúcar produce adicción similar a drogas.",
          category: "Parcialmente correcta",
          credibility_percent: 45,
          explanation: "Evidencia en modelos animales; en humanos limitada.",
          evidence: [
            { citation: "Smith J. (2021). Estudio. Am J Clin Nutr. doi:10.1111/abcd.12345", source: "PubMed" }
          ]
        }
      ],
      bibliography_apa7: [
        "Smith, J. (2021). Estudio. American Journal of Clinical Nutrition, 12(3), 123-130. https://doi.org/10.1111/abcd.12345"
      ],
      social_posts: {
        facebook: { text: "Resumen largo..." },
        instagram: { caption: "Caption corto..." },
        linkedin: { text: "Versión profesional..." },
        x: { text: "Micro post..." }
      }
    };
    setTimeout(() => setAnalysisPreview(mockAnalysis), 600);
  }

  return (
    <div style={{fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto', padding: 24, background:'#f5f7fb', minHeight:'100vh'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <div>
          <h1 style={{margin:0}}>VeriSci — Plataforma de Verificación Científica</h1>
          <p style={{margin:0, color:'#555'}}>Prototipo frontend — conecta con FastAPI backend.</p>
        </div>
        <div>
          <label style={{display:'inline-block', cursor:'pointer'}}>
            <input type="file" accept="audio/*,video/*" onChange={handleUpload} style={{display:'none'}} />
            <button style={{padding:'8px 14px', borderRadius:12, border:'1px solid #ddd', background:'#fff'}}>Subir archivo</button>
          </label>
        </div>
      </header>

      <main style={{display:'flex', gap:20}}>
        <section style={{flex:'0 0 360px', background:'#fff', padding:16, borderRadius:12, boxShadow:'0 4px 18px rgba(15,23,42,0.06)'}}>
          <h3>Análisis recientes</h3>
          <div style={{marginTop:12}}>
            {files.map(item => (
              <div key={item.id} onClick={() => fetchAnalysis(item.id)} style={{padding:10, borderRadius:8, border:'1px solid #eee', marginBottom:8, cursor:'pointer'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <strong>{item.title}</strong>
                  <span>{item.credibility ?? '—'}%</span>
                </div>
                <div style={{fontSize:12, color:'#666'}}>{item.source} • {new Date(item.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop:16}}>
            <h4>Buscar literatura (demo)</h4>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ej: azúcar adicción meta-analysis" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd'}} />
              <button onClick={()=>alert('Buscar PubMed — demo')} style={{padding:'8px 12px', borderRadius:8}}>Buscar</button>
            </div>
          </div>
        </section>

        <section style={{flex:1, background:'#fff', padding:18, borderRadius:12}}>
          {!analysisPreview ? (
            <div style={{textAlign:'center', color:'#666', padding:40}}>Selecciona un análisis para ver detalle.</div>
          ) : (
            <>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <h2 style={{margin:0}}>{analysisPreview.analysis_id} — Resumen</h2>
                  <div style={{color:'#666'}}>Credibilidad global: <strong>{analysisPreview.overall_credibility}%</strong></div>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={()=>alert('Descargar PDF (simulado)')} style={{padding:'8px 12px', borderRadius:8}}>Descargar PDF</button>
                  <button style={{padding:'8px 12px', borderRadius:8, background:'#16a34a', color:'#fff'}}>Aprobar</button>
                </div>
              </div>

              <div style={{marginTop:18}}>
                <h3>Resumen ejecutivo</h3>
                <p style={{color:'#444'}}>{analysisPreview.executive_summary}</p>

                <h3>Afirmaciones detectadas</h3>
                {analysisPreview.claims.map(c => (
                  <div key={c.id} style={{border:'1px solid #eee', padding:10, borderRadius:8, marginBottom:8}}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                      <strong>{c.text}</strong>
                      <span>{c.credibility_percent}%</span>
                    </div>
                    <div style={{fontSize:13, color:'#555', marginTop:6}}>{c.explanation}</div>
                  </div>
                ))}

                <h3>Bibliografía (APA7)</h3>
                <div style={{fontSize:13, color:'#555'}}>{analysisPreview.bibliography_apa7.join('; ')}</div>
              </div>
            </>
          )}
        </section>
      </main>

      <footer style={{marginTop:28, textAlign:'center', color:'#777'}}>VeriSci prototype • Diseño moderno y funcional</footer>
    </div>
  );
}
