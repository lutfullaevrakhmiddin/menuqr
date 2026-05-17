"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPass, setShowPass] = useState(false);
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
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
        <main style={{background:"#06060f",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Cabinet Grotesk',sans-serif",padding:"24px 16px"}}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orb-move{0%,100%{transform:translate(0,0)}33%{transform:translate(20px,-15px)}66%{transform:translate(-15px,20px)}}
        .orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(80px);z-index:0}
        .orb-a{width:350px;height:350px;background:rgba(124,107,255,0.12);top:-80px;right:-80px;animation:orb-move 8s ease-in-out infinite}
        .orb-b{width:250px;height:250px;background:rgba(255,107,157,0.08);bottom:-50px;left:-50px;animation:orb-move 10s ease-in-out infinite reverse}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px;width:100%;max-width:420px;position:relative;z-index:1;animation:fadeUp .7s ease both}
        .reg-logo{font-family:'Clash Display',sans-serif;font-size:22px;font-weight:700;color:#f0eeff;letter-spacing:-.5px;text-decoration:none;display:block;margin-bottom:28px}
        .reg-logo span{color:#7c6bff}
        .form-title{font-family:'Clash Display',sans-serif;font-size:26px;font-weight:700;color:#f0eeff;letter-spacing:-1px;margin-bottom:6px}
        .form-sub{font-size:13px;color:rgba(240,238,255,0.4);font-weight:300;margin-bottom:28px}
        .form-group{margin-bottom:14px}
        .form-label{display:block;font-size:10px;font-weight:500;color:rgba(240,238,255,0.4);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px}
        .form-input{width:100%;padding:13px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-size:14px;color:#f0eeff;font-family:'Cabinet Grotesk',sans-serif;font-weight:300;outline:none;transition:border-color .2s;-webkit-appearance:none}
        .form-input:focus{border-color:rgba(124,107,255,0.6);background:rgba(124,107,255,0.04)}
        .form-input::placeholder{color:rgba(240,238,255,0.2)}
        .pass-wrap{position:relative}
        .pass-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(240,238,255,0.3);cursor:pointer;font-size:13px;padding:4px;font-family:'Cabinet Grotesk',sans-serif}
        .pass-toggle:hover{color:rgba(240,238,255,0.6)}
        .forgot{display:block;text-align:right;font-size:12px;color:rgba(124,107,255,0.6);text-decoration:none;margin-top:6px}
        .forgot:hover{color:#7c6bff}
        .submit-btn{width:100%;padding:15px;background:#7c6bff;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;transition:all .3s;font-family:'Cabinet Grotesk',sans-serif;margin-top:8px}
        .submit-btn:hover{background:#6a59ff;box-shadow:0 12px 30px rgba(124,107,255,0.3)}
        .submit-btn:active{transform:scale(0.98)}
        .divider{display:flex;align-items:center;gap:12px;margin:18px 0}
        .div-line{flex:1;height:1px;background:rgba(255,255,255,0.06)}
        .div-text{font-size:11px;color:rgba(240,238,255,0.25);font-weight:300}
        .google-btn{width:100%;padding:13px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(255,255,255,0.02);font-size:14px;color:rgba(240,238,255,0.6);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;font-family:'Cabinet Grotesk',sans-serif}
        .google-btn:hover{border-color:rgba(124,107,255,0.4);color:#f0eeff;background:rgba(124,107,255,0.05)}
        .g-icon{width:18px;height:18px;border-radius:50%;background:#EA4335;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0}
        .register-row{text-align:center;margin-top:20px;font-size:13px;color:rgba(240,238,255,0.35);font-weight:300}
        .register-row a{color:#7c6bff;text-decoration:none;font-weight:500}
        .register-row a:hover{text-decoration:underline}
        @media(max-width:400px){.card{padding:28px 20px}}
        @media(min-width:768px){.card{padding:48px 44px}}
      `}</style>

            <div className="orb orb-a"/>
            <div className="orb orb-b"/>

            <div className="card">

                <Link href="/" className="reg-logo">
                    W<span>R</span>
                </Link>

                <div className="form-title">Xush kelibsiz</div>
                <div className="form-sub">Akkauntingizga kiring</div>

                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label
                    ">Email</label>
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
                    <Link href="/forgot-password" className="forgot">Parolni unutdingizmi?</Link>
                </div>

                {error && (
                    <div style={{color:"#ff6b9d",fontSize:13,marginBottom:12,padding:"10px 14px",background:"rgba(255,107,157,0.08)",borderRadius:8,border:"1px solid rgba(255,107,157,0.2)"}}>
                        {error}
                    </div>
                )}

                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Yuklanmoqda..." : "Kirish →"}
                </button>
                </form>

                <div className="divider">
                    <div className="div-line"/>
                    <div className="div-text">YOKI</div>
                    <div className="div-line"/>
                </div>

                <div className="register-row">
                    Akkauntingiz yo&apos;qmi?{" "}
                    <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
                </div>

            </div>
        </main>
    );
}
/*
sudo swapoff -a && sudo swapon -a && sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches
*/