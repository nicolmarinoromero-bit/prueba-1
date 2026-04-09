import NavbarLanding from '@components/layout/NavbarLanding';
import Footer from '@components/layout/Footer';
import fondo from '@assets/images/FONDO.png'; // importa la imagen

const Home = () => {
  return (
    <>
      <NavbarLanding />
      <div className="hero" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="overlay">
          <h1>Neodomus</h1>
          <h3>NEODOMUS más que tecnología, una evolución.</h3>
          <p>
            En NEODOMUS ofrecemos soluciones integrales en tecnología,
                innovación y gestión de servicios, diseñadas para mejorar la
                seguridad, eficiencia y confianza de nuestros clientes
                </p>
          <button onClick={() => window.location.href = '/register'}>Comenzar</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;