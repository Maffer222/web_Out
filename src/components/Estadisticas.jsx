import React from 'react';

export default function Estadisticas({ vipOrders, normalOrders, currentOrder, history }) {
  // 1. Órdenes atendidas
  const atendidas = history.length;

  // 2. Órdenes pendientes (en espera + en preparación)
  const pendientes = vipOrders.length + normalOrders.length + (currentOrder ? 1 : 0);

  // 3. Totales por tipo (VIP y Normal) a lo largo de toda la sesión (historial + pendientes + preparación)
  const totalVIP = vipOrders.length +
    history.filter(o => o.tipo === 'VIP').length +
    (currentOrder && currentOrder.tipo === 'VIP' ? 1 : 0);

  const totalNormal = normalOrders.length +
    history.filter(o => o.tipo === 'Normal').length +
    (currentOrder && currentOrder.tipo === 'Normal' ? 1 : 0);

  // 4. Total de órdenes registradas
  const totalRegistradas = totalVIP + totalNormal;

  // Reversa del historial para ver el último atendido arriba
  const displayHistory = [...history].reverse();

  return (
    <div className="estadisticas mt-4">
      <h3 className="mb-3 fw-bold text-uppercase text-secondary"><i className="bi bi-bar-chart-fill me-2 text-dark"></i>Métricas y Estadísticas</h3>

      {/* Grid de Bootstrap Cards */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total Registradas */}
        <div className="col-md-4 col-sm-6">
          <div className="card border-0 shadow text-white bg-dark h-100">
            <div className="card-body text-center py-4">
              <h6 className="card-subtitle mb-2 text-uppercase text-secondary fw-semibold"><small>Total Registradas</small></h6>
              <h2 className="card-title display-6 fw-bold">{totalRegistradas}</h2>
            </div>
          </div>
        </div>

        {/* Card 2: Pendientes */}
        <div className="col-md-4 col-sm-6">
          <div className="card border-0 shadow text-white bg-info h-100">
            <div className="card-body text-center py-4">
              <h6 className="card-subtitle mb-2 text-uppercase text-white-50 fw-semibold"><small>Órdenes Pendientes</small></h6>
              <h2 className="card-title display-6 fw-bold">{pendientes}</h2>
              <p className="card-text mb-0"><small>({vipOrders.length} VIP, {normalOrders.length} Normal)</small></p>
            </div>
          </div>
        </div>

        {/* Card 3: Atendidas */}
        <div className="col-md-4 col-sm-6">
          <div className="card border-0 shadow text-white bg-success h-100">
            <div className="card-body text-center py-4">
              <h6 className="card-subtitle mb-2 text-uppercase text-white-50 fw-semibold"><small>Órdenes Atendidas</small></h6>
              <h2 className="card-title display-6 fw-bold">{atendidas}</h2>
            </div>
          </div>
        </div>

        {/* Card 4: Total VIP */}
        <div className="col-md-6 col-sm-6">
          <div className="card border-0 shadow border-start border-warning border-5 h-100">
            <div className="card-body text-center text-dark py-4">
              <h6 className="card-subtitle mb-2 text-uppercase text-warning fw-bold"><small>Total Órdenes VIP</small></h6>
              <h2 className="card-title display-6 fw-bold text-warning-emphasis">{totalVIP}</h2>
            </div>
          </div>
        </div>

        {/* Card 5: Total Normales */}
        <div className="col-md-6 col-sm-6">
          <div className="card border-0 shadow border-start border-primary border-5 h-100">
            <div className="card-body text-center text-dark py-4">
              <h6 className="card-subtitle mb-2 text-uppercase text-primary fw-bold"><small>Total Órdenes Normales</small></h6>
              <h2 className="card-title display-6 fw-bold text-primary-emphasis">{totalNormal}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Órdenes */}
      <div className="card border-0 shadow">
        <div className="card-header bg-secondary text-white py-3">
          <h5 className="mb-0 fw-bold text-uppercase"><i className="bi bi-clock-history me-2"></i>Historial de Órdenes Atendidas</h5>
        </div>
        <div className="card-body">
          {displayHistory.length === 0 ? (
            <p className="text-muted text-center mb-0 my-3">No se ha atendido ninguna orden todavía.</p>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <table className="table table-striped table-hover mb-0">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Cliente</th>
                    <th>Categoría</th>
                    <th>Platillo</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {displayHistory.map((orden) => (
                    <tr key={orden.id} className="align-middle">
                      <td><strong>#{orden.id}</strong></td>
                      <td>{orden.cliente}</td>
                      <td>
                        <span className={`badge ${orden.tipo === 'VIP' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                          {orden.tipo === 'VIP' ? 'Cliente VIP' : 'Cliente Normal'}
                        </span>
                      </td>
                      <td>{orden.platillo}</td>
                      <td><small className="text-muted">{orden.fecha}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


