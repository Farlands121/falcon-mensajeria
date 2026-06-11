import { useState, useRef } from "react";

const COLUMNS = [
  { id: "recibido", label: "Recibido", icon: "📦", color: "#A8D832" },
  { id: "en_ruta", label: "En Ruta", icon: "🛵", color: "#E8176F" },
  { id: "entregado", label: "Entregado", icon: "✅", color: "#8B0A4A" },
];

const INITIAL_ORDERS = [
  { id: "F-001", cliente: "María García", direccion: "Cll 45 #23-10, Bucaramanga", tipo: "Documentos", hora: "06:30", peso: "0.2 kg", valor: "15.000", status: "recibido" },
  { id: "F-002", cliente: "Tienda Sweet Break", direccion: "Cra 27 #48-60, Floridablanca", tipo: "Domicilio express", hora: "07:15", peso: "1.5 kg", valor: "22.000", status: "recibido" },
  { id: "F-003", cliente: "Jarri's Distribuciones", direccion: "Av. Quebrada Seca #12-34, Bucaramanga", tipo: "Mensajería empresarial", hora: "08:00", peso: "3.0 kg", valor: "35.000", status: "recibido" },
  { id: "F-004", cliente: "Catador Restaurante", direccion: "Cll 52 #30-15, Floridablanca", tipo: "Pago contraentrega", hora: "08:45", peso: "2.0 kg", valor: "28.000", status: "en_ruta" },
  { id: "F-005", cliente: "Laura Martínez", direccion: "Cra 15 #66-90, Piedecuesta", tipo: "Entrega de regalo", hora: "09:00", peso: "0.8 kg", valor: "18.000", status: "en_ruta" },
  { id: "F-006", cliente: "Go Print", direccion: "Cll 36 #18-25, Bucaramanga", tipo: "Documentos", hora: "07:30", peso: "0.5 kg", valor: "12.000", status: "entregado" },
  { id: "F-007", cliente: "Smile Detalles", direccion: "Cra 22 #44-80, Girón", tipo: "Logística devolución", hora: "06:45", peso: "1.2 kg", valor: "20.000", status: "entregado" },
];

