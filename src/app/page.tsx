import Link from "next/link";

export default function Home() {
  return (
      <main style={{background:"#06060f",color:"#f0eeff",fontFamily:"var(--font-body),sans-serif",minHeight:"100vh",overflowX:"hidden"}}>

        <style>{`
        :root{--accent:#7c6bff;--accent2:#ff6b9d;--bg:#06060f;--bg2:#0d0d1a;--border:rgba(255,255,255,0.08);--muted:rgba(240,238,255,0.45)}
        .grid-bg{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(124,107,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,107,255,0.07) 1px,transparent 1px);background-size:60px 60px;transform:perspective(600px) rotateX(25deg) scaleY(1.6);transform-origin:bottom center;opacity:.6}
        .grid-fade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,#06060f 0%,transparent 40%,#06060f 100%)}
        .orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px)}
        .orb-1{width:500px;height:500px;background:rgba(124,107,255,0.15);top:-100px;right:-100px;animation:orb-move 8s ease-in-out infinite}
        .orb-2{width:300px;height:300px;background:rgba(255,107,157,0.1);bottom:0;left:100px;animation:orb-move 10s ease-in-out infinite reverse}
        .orb-3{width:200px;height:200px;background:rgba(124,107,255,0.08);top:50%;left:50%;animation:orb-move 12s ease-in-out infinite}
        @keyframes orb-move{0%,100%{transform:translate(0,0)}33%{transform:translate(30px,-20px)}66%{transform:translate(-20px,30px)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes scroll-pulse{0%,100%{width:40px}50%{width:20px}}
        .hero-tag{animation:fade-up .8s ease both}
        .hero-h1{animation:fade-up .8s .1s ease both}
        .hero-desc{animation:fade-up .8s .2s ease both}
        .hero-actions{animation:fade-up .8s .3s ease both}
        .badge{position:absolute;z-index:3;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:14px 18px;backdrop-filter:blur(20px)}
        .badge-1{right:80px;top:30%;animation:float 4s ease-in-out infinite}
        .badge-2{right:220px;bottom:25%;animation:float 4s ease-in-out 2s infinite}
        .feat-card{background:#0d0d1a;padding:36px 28px;transition:background .3s;cursor:default}
        .feat-card:hover{background:rgba(124,107,255,0.05)}
        .feat-num{font-family:var(--font-display),sans-serif;font-size:48px;font-weight:700;color:rgba(124,107,255,0.12);letter-spacing:-2px;line-height:1;margin-bottom:20px}
        .step-box{padding:0 32px}
        .step-num-box{width:56px;height:56px;border:1px solid rgba(124,107,255,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display),sans-serif;font-size:20px;font-weight:700;color:#7c6bff;margin-bottom:24px;transition:all .3s}
        .step-box:hover .step-num-box{background:rgba(124,107,255,0.1);border-color:#7c6bff}
        .f-active{font-size:11px;font-weight:500;background:rgba(124,107,255,0.15);color:#a89fff;padding:3px 10px;border-radius:20px}
        .f-soon{font-size:11px;font-weight:500;background:rgba(255,255,255,0.06);color:rgba(240,238,255,0.3);padding:3px 10px;border-radius:20px}
        .feat-icon-active{width:38px;height:38px;border-radius:10px;background:rgba(124,107,255,0.15);display:flex;align-items:center;justify-content:center;font-size:18px}
        .feat-icon-soon{width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:18px;opacity:.5}
        .feat-item{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:20px;transition:border-color .3s}
        .feat-item:hover{border-color:rgba(124,107,255,0.2)}
        .feat-item-passive{background:transparent;border:1px solid rgba(255,255,255,0.04);border-radius:16px;padding:20px;opacity:.5}
        .nav-link{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:rgba(240,238,255,0.45);text-decoration:none;transition:color .2s}
        .nav-link:hover{color:#f0eeff}
        .btn-primary{display:inline-flex;align-items:center;gap:10px;background:#7c6bff;color:#fff;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:500;text-decoration:none;transition:all .3s;position:relative;overflow:hidden}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 40px rgba(124,107,255,0.3)}
        .btn-ghost{display:inline-flex;align-items:center;gap:10px;color:rgba(240,238,255,0.45);padding:14px 28px;border-radius:100px;font-size:14px;font-weight:500;text-decoration:none;border:1px solid rgba(255,255,255,0.08);transition:all .3s}
        .btn-ghost:hover{color:#f0eeff;border-color:rgba(255,255,255,0.2)}
        .stat-box{background:#0d0d1a;padding:32px 28px;transition:background .3s}
        .stat-box:hover{background:rgba(124,107,255,0.05)}
        @media (max-width:768px){
          .site-nav{padding:14px 20px !important}
          .nav-links{display:none !important}
          .hero-section{padding:80px 20px 60px !important;min-height:auto !important}
          .hero-content{max-width:100% !important}
          .hero-h1{letter-spacing:-2px !important}
          .hero-actions{flex-direction:column !important;align-items:stretch !important}
          .hero-actions .btn-primary,.hero-actions .btn-ghost{width:100% !important;justify-content:center !important;box-sizing:border-box}
          .badge{display:none !important}
          .hero-scroll{display:none !important}
          #features{padding:60px 20px !important}
          .feat-grid{grid-template-columns:1fr !important}
          .feat-legend{flex-wrap:wrap !important}
          #how{padding:60px 20px !important}
          .steps-grid{grid-template-columns:1fr !important;gap:40px !important}
          .step-box{padding:0 0 0 4px !important}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important;margin-top:40px !important}
          .stat-box{padding:20px 16px !important}
          .cta-section{padding:80px 20px !important}
          .site-footer{flex-direction:column !important;gap:10px !important;padding:24px 20px !important;text-align:center !important}
        }
      `}</style>

        {/* NAV */}
        <nav className="site-nav" style={{position:"sticky",top:0,zIndex:100,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 48px",background:"rgba(6,6,15,0.8)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontFamily:"var(--font-display),sans-serif",fontSize:22,fontWeight:700,letterSpacing:"-0.5px"}}>
            W<span style={{color:"#7c6bff"}}>R</span>
          </div>
          <div className="nav-links" style={{display:"flex",gap:28}}>
            <Link href="#features" className="nav-link">Xususiyatlar</Link>
            <Link href="#how" className="nav-link">Qanday ishlaydi</Link>
            <Link href="#pricing" className="nav-link">Narxlar</Link>
          </div>
          <Link href="/register" style={{fontSize:13,fontWeight:500,background:"#7c6bff",color:"#fff",padding:"10px 22px",borderRadius:100,textDecoration:"none",transition:"all .3s"}}>
            Boshlash →
          </Link>
        </nav>

        {/* HERO */}
        <section className="hero-section" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"120px 48px 80px",position:"relative",overflow:"hidden"}}>
          <div className="grid-bg"/>
          <div className="grid-fade"/>
          <div className="orb orb-1"/>
          <div className="orb orb-2"/>
          <div className="orb orb-3"/>

          <div className="hero-content" style={{position:"relative",zIndex:2,maxWidth:900}}>
            <div className="hero-tag" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color:"#7c6bff",border:"1px solid rgba(124,107,255,0.3)",padding:"6px 16px",borderRadius:100,marginBottom:32}}>
              <span style={{width:6,height:6,background:"#7c6bff",borderRadius:"50%",animation:"pulse 2s infinite",display:"inline-block"}}/>
              Restoran uchun raqamli yechim
            </div>
            <h1 className="hero-h1" style={{fontFamily:"var(--font-display),sans-serif",fontSize:"clamp(52px,8vw,110px)",fontWeight:700,lineHeight:.92,letterSpacing:"-4px",marginBottom:32}}>
              Jarayonni<br/>
              <span style={{WebkitTextStroke:"1px rgba(240,238,255,0.25)",color:"transparent"}}>raqamlash</span>
              <span style={{color:"#7c6bff"}}>tiring.</span>
            </h1>
            <p className="hero-desc" style={{fontSize:18,lineHeight:1.7,color:"rgba(240,238,255,0.45)",maxWidth:560,marginBottom:48,fontWeight:300}}>
              Mijozlaringiz QR kod orqali sekundda menyuni ko&apos;radi. Stol boshqaruvi, analitika va brendlash — hammasi bir platformada.
            </p>
            <div className="hero-actions" style={{display:"flex",alignItems:"center",gap:16}}>
              <Link href="/register" className="btn-primary">
                Hoziroq ro&apos;yxatdan o&apos;tish →
              </Link>
              <Link href="#how" className="btn-ghost">
                Qanday ishlashini ko&apos;rish →
              </Link>
            </div>
          </div>

          <div className="badge badge-1">
            <div style={{fontSize:10,color:"rgba(240,238,255,0.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Faol restoranlar</div>
            <div style={{fontFamily:"var(--font-display),sans-serif",fontSize:28,fontWeight:700,color:"#7c6bff"}}>500+</div>
            <div style={{fontSize:12,color:"rgba(240,238,255,0.45)",marginTop:2}}>va o&apos;sib bormoqda</div>
          </div>
          <div className="badge badge-2">
            <div style={{fontSize:10,color:"rgba(240,238,255,0.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite",display:"inline-block"}}/>
              Holat
            </div>
            <div style={{fontFamily:"var(--font-display),sans-serif",fontSize:17,fontWeight:700,color:"#f0eeff",marginTop:4}}>Ishga tayyor</div>
          </div>

          <div className="hero-scroll" style={{position:"absolute",bottom:40,left:48,zIndex:2,display:"flex",alignItems:"center",gap:12,fontSize:12,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(240,238,255,0.45)"}}>
            <div style={{width:40,height:1,background:"rgba(240,238,255,0.45)",animation:"scroll-pulse 2s infinite"}}/>
            Pastga aylantiring
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" style={{padding:"100px 48px",background:"#0d0d1a",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"#7c6bff",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{width:24,height:1,background:"#7c6bff",display:"inline-block"}}/>
            Xususiyatlar
          </div>
          <h2 style={{fontFamily:"var(--font-display),sans-serif",fontSize:"clamp(36px,5vw,56px)",fontWeight:700,letterSpacing:"-2px",marginBottom:16,lineHeight:1.05}}>
            <span style={{color:"#f0eeff"}}>Siz</span>
            <span style={{color:"rgba(240,238,255,0.45)",fontWeight:300,fontSize:"clamp(28px,3.5vw,40px)"}}> va </span>
            <span style={{background:"linear-gradient(135deg,#7c6bff,#ff6b9d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>mijozlar</span>
            <br/>
            <span style={{color:"rgba(240,238,255,0.45)",fontWeight:300,fontSize:"clamp(28px,3.5vw,40px)"}}>uchun qulay</span>
            <span style={{color:"#f0eeff"}}> Interface</span>
          </h2>
          <p style={{fontSize:15,color:"rgba(240,238,255,0.45)",marginBottom:48,maxWidth:500,lineHeight:1.7,fontWeight:300}}>
            Hozir ishlaydigan funksiyalar va yaqin kelajakda qo&apos;shiluvchilar
          </p>

          <div className="feat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {icon:"qr",title:"QR kod generatsiya",desc:"Har bir stol uchun unikal — bepul",active:true},
              {icon:"🍽️",title:"Menyu boshqaruvi",desc:"Taomlar, narxlar, rasmlar",active:true},
              {icon:"🗂️",title:"Kategoriyalar",desc:"Tartibli va qulay ko'rinish",active:true},
              {icon:"🪑",title:"Stol boshqaruvi",desc:"Har stol uchun alohida QR",active:true},
              {icon:"📊",title:"Analitika",desc:"Skanlar va mashhur taomlar",active:false},
              {icon:"🔔",title:"Ofitsiant chaqirish",desc:"Bir tugma — ofitsiant keladi",active:false},
              {icon:"🛒",title:"Onlayn buyurtma",desc:"Menyudan tanlash va buyurtma",active:false},
              {icon:"💳",title:"To'lov integratsiya",desc:"Click, Payme va boshqalar",active:false},
            ].map((f,i)=>(
                <div key={i} className={f.active ? "feat-item" : "feat-item-passive"}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                    <div className={f.active ? "feat-icon-active" : "feat-icon-soon"}>
                      {f.icon === "qr" ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={f.active ? "#7c6bff" : "rgba(240,238,255,0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                            <rect x="5" y="5" width="3" height="3" fill={f.active ? "#7c6bff" : "rgba(240,238,255,0.3)"} stroke="none"/>
                            <rect x="16" y="5" width="3" height="3" fill={f.active ? "#7c6bff" : "rgba(240,238,255,0.3)"} stroke="none"/>
                            <rect x="5" y="16" width="3" height="3" fill={f.active ? "#7c6bff" : "rgba(240,238,255,0.3)"} stroke="none"/>
                            <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
                          </svg>
                      ) : f.icon}
                    </div>
                    <span className={f.active ? "f-active" : "f-soon"}>{f.active ? "Faol" : "Tez kunda"}</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:500,color:f.active ? "#f0eeff" : "rgba(240,238,255,0.3)",marginBottom:6}}>{f.title}</div>
                  <div style={{fontSize:13,color:f.active ? "rgba(240,238,255,0.45)" : "rgba(240,238,255,0.2)",lineHeight:1.6,fontWeight:300}}>{f.desc}</div>
                </div>
            ))}
          </div>

          <div className="feat-legend" style={{display:"flex",gap:24,marginTop:20,padding:"14px 16px",background:"rgba(255,255,255,0.02)",borderRadius:12,width:"fit-content"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"rgba(240,238,255,0.45)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#7c6bff",display:"inline-block"}}/>
              Faol — hozir ishlaydi
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"rgba(240,238,255,0.3)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"inline-block"}}/>
              Tez kunda — ishlanmoqda
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{padding:"100px 48px",background:"#06060f"}}>
          <div style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"#7c6bff",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{width:24,height:1,background:"#7c6bff",display:"inline-block"}}/>
            Qanday ishlaydi
          </div>
          <h2 style={{fontFamily:"var(--font-display),sans-serif",fontSize:"clamp(36px,5vw,56px)",fontWeight:700,letterSpacing:"-2px",marginBottom:60,lineHeight:1.05}}>
            Tezda ishga tushing
          </h2>
          <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:0}}>
            {[
              {n:"01",t:"Ro'yxatdan o'ting",d:"Email va restoran nomini kiriting. 3 daqiqa. Kredit karta kerak emas."},
              {n:"02",t:"Menyuni yarating",d:"Kategoriyalar va taomlarni qo'shing. Rasm va narxlarni belgilang."},
              {n:"03",t:"QR joylashtiring",d:"Stollar uchun QR kodlarni yuklab chop eting. Mijozlar skanlay boshlaydi."},
            ].map((s,i)=>(
                <div key={i} className="step-box">
                  <div className="step-num-box">{s.n}</div>
                  <div style={{fontSize:16,fontWeight:500,color:"#f0eeff",marginBottom:8}}>{s.t}</div>
                  <div style={{fontSize:14,color:"rgba(240,238,255,0.45)",lineHeight:1.7,fontWeight:300}}>{s.d}</div>
                </div>
            ))}
          </div>

          <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,0.08)",marginTop:80,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            {[
              {num:"Yuzdan ortiq",label:"Faol restoran"},
              {num:"Faol",label:"Oylik xizmatlar"},
              {num:"Har oy",label:"Uptime kafolati bilan"},
              {num:"Tezlik",label:"kafolati bilan"},
            ].map((s,i)=>(
                <div key={i} className="stat-box">
                  <div style={{fontFamily:"var(--font-display),sans-serif",fontSize:48,fontWeight:700,color:"#7c6bff",lineHeight:1,marginBottom:8,letterSpacing:"-2px"}}>{s.num}</div>
                  <div style={{fontSize:13,color:"rgba(240,238,255,0.45)"}}>{s.label}</div>
                </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" style={{padding:"120px 48px",textAlign:"center",position:"relative",overflow:"hidden",background:"#0d0d1a",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(124,107,255,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <h2 style={{fontFamily:"var(--font-display),sans-serif",fontSize:"clamp(40px,5vw,72px)",fontWeight:700,letterSpacing:"-3px",marginBottom:20,lineHeight:.95,position:"relative",zIndex:1}}>
            Raqamli jarayondan<br/><span style={{color:"#7c6bff"}}>foydalaning</span>
          </h2>
          <p style={{fontSize:17,color:"rgba(240,238,255,0.45)",maxWidth:480,margin:"0 auto 40px",lineHeight:1.7,fontWeight:300,position:"relative",zIndex:1}}>
            Har kuni kechikish — har kuni yo&apos;qolgan foyda.<br/>500+ restoran allaqachon boshlagan.
          </p>
          <div style={{position:"relative",zIndex:1}}>
            <Link href="/register" className="btn-primary" style={{fontSize:15,padding:"16px 40px",display:"inline-flex"}}>
              Hoziroq ro&apos;yxatdan o&apos;tish →
            </Link>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginTop:24,flexWrap:"wrap"}}>
              {["Bepul xizmatlar","Kredit karta shart emas","3 daqiqada tayyor"].map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(240,238,255,0.6)"}}>
                    <span style={{width:18,height:18,borderRadius:"50%",background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#4ade80",flexShrink:0}}>✓</span>
                    {t}
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer" style={{padding:"32px 48px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#06060f"}}>
          <div style={{fontFamily:"var(--font-display),sans-serif",fontSize:18,fontWeight:700}}>
            W<span style={{color:"#7c6bff"}}>R</span>
          </div>
          <div style={{fontSize:13,color:"rgba(240,238,255,0.45)"}}>© 2025 WR Barcha huquqlar himoyalangan.</div>
          <div style={{fontSize:13,color:"rgba(240,238,255,0.45)"}}>Toshkent, O&apos;zbekiston</div>
        </footer>

      </main>
  );
}