import { useState, useEffect, FormEvent } from 'react';
import { hotelApi, userApi, bookingApi } from '../services/api';
import { Hotel, User, Booking } from '../types';

const traduireRole = (role: string) => {
  if (role === 'admin') return 'Administrateur';
  if (role === 'employee') return 'Employé';
  return 'Utilisateur';
};

const traduireStatutReservation = (statut: string) => {
  if (statut === 'confirmed') return 'Confirmé';
  if (statut === 'cancelled') return 'Annulé';
  return 'En attente';
};
 
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'hotels' | 'users' | 'bookings'>('hotels');

  return (
    <div className="container">
      <div className="page-header">
        <h1>Tableau de Bord Admin</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'hotels' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('hotels')}
        >
          Hôtels
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Réservations
        </button>
      </div>

      {activeTab === 'hotels' && <AdminHotels />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'bookings' && <AdminBookings />}
    </div>
  );
};

const AdminHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    picture_list: '',
  });
  const [error, setError] = useState('');

  const fetchHotels = async () => {
    const res = await hotelApi.getAll({ limit: 100 });
    setHotels(res.data.hotels);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const data = {
      name: form.name,
      location: form.location,
      description: form.description,
      picture_list: form.picture_list
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await hotelApi.update(editingId, data);
      } else {
        await hotelApi.create(data);
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', location: '', description: '', picture_list: '' });
      fetchHotels();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Opération échouée');
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingId(hotel.id);
    setForm({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      picture_list: hotel.picture_list.join('\n'),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet hôtel ?')) return;
    await hotelApi.delete(id);
    fetchHotels();
  };

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', location: '', description: '', picture_list: '' }); }}>
          + Ajouter un Hôtel
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3>{editingId ? 'Modifier un hôtel' : 'Nouvel hôtel'}</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Localisation</label>
                <input type="text" className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>URLs des images (une par ligne)</label>
                <textarea className="form-control" value={form.picture_list} onChange={(e) => setForm({ ...form, picture_list: e.target.value })} placeholder="https://example.com/pic1.jpg" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Localisation</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.location}</td>
                <td>{hotel.picture_list.length}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(hotel)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(hotel.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await userApi.getAll();
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="table-container card">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Pseudo</th>
            <th>Rôle</th>
            <th>Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.pseudo}</td>
              <td>
                <span className={`badge badge-${user.role === 'admin' ? 'confirmed' : user.role === 'employee' ? 'pending' : 'cancelled'}`}>
                  {traduireRole(user.role)}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchEmail, setSearchEmail] = useState('');

  const fetchBookings = async (email?: string) => {
    const params: Record<string, string> = {};
    if (email) params.email = email;
    const res = await bookingApi.search(params);
    setBookings(res.data.bookings);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = () => {
    fetchBookings(searchEmail);
  };

  return (
    <>
      <div className="filters" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Rechercher par email</label>
          <input type="text" className="form-control" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="user@example.com" />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Hôtel</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Voyageurs</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const user = booking.user || null;
              const hotel = booking.hotel || null;
              return (
                <tr key={booking.id}>
                  <td>{user?.email || 'N/D'}</td>
                  <td>{hotel?.name || 'N/D'}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td>
                  <td>{booking.guests}</td>
                  <td>
                    <span className={`badge badge-${booking.status}`}>
                      {traduireStatutReservation(booking.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPage;
