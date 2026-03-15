import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(''); 
    setLoading(true);

    try {
      const data: Record<string, string> = {};
      if (pseudo !== user?.pseudo) data.pseudo = pseudo;
      if (email !== user?.email) data.email = email;
      if (password) data.password = password;

      if (Object.keys(data).length === 0) {
        setError('Aucun changement à enregistrer');
        setLoading(false);
        return;
      }

      const res = await userApi.update(user!.id, data);
      updateUser(res.data.user);
      setSuccess('Profil mis à jour avec succès');
      setPassword('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Mise à jour échouée');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'))
      return;
    try {
      await userApi.delete(user!.id);
      logout();
      navigate('/');
    } catch {
      setError('Échec de la suppression du compte');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Mon Profil</h1>
      </div>

      <div style={{ maxWidth: '500px' }}>
        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Pseudo</label>
                <input
                  type="text"
                  className="form-control"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe (laisser vide pour conserver l'actuel)</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisir un nouveau mot de passe"
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.role || ''}
                  disabled
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Supprimer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
