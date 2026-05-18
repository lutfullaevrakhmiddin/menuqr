"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
    const router = useRouter();

    const [step, setStep] = useState<Step>(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(false);

    async function sendCode(targetEmail: string) {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: targetEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep(2);
            } else {
                setError(data.error || "Xatolik yuz berdi");
            }
        } catch {
            setError("Tarmoq xatosi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    }

    async function handleStep1(e: React.FormEvent) {
        e.preventDefault();
        await sendCode(email);
    }

    async function handleResend() {
        if (resendCooldown) return;
        setResendCooldown(true);
        await sendCode(email);
        setTimeout(() => setResendCooldown(false), 30000);
    }

    async function handleStep2(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep(3);
            } else {
                setError(data.error || "Xatolik yuz berdi");
            }
        } catch {
            setError("Tarmoq xatosi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    }

    async function handleStep3(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Parollar mos kelmadi");
            return;
        }
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
        .form-input{width:100%;padding:13px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-size:14px;color:#f0eeff;font-family:var(--font-body),sans-serif;font-weight:300;outline:none;transition:border-color .2s;-webkit-appearance:none;box-sizing:border-box}
        .form-input:focus{border-color:rgba(124,107,255,0.6);background:rgba(124,107,255,0.04)}
        .form-input::placeholder{color:rgba(240,238,255,0.2)}
        .form-input:read-only{opacity:0.6;cursor:default}
        .pass-wrap{position:relative}
        .pass-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(240,238,255,0.3);cursor:pointer;font-size:13px;padding:4px;font-family:var(--font-body),sans-serif}
        .pass-toggle:hover{color:rgba(240,238,255,0.6)}
        .submit-btn{width:100%;padding:15px;background:#7c6bff;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;transition:all .3s;font-family:var(--font-body),sans-serif;margin-top:4px}
        .submit-btn:hover:not(:disabled){background:#6a59ff;box-shadow:0 12px 30px rgba(124,107,255,0.3)}
        .submit-btn:active:not(:disabled){transform:scale(0.98)}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed}
        .code-input{width:100%;padding:18px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-size:28px;font-weight:700;color:#7c6bff;font-family:var(--font-body),sans-serif;outline:none;transition:border-color .2s;-webkit-appearance:none;box-sizing:border-box;text-align:center;letter-spacing:10px}
        .code-input:focus{border-color:rgba(124,107,255,0.6);background:rgba(124,107,255,0.04)}
        .resend-link{text-align:center;margin-top:14px;font-size:13px;color:rgba(240,238,255,0.35)}
        .resend-btn{background:none;border:none;color:#7c6bff;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--font-body),sans-serif;padding:0}
        .resend-btn:hover{text-decoration:underline}
        .resend-btn:disabled{color:rgba(124,107,255,0.4);cursor:default;text-decoration:none}
        .step-indicator{display:flex;align-items:center;gap:6px;margin-bottom:24px}
        .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.1);transition:all .3s}
        .step-dot.active{background:#7c6bff;width:24px;border-radius:4px}
        .step-dot.done{background:rgba(124,107,255,0.4)}
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

                <div className="step-indicator">
                    <div className={`step-dot ${step === 1 ? "active" : "done"}`}/>
                    <div className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""}`}/>
                    <div className={`step-dot ${step === 3 ? "active" : ""}`}/>
                </div>

                {step === 1 && (
                    <>
                        <div className="form-title">Hisob yarating</div>
                        <div className="form-sub">Emailingizni kiriting — tasdiqlash kodi yuboramiz</div>
                        <form onSubmit={handleStep1}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="akbar@restoran.uz"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <ErrorBox>{error}</ErrorBox>}
                            <button className="submit-btn" type="submit" disabled={loading}>
                                {loading ? "Yuborilmoqda..." : "Kod yuborish →"}
                            </button>
                        </form>
                        <div className="signin-row" style={{marginTop:20}}>
                            Akkauntingiz bormi? <Link href="/login">Kirish</Link>
                        </div>
                        <div className="trust-row">
                            <div className="trust-item"><div className="trust-dot"/>500+ restoran</div>
                            <div className="trust-item"><div className="trust-dot"/>Bepul boshlash</div>
                            <div className="trust-item"><div className="trust-dot"/>24/7 yordam</div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="form-title">Kodni kiriting</div>
                        <div className="form-sub">
                            <strong style={{color:"#f0eeff"}}>{email}</strong> manziliga 6 xonali kod yuborildi
                        </div>
                        <form onSubmit={handleStep2}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" value={email} readOnly/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tasdiqlash kodi</label>
                                <input
                                    className="code-input"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <ErrorBox>{error}</ErrorBox>}
                            <button className="submit-btn" type="submit" disabled={loading || code.length < 6}>
                                {loading ? "Tekshirilmoqda..." : "Tasdiqlash →"}
                            </button>
                        </form>
                        <div className="resend-link">
                            Kod kelmadimi?{" "}
                            <button
                                className="resend-btn"
                                type="button"
                                onClick={handleResend}
                                disabled={resendCooldown || loading}
                            >
                                Qayta yuborish
                            </button>
                        </div>
                        <div style={{textAlign:"center",marginTop:"12px"}}>
                            <button type="button" onClick={() => setStep(1)} style={{background:"transparent",border:"none",color:"rgba(240,238,255,0.45)",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>← Orqaga</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="form-title">Hisob ma&apos;lumotlari</div>
                        <div className="form-sub">Restoraningiz haqida ma&apos;lumot kiriting</div>
                        <form onSubmit={handleStep3}>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Ism</label>
                                    <input className="form-input" type="text" placeholder="Akbar" value={name} onChange={e => setName(e.target.value)} required/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Biznesingiz nomi</label>
                                    <input className="form-input" type="text" placeholder="Osh Markazi" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required/>
                                </div>
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
                                        required
                                        minLength={8}
                                    />
                                    <button className="pass-toggle" type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? "Yashir" : "Ko'rish"}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Parolni tasdiqlang</label>
                                <div className="pass-wrap">
                                    <input
                                        className="form-input"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        style={{paddingRight:48}}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button className="pass-toggle" type="button" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? "Yashir" : "Ko'rish"}
                                    </button>
                                </div>
                            </div>
                            {error && <ErrorBox>{error}</ErrorBox>}
                            <button className="submit-btn" type="submit" disabled={loading}>
                                {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish →"}
                            </button>
                        </form>
                        <div className="terms-txt">
                            Ro&apos;yxatdan o&apos;tish orqali{" "}
                            <Link href="/terms">Foydalanish shartlari</Link>
                            {" "}va{" "}
                            <Link href="/privacy">Maxfiylik siyosati</Link>
                            ga rozilik bildirasiz
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
    return (
        <div style={{color:"#ff6b9d",fontSize:13,marginBottom:12,padding:"10px 14px",background:"rgba(255,107,157,0.08)",borderRadius:8,border:"1px solid rgba(255,107,157,0.2)"}}>
            {children}
        </div>
    );
}
