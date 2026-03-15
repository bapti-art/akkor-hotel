import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi, bookingApi } from '../services/api';
import { Hotel } from '../types';
import { useAuth } from '../context/AuthContext';

const PageDetailsHotel = () => {
  const { id } = useParams<{ id: string }>();
  const hotelId = id || '';
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [chargement, setChargement] = useState(true);
  const [affichageReservation, setAffichageReservation] = useState(false);
  const [dateArrivee, setDateArrivee] = useState('');
  const [dateDepart, setDateDepart] = useState('');
  const [voyageurs, setVoyageurs] = useState(1);
  const [erreurReservation, setErreurReservation] = useState('');
  const [successReservation, setSuccessReservation] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) {
        navigate('/');
        setChargement(false);
        return;
      }

      try {
        const res = await hotelApi.getById(hotelId);
        setHotel(res.data.hotel); 
      } catch {
        navigate('/');
      } finally {
        setChargement(false);
      }
    };
    fetchHotel();
  }, [hotelId, navigate]);

  const handleBooking = async () => {
    setErreurReservation('');
    setSuccessReservation('');

    if (!dateArrivee || !dateDepart || !voyageurs) {
      setErreurReservation('Veuillez remplir tous les champs');
      return;
    }

    try {
      await bookingApi.create({
        hotelId,
        checkIn: new Date(dateArrivee).toISOString(),
        checkOut: new Date(dateDepart).toISOString(),
        guests: voyageurs,
      });
      setSuccessReservation('Réservation créée avec succès!');
      setAffichageReservation(false);
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErreurReservation(error.response?.data?.message || 'Réservation échouée');
    }
  };

  if (chargement) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="hotel-card-image" style={{ height: '300px' }}>
          {hotel.picture_list.length > 0 ? (
            <img
              src={hotel.picture_list[0]}
              alt={hotel.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            '🏨'
          )}
        </div>
        <div className="card-body">
          <h1>{hotel.name}</h1>
          <p className="location" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>
            {hotel.location}
          </p>
          <p style={{ margin: '1rem 0', lineHeight: '1.8' }}>
            {hotel.description}
          </p>

          {hotel.picture_list.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
              {hotel.picture_list.map((pic, i) => (
                <img
                  key={i}
                  src={pic}
                  alt={`${hotel.name} ${i + 1}`}
                  style={{
                    width: '120px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}

          {successReservation && (
            <div className="alert alert-success">{successReservation}</div>
          )}

          {isAuthenticated ? (
            !affichageReservation ? (
              <button
                className="btn btn-primary"
                onClick={() => setAffichageReservation(true)}
              >
                Réserver Maintenant
              </button>
            ) : (
              <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header">
                  <h3>Effectuer une Réservation</h3>
                </div>
                <div className="card-body">
                  {erreurReservation && (
                    <div className="alert alert-error">{erreurReservation}</div>
                  )}
                  <div className="form-group">
                    <label>Date d'Arrivée</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateArrivee}
                      onChange={(e) => setDateArrivee(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de Départ</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateDepart}
                      onChange={(e) => setDateDepart(e.target.value)}
                      min={dateArrivee || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Voyageurs</label>
                    <input
                      type="number"
                      className="form-control"
                      value={voyageurs}
                      onChange={(e) => setVoyageurs(parseInt(e.target.value))}
                      min={1}
                      max={20}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={handleBooking}>
                      Confirmer la Réservation
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setAffichageReservation(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
              <a href="/login">Connectez-vous</a> pour réserver cet hôtel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageDetailsHotel;
