import { useState, useEffect } from 'react';
import Navbar from '@components/layout/ClientNavbar';
import Footer from '@components/layout/Footer';
import api from '@services/api';
import '../../styles/client-dashboard.css';
import fondoImg from '../../assets/images/Fondo2.png';
import carritoIcon from '../../assets/images/Carrito.png';

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio_venta_producto: number;
  imagen_url?: string | null;
}

const ClientDashboard = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos/');
        setProductos(response.data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const getImagen = (producto: Producto) => {
    if (producto.imagen_url) return producto.imagen_url;
    const nombre = producto.nombre_producto.toLowerCase();
    // Mapeo por nombre (ajusta según los nombres reales de tus productos en la BD)
    if (nombre.includes('bateria') || nombre.includes('batería')) return '/imagenes/bateria-18650.jpg';
    if (nombre.includes('cable')) return '/imagenes/cable-utp.jpg';
    if (nombre.includes('cámara') || nombre.includes('camara')) return '/imagenes/camara-ip.jpg';
    if (nombre.includes('controlador')) return '/imagenes/controladorj.jpg';
    if (nombre.includes('detector') && nombre.includes('humo')) return '/imagenes/detector-humo.jpg';
    if (nombre.includes('enchufe')) return '/imagenes/Enchufe.webp';
    if (nombre.includes('fuente')) return '/imagenes/fuente-poder.jpg';
    if (nombre.includes('interruptor')) return '/imagenes/interruptor.jpg';
    if (nombre.includes('kit')) return '/imagenes/kit-automacion.jpg';
    if (nombre.includes('led')) return '/imagenes/led-rgb.jpg';
    if (nombre.includes('panel') && nombre.includes('táctil')) return '/imagenes/panel-tactil.jpg';
    if (nombre.includes('persiana')) return '/imagenes/persiana.jpg';
    if (nombre.includes('sensor') && nombre.includes('pir')) return '/imagenes/Sensor-pir.jpg';
    if (nombre.includes('sirena')) return '/imagenes/sirena.jpg';
    if (nombre.includes('termostato')) return '/imagenes/termostato.jpg';
    // Si no coincide, imagen por defecto
    return '/imagenes/default.png';
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProductos = filteredProductos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <main className="productos-page">
        <img src={fondoImg} className="fondo" alt="Fondo" />
        <section className="productos">
          <div className="barra-superior">
            <div className="buscador">
              <span className="icono-buscar">🔍</span>
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="controls-right">
              <select className="select-paginas" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={8}>8 por página</option>
                <option value={16}>16 por página</option>
                <option value={24}>24 por página</option>
              </select>
              <button className="btn-categoria">Categorías ▼</button>
            </div>
          </div>

          {currentProductos.length === 0 ? (
            <div className="loading">No hay productos que coincidan con la búsqueda.</div>
          ) : (
            <>
              <div className="productos-grid">
                {currentProductos.map((producto) => (
                  <div key={producto.id_producto} className="card-producto">
                    <div className="img-contenedor">
                      <img src={getImagen(producto)} alt={producto.nombre_producto} className="img-producto" />
                    </div>
                    <div className="info-producto">
                      <h3>{producto.nombre_producto}</h3>
                      <p className="precio">${producto.precio_venta_producto?.toLocaleString()}</p>
                      <div className="acciones-producto">
                        <button className="btn-comprar">COMPRAR</button>
                        <div className="lado-derecho">
                          <button className="btn-mas">+</button>
                          <span className="cantidad">1</span>
                          <button className="btn-menos">-</button>
                          <img src={carritoIcon} alt="Carrito" className="icono-carrito" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="paginacion">
                  <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>◀◀</button>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>◀</button>
                  {getPageNumbers().map((item, idx) => (
                    <button
                      key={idx}
                      className={item === currentPage ? 'active' : ''}
                      onClick={() => typeof item === 'number' && handlePageChange(item)}
                      disabled={item === '...'}
                    >
                      {item}
                    </button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>▶</button>
                  <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>▶▶</button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ClientDashboard;