import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PageConnexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const res = await authApi.login({ email, password: motDePasse });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErreur(error.response?.data?.message || 'Connexion échouée');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="card-body">
          <h2>Bienvenue</h2>
          {erreur && <div className="alert alert-error">{erreur}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                id="motDePasse"
                type="password"
                className="form-control"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="Votre mot de passe"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={chargement}
            >
              {chargement ? 'Connexion en cours...' : 'Connexion'}
            </button>
          </form>
          <div className="auth-footer">
            Pas encore de compte? <Link to="/register">S'inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageConnexion;
