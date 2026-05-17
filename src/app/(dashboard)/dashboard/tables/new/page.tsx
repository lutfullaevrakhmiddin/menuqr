"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTablePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Stol nomi kiritilishi shart");
      return;
    }

    setLoading(true);
    setError(null);

    // Mavjud stollarni tekshirish
    const tablesRes = await fetch("/api/tables");
    const tablesData = await tablesRes.json();
    const exists = tablesData.tables?.some(
      (t: { name: string }) =>
        t.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (exists) {
      setError("Bu nomli stol allaqachon mavjud");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard/tables");
      } else {
        setError(
          Array.isArray(data.error)
            ? "Ma'lumotlar noto'g'ri"
            : (data.error ?? "Xatolik yuz berdi"),
        );
      }
    } catch {
      setError("Server xatosi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ fontFamily: "'Cabinet Grotesk',sans-serif", color: "#f0eeff" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }

        .form-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          overflow: hidden;
          animation: fadeUp .35s ease both;
          max-width: 480px;
        }

        .form-body {
          padding: 28px;
        }

        .field { display: flex; flex-direction: column; gap: 7px; }

        .field-label {
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(240,238,255,.5);
          letter-spacing: .2px;
        }
        .field-label span { color: rgba(255,100,100,.8); margin-left: 2px; }

        .field-input {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          padding: 11px 14px;
          color: #f0eeff;
          font-size: 14px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
          transition: border-color .15s;
          min-height: 44px;
        }
        .field-input::placeholder { color: rgba(240,238,255,.2); }
        .field-input:focus { border-color: rgba(124,107,255,.45); }
        .field-input.error { border-color: rgba(255,80,80,.4); }

        .error-msg {
          font-size: 12px;
          color: rgba(255,100,100,.85);
        }

        .form-footer {
          padding: 18px 28px;
          border-top: 1px solid rgba(255,255,255,.06);
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 24px;
          background: #7c6bff;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: background .15s;
          min-height: 44px;
        }
        .btn-primary:hover:not(:disabled) { background: #6a5ae0; }
        .btn-primary:disabled { opacity: .6; cursor: default; }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 18px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.55);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 44px;
        }
        .btn-back:hover { background: rgba(255,255,255,.08); color: #f0eeff; }

        .hint {
          font-size: 12px;
          color: rgba(240,238,255,.25);
          line-height: 1.5;
          margin-top: 4px;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
          animation: "fadeUp .3s ease both",
        }}
      >
        <button
          className="btn-back"
          onClick={() => router.push("/dashboard/tables")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 2L4 7l5 5" />
          </svg>
          Orqaga
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Clash Display',sans-serif",
              letterSpacing: -0.3,
            }}
          >
            Yangi stol qo&apos;shish
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-card">
          <div className="form-body">
            <div className="field">
              <label className="field-label">
                Stol nomi <span>*</span>
              </label>
              <input
                className={`field-input${error && !name.trim() ? " error" : ""}`}
                placeholder="Masalan: 1-stol, VIP 2, Teras A..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                autoFocus
              />
              {error && <div className="error-msg">{error}</div>}
              <div className="hint">
                QR kod avtomatik yaratiladi va stolga biriktiriladi.
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button
              type="button"
              className="btn-back"
              onClick={() => router.push("/dashboard/tables")}
            >
              Bekor qilish
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.9 2.9l1.4 1.4M9.7 9.7l1.4 1.4M2.9 11.1l1.4-1.4M9.7 4.3l1.4-1.4" />
                  </svg>
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 7l3.5 3.5L12 3" />
                  </svg>
                  Saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
