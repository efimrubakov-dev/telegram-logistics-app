import './Header.css';
import logoImage from '../assets/logo.png';

interface HeaderProps {
  onMenuClick: () => void;
  onLogoClick: () => void;
  onProfileClick: () => void;
}

function Header({ onMenuClick, onLogoClick, onProfileClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-logo" onClick={onLogoClick}>
        <img 
          src={logoImage} 
          alt="ES Р›РѕРіРёСЃС‚РёРєР°" 
          className="logo-image"
        />
      </div>
      
      <div className="header-actions">
        <button 
          className="header-profile-btn" 
          onClick={onProfileClick}
          aria-label="РџСЂРѕС„РёР»СЊ"
        >
          <svg className="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2"/>
            <path d="M5 20c0-4 3-7 7-7s7 3 7 7" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button 
          className="header-menu-btn" 
          onClick={onMenuClick}
          aria-label="РњРµРЅСЋ"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
