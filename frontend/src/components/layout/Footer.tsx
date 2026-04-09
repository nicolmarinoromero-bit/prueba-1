import footerImage from '@assets/images/FOOTER.jpeg';

interface FooterProps {
  compact?: boolean;
}

const Footer = ({ compact = false }: FooterProps) => {
  return (
    <footer className={compact ? 'footer-compact' : ''}>
      <div className="footer-top">
        <div className="footer-item left">
          <p>📞 +57 3150548392 | +57 3225681611</p>
        </div>
        <div className="footer-item center">
          <p>📍 CR 100 C # 100 N</p>
        </div>
        <div className="footer-item right">
          <p>✉️ neodomus29@gmail.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-img">
          <img src={footerImage} alt="logo" />
        </div>
        <p>© 2025 NEODOMUS</p>
      </div>
    </footer>
  );
};

export default Footer;