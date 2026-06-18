import React from 'react';

export default function OrdenPreparacion({ currentOrder, atenderSiguienteOrden, tienePendientes }) {
  return (
    <div className="card shadow border-0 h-100">
      <div className="card-header bg-success text-white py-3">
        <h5 className="mb-0 text-center fw-bold text-uppercase"><i className="bi bi-fire me-2 text-warning animate-pulse"></i>Cocina - En Preparación</h5>
      </div>
      <div className="card-body d-flex flex-column justify-content-center py-4 px-3">
        {currentOrder ? (
          <div className="text-center my-2">
            <span className={`badge mb-3 px-3 py-2 fs-6 rounded-pill ${currentOrder.tipo === 'VIP' ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
              <i className={`bi ${currentOrder.tipo === 'VIP' ? 'bi-crown-fill' : 'bi-person-fill'} me-1`}></i>Cliente {currentOrder.tipo}
            </span>
            <h3 className="card-title text-success fw-bold mb-1">Orden #{currentOrder.id}</h3>
            <h4 className="text-dark mb-3">{currentOrder.cliente}</h4>
            
            <div className="p-3 bg-light rounded-3 border mb-3">
              <h6 className="text-uppercase text-muted fw-bold mb-1"><small>Platillo Solicitado</small></h6>
              <p className="fs-5 mb-0 text-dark fw-bold">{currentOrder.platillo}</p>
            </div>
            <p className="text-muted mb-0"><small><i className="bi bi-clock-fill me-1"></i>Iniciada: {currentOrder.fecha}</small></p>
          </div>
        ) : (
          <div className="text-center my-4 py-3 text-muted">
            <div className="mb-3">
              <span className="display-4 text-secondary">&#127859;</span>
            </div>
            <p className="fs-5 mb-0 font-monospace">No hay órdenes en preparación</p>
          </div>
        )}
      </div>
      <div className="card-footer bg-transparent border-0 p-3">
        <button 
          className="btn btn-success btn-lg w-100 fw-bold shadow py-3"
          onClick={atenderSiguienteOrden}
          disabled={!currentOrder && !tienePendientes}
        >
          {currentOrder 
            ? (tienePendientes ? 'Atender Siguiente Orden' : 'Finalizar Orden Actual')
            : 'Atender Siguiente Orden'}
        </button>
      </div>
    </div>
  );
}



