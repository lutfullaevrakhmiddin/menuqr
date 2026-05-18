"use client";

import React from "react";

type RestaurantData = {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  themeColor: string | null;
};

type TableData = {
  id: string;
  name: string;
};

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

type CategoryData = {
  id: string;
  name: string;
  sortOrder: number;
  menuItems: MenuItemData[];
};

type Props = {
  restaurant: RestaurantData;
  table: TableData;
  categories: CategoryData[];
  scanToken: string | null;
};

function formatPrice(price: string): string {
  const n = parseFloat(price);
  return n.toLocaleString("ru-RU") + " so'm";
}

export default function MenuClient({ restaurant, table, categories, scanToken }: Props) {
  const [active, setActive] = React.useState("all");

  React.useEffect(() => {
    if (scanToken) {
      document.cookie = `scanned_${scanToken}=1; max-age=1800; path=/; SameSite=Lax`;
    }
  }, [scanToken]);

  return (
    <>
      <style>{`
        .menu-root {
          min-height: 100dvh;
          background: #0F0A00;
          color: #FFF8F0;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
        }

        .menu-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(15, 10, 0, 0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255, 248, 240, 0.07);
          padding: 0 16px;
        }

        .header-main {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 0 10px;
        }

        .header-logo {
          font-size: 26px;
          line-height: 1;
          flex-shrink: 0;
        }

        .header-name {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #FFF8F0;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.2px;
        }

        .table-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(255, 107, 53, 0.12);
          border: 1px solid rgba(255, 107, 53, 0.28);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #FF6B35;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tabs-bar {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 0 0 12px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tabs-bar::-webkit-scrollbar { display: none; }

        .tab-btn {
          flex-shrink: 0;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255, 248, 240, 0.1);
          background: rgba(255, 248, 240, 0.05);
          color: rgba(255, 248, 240, 0.5);
          font-family: var(--font-dm-sans), sans-serif;
          transition: all 0.16s ease;
          white-space: nowrap;
        }
        .tab-btn:hover {
          background: rgba(255, 248, 240, 0.1);
          color: rgba(255, 248, 240, 0.8);
        }
        .tab-btn.active {
          background: #FF6B35;
          color: #0F0A00;
          font-weight: 700;
          border-color: #FF6B35;
        }

        .menu-content {
          padding: 24px 16px 48px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .cat-title {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 19px;
          font-weight: 700;
          color: #FFD166;
          margin-bottom: 14px;
          letter-spacing: -0.1px;
        }

        .items-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes seaGlow {
          0%, 100% {
            box-shadow: 0 0 4px rgba(74, 222, 128, 0.1);
            border-color: rgba(74, 222, 128, 0.15);
          }
          50% {
            box-shadow: 0 0 16px rgba(74, 222, 128, 0.6), 0 0 32px rgba(74, 222, 128, 0.25);
            border-color: rgba(74, 222, 128, 0.8);
          }
        }

        .item-card {
          background: #221800;
          border-radius: 14px;
          padding: 12px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border: 1px solid rgba(255, 248, 240, 0.06);
          animation: fadeUp 0.35s ease both;
        }
        .item-card.unavailable {
          opacity: 0.45;
        }

        .img-wrap {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(255, 248, 240, 0.05);
          border: 1.5px solid transparent;
        }
        .img-wrap.glow {
          border: 1.5px solid rgba(74, 222, 128, 0.15);
          animation: seaGlow 5s ease-in-out infinite;
        }

        .img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 2px;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #FFF8F0;
          line-height: 1.35;
        }

        .item-desc {
          font-size: 12.5px;
          color: rgba(255, 248, 240, 0.42);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-bottom {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 5px;
          flex-wrap: wrap;
        }

        .item-price {
          font-size: 15px;
          font-weight: 700;
          color: #4ade80;
        }
        .item-price.sold-out {
          text-decoration: line-through;
          color: rgba(255, 248, 240, 0.3);
        }

        .sold-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(255, 107, 53, 0.12);
          color: #FF6B35;
          border: 1px solid rgba(255, 107, 53, 0.28);
          white-space: nowrap;
        }

        .menu-footer {
          padding: 22px 16px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 248, 240, 0.2);
          border-top: 1px solid rgba(255, 248, 240, 0.05);
          letter-spacing: 0.2px;
        }
        .menu-footer .brand {
          color: #FF6B35;
          font-weight: 600;
        }
      `}</style>

      <div className="menu-root">
        <header className="menu-header">
          <div className="header-main">
            {restaurant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  objectFit: 'cover',
                  border: '1px solid rgba(255,107,53,0.2)',
                  flexShrink: 0,
                }}
              />
            ) : null}
            <span className="header-name">{restaurant.name}</span>
            <span className="table-badge">🪑 {table.name}</span>
          </div>

          {categories.length > 0 && (
            <div className="tabs-bar">
              <button
                className={`tab-btn${active === "all" ? " active" : ""}`}
                onClick={() => setActive("all")}
              >
                Barchasi
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`tab-btn${active === cat.id ? " active" : ""}`}
                  onClick={() => setActive(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </header>

        <main className="menu-content">
          {categories.map((cat, catIdx) => {
            if (active !== "all" && active !== cat.id) return null;
            return (
              <section key={cat.id}>
                <h2 className="cat-title">{cat.name}</h2>
                <div className="items-grid">
                  {cat.menuItems.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className={`item-card${item.isAvailable ? "" : " unavailable"}`}
                      style={{ animationDelay: `${(catIdx * 4 + itemIdx) * 0.055}s` }}
                    >
                      <div className={`img-wrap${item.isAvailable ? " glow" : ""}`}>
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="item-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="img-placeholder">🍴</div>
                        )}
                      </div>

                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        {item.description && (
                          <div className="item-desc">{item.description}</div>
                        )}
                        <div className="item-bottom">
                          <span className={`item-price${item.isAvailable ? "" : " sold-out"}`}>
                            {formatPrice(item.price)}
                          </span>
                          {!item.isAvailable && (
                            <span className="sold-badge">Tugagan</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        <footer className="menu-footer">
          Powered by <span className="brand">MenuQR</span>
        </footer>
      </div>
    </>
  );
}
