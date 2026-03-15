import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const estActif = (chemin: string) =>
    location.pathname === chemin ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Akkor Hôtel 
        </Link>
        <div className="navbar-links">
          <Link to="/" className={estActif('/')}>
            Hôtels
          </Link>
          {isAuthenticated && (
            <Link to="/bookings" className={estActif('/bookings')}>
              Mes Réservations
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={estActif('/admin')}>
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="navbar-user">
              <Link to="/profile" className={estActif('/profile')}>
                {user?.pseudo}
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={`btn btn-secondary btn-sm`}>
                Connexion
              </Link>
              <Link to="/register" className={`btn btn-primary btn-sm`}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
