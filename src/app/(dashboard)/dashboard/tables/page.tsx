"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Table = {
  id: string;
  name: string;
  status: string;
  qrToken: string;
  createdAt: string;
};

const DOMAIN = typeof window !== "undefined" ? window.location.origin : "";

function QRImage({ url, size = 120 }: { url: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: size * 2,
        margin: 1,
        color: { dark: "#1a1a2e", light: "#ffffff" },
      }).then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "rgba(255,255,255,.04)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="rgba(124,107,255,.3)"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="12" height="12" rx="1" />
          <rect x="18" y="2" width="12" height="12" rx="1" />
          <rect x="2" y="18" width="12" height="12" rx="1" />
          <rect
            x="5"
            y="5"
            width="6"
            height="6"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="21"
            y="5"
            width="6"
            height="6"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="5"
            y="21"
            width="6"
            height="6"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="18"
            y="18"
            width="4"
            height="4"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="24"
            y="18"
            width="4"
            height="4"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="18"
            y="24"
            width="4"
            height="4"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
          <rect
            x="24"
            y="24"
            width="4"
            height="4"
            rx=".5"
            fill="rgba(124,107,255,.3)"
            stroke="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="QR code"
      width={size}
      height={size}
      style={{ borderRadius: 8, display: "block" }}
    />
  );
}

