"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [showPass, setShowPass] = useState(false);
    const [name, setName] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, restaurantName, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Xatolik yuz berdi");
            }
        } catch {
            setError("Tarmoq xatosi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{background:"#06060f",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-body),sans-serif",padding:"24px 16px"}}>
            <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orb-move{0%,100%{transform:translate(0,0)}33%{transform:translate(20px,-15px)}66%{transform:translate(-15px,20px)}}
        .orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(80px);z-index:0}
        .orb-a{width:350px;height:350px;background:rgba(124,107,255,0.12);top:-80px;right:-80px;animation:orb-move 8s ease-in-out infinite}
        .orb-b{width:250px;height:250px;background:rgba(255,107,157,0.08);bottom:-50px;left:-50px;animation:orb-move 10s ease-in-out infinite reverse}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px;width:100%;max-width:420px;position:relative;z-index:1;animation:fadeUp .7s ease both}
        .reg-logo{font-family:var(--font-display),sans-serif;font-size:22px;font-weight:700;color:#f0eeff;letter-spacing:-.5px;text-decoration:none;display:block;margin-bottom:28px}
        .reg-logo span{color:#7c6bff}
        .form-title{font-family:var(--font-display),sans-serif;font-size:26px;font-weight:700;color:#f0eeff;letter-spacing:-1px;margin-bottom:6px}
        .form-sub{font-size:13px;color:rgba(240,238,255,0.4);font-weight:300;margin-bottom:28px}
        .form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .form-group{margin-bottom:14px}
        .form-label{display:block;font-size:10px;font-weight:500;color:rgba(240,238,255,0.4);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px}
        .form-input{width:100%;padding:13px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-size:14px;color:#f0eeff;font-family:var(--font-body),sans-serif;font-weight:300;outline:none;transition:border-color .2s;-webkit-appearance:none}
        .form-input:focus{border-color:rgba(124,107,255,0.6);background:rgba(124,107,255,0.04)}
        .form-input::placeholder{color:rgba(240,238,255,0.2)}
        .pass-wrap{position:relative}
        .pass-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(240,238,255,0.3);cursor:pointer;font-size:13px;padding:4px;font-family:var(--font-body),sans-serif}
        .pass-toggle:hover{color:rgba(240,238,255,0.6)}
        .submit-btn{width:100%;padding:15px;background:#7c6bff;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;transition:all .3s;font-family:var(--font-body),sans-serif;margin-top:4px}
        .submit-btn:hover{background:#6a59ff;box-shadow:0 12px 30px rgba(124,107,255,0.3)}
        .submit-btn:active{transform:scale(0.98)}
        .divider{display:flex;align-items:center;gap:12px;margin:18px 0}
        .div-line{flex:1;height:1px;background:rgba(255,255,255,0.06)}
        .div-text{font-size:11px;color:rgba(240,238,255,0.25);font-weight:300}
        .google-btn{width:100%;padding:13px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(255,255,255,0.02);font-size:14px;color:rgba(240,238,255,0.6);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;font-family:var(--font-body),sans-serif}
        .google-btn:hover{border-color:rgba(124,107,255,0.4);color:#f0eeff;background:rgba(124,107,255,0.05)}
        .g-icon{width:18px;height:18px;border-radius:50%;background:#EA4335;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0}
        .signin-row{text-align:center;margin-top:20px;font-size:13px;color:rgba(240,238,255,0.35);font-weight:300}
        .signin-row a{color:#7c6bff;text-decoration:none;font-weight:500}
        .signin-row a:hover{text-decoration:underline}
        .terms-txt{text-align:center;margin-top:12px;font-size:11px;color:rgba(240,238,255,0.2);font-weight:300;line-height:1.6}
        .terms-txt a{color:rgba(124,107,255,0.5);text-decoration:none}
        .trust-row{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:24px;flex-wrap:wrap}
        .trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(240,238,255,0.25)}
        .trust-dot{width:5px;height:5px;background:#7c6bff;border-radius:50%;flex-shrink:0}
        @media(max-width:400px){
          .card{padding:28px 20px;border-radius:16px}
          .form-row-2{grid-template-columns:1fr}
          .form-title{font-size:22px}
        }
        @media(min-width:768px){
          .card{padding:48px 44px}
        }
      `}</style>

            <div className="orb orb-a"/>
            <div className="orb orb-b"/>

            <div className="card">

                <Link href="/" className="reg-logo">
                    W<span>R</span>
                </Link>

                <div className="form-title">Hisob yarating</div>
                <div className="form-sub">Restoraningizni 3 daqiqada ulang</div>

                <form onSubmit={handleSubmit}>
                <div className="form-row-2">
                    <div className="form-group">
                        <label className="form-label">Ism</label>
                        <input className="form-input" type="text" placeholder="Akbar" value={name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Biznesingiz nomi</label>
                        <input className="form-input" type="text" placeholder="Osh Markazi" value={restaurantName} onChange={e => setRestaurantName(e.target.value)}/>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="akbar@restoran.uz" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label className="form-label">Parol</label>
                    <div className="pass-wrap">
                        <input
                            className="form-input"
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            style={{paddingRight:48}}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                            {showPass ? "Yashir" : "Ko'rish"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{color:"#ff6b9d",fontSize:13,marginBottom:12,padding:"10px 14px",background:"rgba(255,107,157,0.08)",borderRadius:8,border:"1px solid rgba(255,107,157,0.2)"}}>
                        {error}
                    </div>
                )}

                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Yuklanmoqda..." : "Ro’yxatdan o’tish →"}
                </button>
                </form>

                <div className="divider">
                    <div className="div-line"/>
                    <div className="div-text"></div>
                    <div className="div-line"/>
                </div>

                <div className="signin-row">
                    Akkauntingiz bormi? <Link href="/login">Kirish</Link>
                </div>

                <div className="terms-txt">
                    Ro&apos;yxatdan o&apos;tish orqali{" "}
                    <Link href="/terms">Foydalanish shartlari</Link>
                    {" "}va{" "}
                    <Link href="/privacy">Maxfiylik siyosati</Link>
                    ga rozilik bildirasiz
                </div>

                <div className="trust-row">
                    <div className="trust-item"><div className="trust-dot"/>500+ restoran</div>
                    <div className="trust-item"><div className="trust-dot"/>Bepul boshlash</div>
                    <div className="trust-item"><div className="trust-dot"/>24/7 yordam</div>
                </div>

            </div>
        </main>
    );
}