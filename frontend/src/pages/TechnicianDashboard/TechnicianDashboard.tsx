import { useState, useEffect } from 'react';
import TechnicianNavbar from '@components/layout/TechnicianNavbar';
import Footer from '@components/layout/Footer';
import '../../styles/technician-dashboard.css';
import fondoImg from '../../assets/images/Fondo2.png';

interface Cita {
  id: number;
  hora: string;
  tipo: string;
  estado: 'programada' | 'cancelada' | 'reprogramada';
  cliente: string;
  direccion: string;
  telefono: string;
  observaciones?: string;
}

// Datos simulados (luego conectarás con el backend)
const citasMock: Cita[] = [
  { id: 1, hora: '8:00 am', tipo: 'Mantenimiento', estado: 'programada', cliente: 'Laura García', direccion: 'Cra 10 #12-34', telefono: '3001234567' },
  { id: 2, hora: '9:00 am', tipo: 'Mantenimiento', estado: 'programada', cliente: 'Daniela Ramírez', direccion: 'Av 30 #15-09', telefono: '3023456789' },
  { id: 3, hora: '10:00 am', tipo: 'Mantenimiento', estado: 'programada', cliente: 'Andrés González', direccion: 'Mz A Casa 10', telefono: '3034567890' },
  { id: 4, hora: '11:00 am', tipo: 'Mantenimiento', estado: 'programada', cliente: 'Mariana Suárez', direccion: 'Cl 8B #20-45', telefono: '3045678901', observaciones: 'Cliente solicita revisión de enchufes' },
  { id: 5, hora: '11:00 am', tipo: 'Instalación', estado: 'cancelada', cliente: 'Natalia Castro', direccion: 'Cl 19 #13-55', telefono: '3067890123' },
  { id: 6, hora: '4:00 am', tipo: 'Instalación', estado: 'cancelada', cliente: 'Felipe Martínez', direccion: 'Av 68 #54-23', telefono: '3078901234' },
  { id: 7, hora: '6:00 am', tipo: 'Instalación', estado: 'cancelada', cliente: 'Camila Ortiz', direccion: 'Cl 100 #25-10', telefono: '3089012345' },
  { id: 8, hora: '5:00 am', tipo: 'Instalación', estado: 'reprogramada', cliente: 'Sebastián López', direccion: 'Cra 7 #89-12', telefono: '3090123456' },
];

const TechnicianDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      setCitas(citasMock);
      setLoading(false);
    }, 1000);
  }, []);

  const citasProgramadas = citas.filter(c => c.estado === 'programada');
  const citasCanceladas = citas.filter(c => c.estado === 'cancelada');
  const citasReprogramadas = citas.filter(c => c.estado === 'reprogramada');

  const openModal = (cita: Cita) => {
    setSelectedCita(cita);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCita(null);
  };

  const updateEstado = (id: number, nuevoEstado: 'programada' | 'cancelada' | 'reprogramada') => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    closeModal();
    // Aquí luego llamarás a la API para actualizar en el backend
  };

  return (
    <>
      <TechnicianNavbar />
      <main className="technician-container">
        <img src={fondoImg} className="fondo" alt="Fondo" />
        <h1>Citas del día</h1>
        {loading ? (
          <div className="loading-message">Cargando citas...</div>
        ) : (
          <div className="cards">
            {/* Citas programadas */}
            <div className="card">
              <h2>citas programadas</h2>
              {citasProgramadas.length === 0 ? (
                <p className="empty-message">No hay citas programadas</p>
              ) : (
                citasProgramadas.map(cita => (
                  <div key={cita.id} className="item">
                    <span>✔ {cita.hora} {cita.tipo}</span>
                    <button className="btn-arrow" onClick={() => openModal(cita)}>➜</button>
                  </div>
                ))
              )}
            </div>

            {/* Citas canceladas */}
            <div className="card">
              <h2>citas canceladas</h2>
              {citasCanceladas.length === 0 ? (
                <p className="empty-message">No hay citas canceladas</p>
              ) : (
                citasCanceladas.map(cita => (
                  <div key={cita.id} className="item">
                    <span>✔ {cita.hora} {cita.tipo}</span>
                    <button className="btn-arrow" onClick={() => openModal(cita)}>➜</button>
                  </div>
                ))
              )}
            </div>

            {/* Citas reprogramadas */}
            <div className="card">
              <h2>citas reprogramadas</h2>
              {citasReprogramadas.length === 0 ? (
                <p className="empty-message">No hay citas reprogramadas</p>
              ) : (
                citasReprogramadas.map(cita => (
                  <div key={cita.id} className="item">
                    <span>✔ {cita.hora} {cita.tipo}</span>
                    <button className="btn-arrow" onClick={() => openModal(cita)}>➜</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal de detalle */}
      {modalOpen && selectedCita && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle de cita</h3>
            <p><strong>Cliente:</strong> {selectedCita.cliente}</p>
            <p><strong>Dirección:</strong> {selectedCita.direccion}</p>
            <p><strong>Teléfono:</strong> {selectedCita.telefono}</p>
            <p><strong>Hora:</strong> {selectedCita.hora}</p>
            <p><strong>Tipo:</strong> {selectedCita.tipo}</p>
            <p><strong>Estado:</strong> {selectedCita.estado}</p>
            {selectedCita.observaciones && <p><strong>Observaciones:</strong> {selectedCita.observaciones}</p>}
            <div className="modal-buttons">
              <button onClick={() => updateEstado(selectedCita.id, 'programada')} className="btn-estado">Marcar programada</button>
              <button onClick={() => updateEstado(selectedCita.id, 'cancelada')} className="btn-estado cancelar">Marcar cancelada</button>
              <button onClick={() => updateEstado(selectedCita.id, 'reprogramada')} className="btn-estado">Marcar reprogramada</button>
              <button onClick={closeModal} className="btn-cerrar">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default TechnicianDashboard;