function downloadQR(url: string, name: string) {
  import("qrcode").then((QRCode) => {
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `stol-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    });
  });
}

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [origin, setOrigin] = useState(
    typeof window !== "undefined" ? window.location.origin : "",
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (data.success) setTables(data.tables);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tables");
        const data = await res.json();
        if (data.success) setTables(data.tables);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  async function handleToggle(table: Table) {
    setTogglingId(table.id);
    try {
      const newStatus = table.status === "active" ? "inactive" : "active";
      const res = await fetch(`/api/tables/${table.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTables((prev) =>
          prev.map((t) =>
            t.id === table.id ? { ...t, status: newStatus } : t,
          ),
        );
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTables((prev) => prev.filter((t) => t.id !== id));
        setConfirmDeleteId(null);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const total = tables.length;
  const active = tables.filter((t) => t.status === "active").length;

  return (
    <div
      style={{ fontFamily: "'Cabinet Grotesk',sans-serif", color: "#f0eeff" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:.4; }
          50% { opacity:.7; }
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
          animation: fadeUp .3s ease both;
        }

        .stat-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px;
          padding: 18px 20px;
        }

        .stat-label {
          font-size: 11.5px;
          color: rgba(240,238,255,.35);
          letter-spacing: .3px;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          font-family: 'Clash Display', sans-serif;
          color: #f0eeff;
          letter-spacing: -.5px;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          animation: fadeUp .4s ease both;
        }

        .table-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all .2s;
        }
        .table-card:hover {
          border-color: rgba(255,255,255,.1);
          transform: translateY(-2px);
        }
        .table-card.inactive {
          opacity: .65;
        }

        .card-qr {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }

        .card-body {
          padding: 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-name {
          font-size: 15px;
          font-weight: 600;
          color: #f0eeff;
          font-family: 'Clash Display', sans-serif;
        }

        .badge-active {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 20px;
          background: rgba(34,197,94,.12);
          color: #22c55e;
          border: 1px solid rgba(34,197,94,.2);
          width: fit-content;
        }

        .badge-inactive {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 20px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.35);
          border: 1px solid rgba(255,255,255,.08);
          width: fit-content;
        }

        .card-url {
          font-size: 11px;
          color: rgba(124,107,255,.65);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: monospace;
        }

        .card-actions {
          padding: 10px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .btn-download {
          width: 100%;
          padding: 8px 0;
          background: rgba(124,107,255,.1);
          color: #7c6bff;
          border: 1px solid rgba(124,107,255,.2);
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-download:hover { background: rgba(124,107,255,.18); }

        .btn-row {
          display: flex;
          gap: 6px;
        }

        .btn-toggle {
          flex: 1;
          padding: 7px 0;
          background: rgba(255,255,255,.04);
          color: rgba(240,238,255,.55);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 34px;
        }
        .btn-toggle:hover { background: rgba(255,255,255,.08); color: #f0eeff; }
        .btn-toggle:disabled { opacity: .5; cursor: default; }

        .btn-delete {
          flex: 1;
          padding: 7px 0;
          background: rgba(255,80,80,.08);
          color: rgba(255,100,100,.75);
          border: 1px solid rgba(255,80,80,.15);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 34px;
        }
        .btn-delete:hover { background: rgba(255,80,80,.14); }
        .btn-delete:disabled { opacity: .5; cursor: default; }

        .btn-delete-confirm {
          flex: 1;
          padding: 7px 0;
          background: rgba(255,80,80,.18);
          color: #ff6464;
          border: 1px solid rgba(255,80,80,.3);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          min-height: 34px;
        }

        .btn-cancel {
          padding: 7px 10px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.4);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 34px;
        }
        .btn-cancel:hover { background: rgba(255,255,255,.08); }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #7c6bff;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: background .15s;
          min-height: 44px;
        }
        .btn-primary:hover { background: #6a5ae0; }

        .add-card {
          background: transparent;
          border: 1.5px dashed rgba(124,107,255,.25);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          padding: 32px 16px;
          transition: all .2s;
          min-height: 260px;
          color: rgba(124,107,255,.5);
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 13.5px;
        }
        .add-card:hover {
          border-color: rgba(124,107,255,.5);
          color: #7c6bff;
          background: rgba(124,107,255,.04);
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 20px;
          text-align: center;
          color: rgba(240,238,255,.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .skeleton {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 14px;
          height: 300px;
          animation: pulse 1.6s ease-in-out infinite;
        }

        @media (max-width: 1100px) {
          .tables-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .tables-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-row { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .tables-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          animation: "fadeUp .3s ease both",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "'Clash Display',sans-serif",
              letterSpacing: -0.3,
            }}
          >
            Stollar &amp; QR kodlar
          </h1>
          <div
            style={{
              fontSize: 13,
              color: "rgba(240,238,255,.35)",
              marginTop: 4,
            }}
          >
            Har bir stolga QR kod yarating va yuklab oling
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => router.push("/dashboard/tables/new")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
          Stol qo&apos;shish
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Jami stollar</div>
          <div className="stat-value">{loading ? "—" : total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Faol stollar</div>
          <div className="stat-value" style={{ color: "#22c55e" }}>
            {loading ? "—" : active}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bugungi skanlar</div>
          <div className="stat-value" style={{ color: "rgba(240,238,255,.3)" }}>
            0
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="tables-grid">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="tables-grid">
          {tables.length === 0 ? (
            <div className="empty-state">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="4" y="14" width="40" height="24" rx="3" />
                <line x1="14" y1="38" x2="10" y2="44" />
                <line x1="34" y1="38" x2="38" y2="44" />
                <line x1="8" y1="44" x2="40" y2="44" />
                <line x1="4" y1="22" x2="44" y2="22" />
              </svg>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(240,238,255,.4)",
                }}
              >
                Hali stol qo&apos;shilmagan
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: 4 }}
                onClick={() => router.push("/dashboard/tables/new")}
              >
                Birinchi stolni qo&apos;shing
              </button>
            </div>
          ) : (
            tables.map((table, i) => {
              const menuUrl = `${origin}/menu/${table.qrToken}`;
              const isActive = table.status === "active";
              return (
                <div
                  key={table.id}
                  className={`table-card${isActive ? "" : " inactive"}`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animation: "fadeUp .4s ease both",
                  }}
                >
                  <div className="card-qr">
                    <QRImage url={menuUrl} size={120} />
                  </div>

                  <div className="card-body">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        className="card-name"
                        contentEditable
                        suppressContentEditableWarning
                        style={{ outline: "none", cursor: "text" }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderBottom =
                            "1px solid #7c6bff")
                        }
                        onBlur={(e) => {
                          e.currentTarget.style.borderBottom = "none";
                          const newName = e.currentTarget.textContent?.trim();
                          if (newName && newName !== table.name) {
                            fetch(`/api/tables/${table.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: newName }),
                            })
                              .then((r) => r.json())
                              .then((d) => {
                                if (d.success) {
                                  setTables((prev) =>
                                    prev.map((t) =>
                                      t.id === table.id
                                        ? { ...t, name: newName }
                                        : t,
                                    ),
                                  );
                                } else {
                                  e.currentTarget.textContent = table.name;
                                  alert(d.error || "Xatolik");
                                }
                              });
                          }
                        }}
                      >
                        {table.name}
                      </div>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="rgba(240,238,255,0.3)"
                        strokeWidth="1.5"
                        style={{ cursor: "pointer", flexShrink: 0 }}
                        onClick={(e) => {
                          const nameDiv = e.currentTarget
                            .previousSibling as HTMLElement;
                          nameDiv.focus();
                        }}
                      >
                        <path d="M11 2l3 3-8 8H3v-3l8-8z" />
                      </svg>
                    </div>
                    <span
                      className={isActive ? "badge-active" : "badge-inactive"}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: isActive
                            ? "#22c55e"
                            : "rgba(240,238,255,.3)",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {isActive ? "Faol" : "Nofaol"}
                    </span>
                    <div className="card-url" title={menuUrl}>
                      {menuUrl.replace(/^https?:\/\//, "")}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-download"
                      onClick={() => downloadQR(menuUrl, table.name)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6.5 1v8M3.5 6l3 3 3-3" />
                        <path d="M1 10h11" />
                      </svg>
                      QR yuklab olish
                    </button>

                    <div className="btn-row">
                      {confirmDeleteId === table.id ? (
                        <>
                          <button
                            className="btn-delete-confirm"
                            onClick={() => handleDelete(table.id)}
                            disabled={deletingId === table.id}
                          >
                            {deletingId === table.id ? "..." : "O'chirish"}
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Bekor
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-toggle"
                            onClick={() => handleToggle(table)}
                            disabled={togglingId === table.id}
                          >
                            {togglingId === table.id
                              ? "..."
                              : isActive
                                ? "Nofaol"
                                : "Faol"}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setConfirmDeleteId(table.id)}
                          >
                            O&apos;chirish
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Add card — only shown when tables exist */}
          {tables.length > 0 && (
            <button
              className="add-card"
              onClick={() => router.push("/dashboard/tables/new")}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="14" y1="4" x2="14" y2="24" />
                <line x1="4" y1="14" x2="24" y2="14" />
              </svg>
              Yangi stol qo&apos;shish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
