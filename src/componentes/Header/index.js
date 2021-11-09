import './style.css';
import Logo from '../../assets/logo.svg';

export function Header() {
  return (
    <div className="container-header">
      <img className='logo' src={Logo} alt="logo" />
    </div>
  )
} 

export default Header;