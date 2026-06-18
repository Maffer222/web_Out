import React, { useState } from 'react';

export default function FormularioOrden({ agregarOrden, vipOrders, normalOrders, currentOrder, history }) {
  const [numeroOrden, setNumeroOrden] = useState('');
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('Normal');
  const [platillo, setPlatillo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones: No permitir campos vacíos o con solo espacios
    if (!numeroOrden.trim() || !cliente.trim() || !platillo.trim()) {
      setError('Todos los campos son obligatorios y no pueden contener solo espacios vacíos.');
      return;
    }

    const orderId = parseInt(numeroOrden.trim(), 10);
    if (isNaN(orderId) || orderId <= 0) {
      setError('El número de orden debe ser un número entero positivo.');
      return;
    }

    // Validación: Número de orden único
    const existeEnVIP = vipOrders.some(order => order.id === orderId);
    const existeEnNormal = normalOrders.some(order => order.id === orderId);
    const existeEnProgreso = currentOrder && currentOrder.id === orderId;
    const existeEnHistorial = history.some(order => order.id === orderId);

    if (existeEnVIP || existeEnNormal || existeEnProgreso || existeEnHistorial) {
      setError('El número de orden ya existe. Debe ser único.');
      return;
    }

    // Al enviar: Crear objeto orden y enviar datos al componente padre
    agregarOrden({
      id: orderId,
      cliente: cliente.trim(),
      tipo,
      platillo: platillo.trim(),
      fecha: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    });

    // Limpiar formulario después de guardar
    setNumeroOrden('');
    setCliente('');
    setTipo('Normal');
    setPlatillo('');
  };

  return (
    <div className="card shadow border-0 h-100">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold text-uppercase"><i className="bi bi-file-earmark-plus me-2 text-warning"></i>Registro de Órdenes</h5>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>{error}</div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold text-secondary">Número de Orden</label>
              <input
                type="number"
                className="form-control form-control-lg"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-secondary">Tipo de Cliente</label>
              <select
                className="form-select form-select-lg"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="Normal">Normal (Cola - FIFO)</option>
                <option value="VIP">VIP (Pila - LIFO)</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold text-secondary">Nombre del Cliente</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Ej: Sofía Rodríguez"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold text-secondary">Platillo Solicitado</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={platillo}
                onChange={(e) => setPlatillo(e.target.value)}
                placeholder="Ej: Pasta Carbonara Premium"
              />
            </div>
            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-dark btn-lg w-100 fw-bold shadow">
                <i className="bi bi-check2-circle me-2"></i>Guardar Orden
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


