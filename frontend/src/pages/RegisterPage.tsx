import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PageInscription = () => {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur('');
 
    if (motDePasse !== confirmerMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }

    setChargement(true);

    try {
      const res = await authApi.register({ email, pseudo, password: motDePasse });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Array<{ message: string }> } } };
      if (error.response?.data?.errors) {
        setErreur(error.response.data.errors.map((e) => e.message).join(', '));
      } else {
        setErreur(error.response?.data?.message || 'Inscription échouée');
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="card-body">
          <h2>Créer un Compte</h2>
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
              <label htmlFor="pseudo">Pseudo</label>
              <input
                id="pseudo"
                type="text"
                className="form-control"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Choisir un pseudo"
                required
                minLength={2}
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
                placeholder="Créer un mot de passe"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmerMotDePasse">Confirmer le mot de passe</label>
              <input
                id="confirmerMotDePasse"
                type="password"
                className="form-control"
                value={confirmerMotDePasse}
                onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                placeholder="Confirmer votre mot de passe"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={chargement}
            >
              {chargement ? 'Création du compte...' : 'S\'inscrire'}
            </button>
          </form>
          <div className="auth-footer">
            Vous avez déjà un compte? <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageInscription;
