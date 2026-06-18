import React from 'react';

export default function ListaVIP({ orders, cancelarOrden }) {
  // Pila (LIFO): La última orden ingresada es la primera en mostrarse y en salir (tope de la pila).
  const displayOrders = [...orders].reverse();

  return (
    <div className="card shadow border-0 h-100">
      <div className="card-header bg-warning text-dark py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-uppercase"><i className="bi bi-crown-fill me-2"></i>Espera VIP</h5>
        <span className="badge bg-dark px-3 py-2 rounded-pill fw-bold">
          {orders.length} en Pila
        </span>
      </div>
      <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {displayOrders.length === 0 ? (
          <div className="text-center text-muted p-4 my-3">
            <i className="bi bi-person-x-fill display-6 text-warning-emphasis mb-2 d-block"></i>
            <p className="mb-0">No hay clientes VIP en espera</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {displayOrders.map((orden, index) => (
              <div 
                key={orden.id} 
                className={`list-group-item p-3 border-0 border-bottom d-flex justify-content-between align-items-center ${index === 0 ? 'bg-warning-subtle fw-semibold' : ''}`}
              >
                <div className="pe-2">
                  <div className="mb-1">
                    <span className="badge bg-secondary me-2">#{orden.id}</span>
                    <span className="text-dark">{orden.cliente}</span>
                    {index === 0 && (
                      <span className="badge bg-danger text-white ms-2 text-uppercase font-monospace">Tope LIFO</span>
                    )}
                  </div>
                  <span className="text-muted small">{orden.platillo}</span>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}><i className="bi bi-clock me-1"></i>Recibido: {orden.fecha}</div>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={() => cancelarOrden(orden.id)}
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




