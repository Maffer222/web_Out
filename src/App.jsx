import { useState, useEffect } from 'react';
import FormularioOrden from './components/FormularioOrden';
import ListaVIP from './components/ListaVIP';
import ListaNormales from './components/ListaNormales';
import OrdenPreparacion from './components/OrdenPreparacion';
import Estadisticas from './components/Estadisticas';

function App() {
  // ── Estados (con carga inicial desde localStorage) ──────────────────────────
  const [vipOrders, setVipOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rv_vipOrders')) ?? []; }
    catch { return []; }
  }); // Pila LIFO

  const [normalOrders, setNormalOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rv_normalOrders')) ?? []; }
    catch { return []; }
  }); // Cola FIFO

  const [currentOrder, setCurrentOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rv_currentOrder')) ?? null; }
    catch { return null; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rv_history')) ?? []; }
    catch { return []; }
  });

  // ── Persistencia en localStorage ──────────────────────────────────────────
  useEffect(() => { localStorage.setItem('rv_vipOrders', JSON.stringify(vipOrders)); }, [vipOrders]);
  useEffect(() => { localStorage.setItem('rv_normalOrders', JSON.stringify(normalOrders)); }, [normalOrders]);
  useEffect(() => { localStorage.setItem('rv_currentOrder', JSON.stringify(currentOrder)); }, [currentOrder]);
  useEffect(() => { localStorage.setItem('rv_history', JSON.stringify(history)); }, [history]);

  // ── Agregar orden ──────────────────────────────────────────────────────────
  // Recibe un objeto orden con al menos { id, nombre, tipo: 'VIP' | 'Normal', ... }
  const agregarOrden = (orden) => {
    if (orden.tipo === 'VIP') {
      // Pila LIFO: push al final → pop del final
      setVipOrders((prev) => [...prev, orden]);
    } else {
      // Cola FIFO: push al final → shift del frente
      setNormalOrders((prev) => [...prev, orden]);
    }
  };

  // ── Cancelar orden ────────────────────────────────────────────────────────
  const cancelarOrden = (id, tipo) => {
    if (tipo === 'VIP') {
      setVipOrders((prev) => prev.filter((o) => o.id !== id));
    } else {
      setNormalOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // ── Atender siguiente orden ───────────────────────────────────────────────
  // Siempre prioriza VIP (LIFO: último en entrar, primero en salir)
  // Si no hay VIP, atiende Normal (FIFO: primero en entrar, primero en salir)
  const atenderSiguienteOrden = () => {
    // Guardar orden actual en historial si existe
    if (currentOrder) {
      setHistory((prev) => [...prev, { ...currentOrder, atendidaEn: new Date().toLocaleTimeString() }]);
    }

    if (vipOrders.length > 0) {
      // LIFO: tomar el último elemento (pop)
      const nuevaVip = [...vipOrders];
      const siguiente = nuevaVip.pop();
      setVipOrders(nuevaVip);
      setCurrentOrder(siguiente);
    } else if (normalOrders.length > 0) {
      // FIFO: tomar el primer elemento (shift)
      const [siguiente, ...resto] = normalOrders;
      setNormalOrders(resto);
      setCurrentOrder(siguiente);
    } else {
      // No hay órdenes pendientes
      setCurrentOrder(null);
    }
  };

  // ── ¿Hay órdenes pendientes? ──────────────────────────────────────────────
  const tienePendientes = vipOrders.length > 0 || normalOrders.length > 0;

  // ── Reiniciar sistema ─────────────────────────────────────────────────────
  const reiniciarSistema = () => {
    const confirmado = window.confirm(
      '⚠️ ¿Estás seguro de que deseas reiniciar el sistema?\n\nSe eliminarán todas las órdenes, el historial y los datos guardados. Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;

    // Vaciar estados
    setVipOrders([]);
    setNormalOrders([]);
    setCurrentOrder(null);
    setHistory([]);

    // Eliminar claves de localStorage
    localStorage.removeItem('rv_vipOrders');
    localStorage.removeItem('rv_normalOrders');
    localStorage.removeItem('rv_currentOrder');
    localStorage.removeItem('rv_history');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid py-4">

      {/* Encabezado */}
      <div className="row mb-4 align-items-center">
        <div className="col text-center position-relative">
          <h1 className="display-5 fw-bold">
            🍽️ <span className="text-danger">Piacere di Sapori</span> <span className="text-warning">VIP</span>
          </h1>
          <p className="text-muted mb-0">Sistema de gestión de órdenes</p>
          <button
            id="btn-reiniciar"
            className="btn btn-outline-primary btn-sm position-absolute top-0 end-0 mt-1 me-2"
            onClick={reiniciarSistema}
            title="Reiniciar sistema"
          >
            🗑️ Reiniciar Sistema
          </button>
        </div>
      </div>

      {/* ── Fila 1: Formulario ──────────────────────────────────────────── */}
      <div className="row mb-4 justify-content-center">
        <div className="col-12 col-lg-8">
          <FormularioOrden
            agregarOrden={agregarOrden}
            vipOrders={vipOrders}
            normalOrders={normalOrders}
            currentOrder={currentOrder}
            history={history}
          />
        </div>
      </div>

      {/* ── Fila 2: ListaVIP | OrdenPreparacion | ListaNormales ─────────── */}
      <div className="row mb-4 g-3">
        <div className="col-12 col-md-4">
          <ListaVIP
            orders={vipOrders}
            cancelarOrden={(id) => cancelarOrden(id, 'VIP')}
          />
        </div>

        <div className="col-12 col-md-4">
          <OrdenPreparacion
            currentOrder={currentOrder}
            atenderSiguienteOrden={atenderSiguienteOrden}
            tienePendientes={tienePendientes}
          />
        </div>

        <div className="col-12 col-md-4">
          <ListaNormales
            orders={normalOrders}
            cancelarOrden={(id) => cancelarOrden(id, 'Normal')}
          />
        </div>
      </div>

      {/* ── Fila 3: Estadisticas ────────────────────────────────────────── */}
      <div className="row">
        <div className="col-12">
          <Estadisticas
            vipOrders={vipOrders}
            normalOrders={normalOrders}
            currentOrder={currentOrder}
            history={history}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