export default function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  const counts = COLUMNS.reduce((acc, col) => {
    acc[col.id] = orders.filter(o => o.status === col.id).length;
    return acc;
  }, {});

  const totalEnRuta = orders.filter(o => o.status === "en_ruta").length;
  const totalEntregados = orders.filter(o => o.status === "entregado").length;

  function showNotif(msg, color) {
    setNotification({ msg, color });
    clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(null), 2800);
  }

  function handleDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, colId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(colId);
  }

  function handleDrop(e, colId) {
    e.preventDefault();
    if (!dragId) return;
    const order = orders.find(o => o.id === dragId);
    if (order && order.status !== colId) {
      setOrders(prev =>
        prev.map(o => o.id === dragId ? { ...o, status: colId } : o)
      );
      const col = COLUMNS.find(c => c.id === colId);
      showNotif(`Pedido ${dragId} movido a "${col.label}"`, col.color);
    }
    setDragId(null);
    setDragOver(null);
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOver(null);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#F7F7F7", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "#E8176F",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        boxShadow: "0 2px 8px rgba(232,23,111,0.18)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            background: "#A8D832",
            borderRadius: "50%",
            width: "42px", height: "42px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "700", fontSize: "20px", color: "#1A1A1A"
          }}>F</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "700", fontSize: "17px", letterSpacing: "0.5px" }}>FALCON</div>
            <div style={{ color: "#A8D832", fontSize: "11px", letterSpacing: "1px" }}>MENSAJERÍA FEMENINA</div>
          </div>
        </div>

        {/* Counters in header — sync simultánea (Nivel 3) */}
        <div style={{ display: "flex", gap: "12px" }}>
          {COLUMNS.map(col => (
            <div key={col.id} style={{
              background: "rgba(255,255,255,0.13)",
              borderRadius: "20px",
              padding: "4px 14px",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              <span style={{ fontSize: "15px" }}>{col.icon}</span>
              <span style={{ color: "#fff", fontSize: "13px" }}>{col.label}</span>
              <span style={{
                background: col.color,
                color: col.id === "en_ruta" ? "#fff" : "#1A1A1A",
                borderRadius: "12px",
                padding: "1px 9px",
                fontWeight: "700",
                fontSize: "13px",
                minWidth: "24px",
                textAlign: "center"
              }}>{counts[col.id]}</span>
            </div>
          ))}
        </div>

        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
          Bucaramanga · Floridablanca · Piedecuesta · Girón
        </div>
      </nav>

      {/* STATS BAR */}
      <div style={{
        background: "#8B0A4A",
        padding: "10px 2rem",
        display: "flex", gap: "2rem", alignItems: "center"
      }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>Resumen del día:</span>
        <span style={{ color: "#A8D832", fontSize: "13px", fontWeight: "600" }}>
          🛵 {totalEnRuta} en ruta ahora
        </span>
        <span style={{ color: "#fff", fontSize: "13px" }}>
          ✅ {totalEntregados} entregados
        </span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
          📦 {counts.recibido} pendientes
        </span>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "80px", right: "24px",
          background: notification.color,
          color: notification.color === "#A8D832" ? "#1A1A1A" : "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
          zIndex: 999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          transition: "opacity 0.3s"
        }}>
          {notification.msg}
        </div>
      )}

      {/* INSTRUCTIONS */}
      <div style={{ padding: "1.5rem 2rem 0.5rem", color: "#888", fontSize: "13px", textAlign: "center" }}>
        Arrastra los pedidos entre columnas para actualizar su estado en tiempo real
      </div>

      {/* KANBAN BOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        padding: "1rem 2rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          const isOver = dragOver === col.id;
          return (
            <div
              key={col.id}
              onDragOver={e => handleDragOver(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}
              onDragLeave={() => setDragOver(null)}
              style={{
                background: isOver ? "rgba(232,23,111,0.06)" : "#F0F0F0",
                borderRadius: "14px",
                border: isOver ? `2px dashed ${col.color}` : "2px solid transparent",
                transition: "all 0.18s",
                minHeight: "420px",
                padding: "0 0 16px"
              }}
            >
              {/* Column Header */}
              <div style={{
                background: col.color,
                borderRadius: "12px 12px 0 0",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{col.icon}</span>
                  <span style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    color: col.id === "en_ruta" ? "#fff" : "#1A1A1A"
                  }}>{col.label}</span>
                </div>
                <span style={{
                  background: "rgba(0,0,0,0.15)",
                  color: col.id === "en_ruta" ? "#fff" : "#1A1A1A",
                  borderRadius: "50%",
                  width: "28px", height: "28px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "14px"
                }}>{colOrders.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                {colOrders.length === 0 && (
                  <div style={{
                    textAlign: "center",
                    color: "#bbb",
                    fontSize: "13px",
                    padding: "40px 0",
                    borderRadius: "8px",
                    border: "1.5px dashed #ddd"
                  }}>
                    Suelta un pedido aquí
                  </div>
                )}
                {colOrders.map(order => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={e => handleDragStart(e, order.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: dragId === order.id ? "#ffe0f0" : "#fff",
                      borderRadius: "10px",
                      border: "1px solid #F0D0DC",
                      padding: "12px 14px",
                      cursor: "grab",
                      opacity: dragId === order.id ? 0.55 : 1,
                      boxShadow: dragId === order.id ? "none" : "0 1px 4px rgba(0,0,0,0.07)",
                      transition: "all 0.15s",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <span style={{
                        background: "#8B0A4A",
                        color: "#fff",
                        borderRadius: "5px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.5px"
                      }}>{order.id}</span>
                      <span style={{ color: "#888", fontSize: "11px" }}>{order.hora}</span>
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#1A1A1A", marginBottom: "3px" }}>
                      {order.cliente}
                    </div>
                    <div style={{ fontSize: "12px", color: "#E8176F", marginBottom: "4px", fontWeight: "500" }}>
                      {order.tipo}
                    </div>
                    <div style={{ fontSize: "11px", color: "#777", marginBottom: "6px", lineHeight: "1.4" }}>
                      📍 {order.direccion}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#aaa" }}>⚖️ {order.peso}</span>
                      <span style={{
                        color: "#A8D832",
                        background: "#1A1A1A",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: "700"
                      }}>$ {order.valor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#1A1A1A",
        color: "#888",
        textAlign: "center",
        padding: "16px",
        fontSize: "12px",
        marginTop: "1rem"
      }}>
        <span style={{ color: "#E8176F", fontWeight: "700" }}>FALCON</span> Mensajería Femenina &nbsp;·&nbsp;
        Bucaramanga &nbsp;·&nbsp;
        <span style={{ color: "#A8D832" }}>@mensajeria.femenina</span> &nbsp;·&nbsp;
        Lun–Sáb 6:00am–6:00pm · Dom 8:00am–12:00pm
      </footer>
    </div>
  );
}
