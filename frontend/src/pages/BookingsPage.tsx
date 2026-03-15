import { useState, useEffect } from 'react';
import { bookingApi } from '../services/api';
import { Booking, Hotel } from '../types';

const PageReservations = () => {
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [chargement, setChargement] = useState(true);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [donneesEdition, setDonneesEdition] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    status: 'pending' as string,
  }); 
  const [erreur, setErreur] = useState('');

  const chargerReservations = async () => {
    try {
      const res = await bookingApi.getAll();
      setReservations(res.data.bookings);
    } catch {
      setErreur('Échec du chargement des réservations');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerReservations();
  }, []);

  const gererEdition = (reservation: Booking) => {
    setEditionId(reservation.id);
    setDonneesEdition({
      checkIn: new Date(reservation.checkIn).toISOString().split('T')[0],
      checkOut: new Date(reservation.checkOut).toISOString().split('T')[0],
      guests: reservation.guests,
      status: reservation.status,
    });
  };

  const gererMiseAJour = async () => {
    if (!editionId) return;
    try {
      await bookingApi.update(editionId, {
        checkIn: new Date(donneesEdition.checkIn).toISOString(),
        checkOut: new Date(donneesEdition.checkOut).toISOString(),
        guests: donneesEdition.guests,
        status: donneesEdition.status,
      });
      setEditionId(null);
      chargerReservations();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErreur(error.response?.data?.message || 'Mise à jour échouée');
    }
  };

  const gererSuppression = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?'))
      return;
    try {
      await bookingApi.delete(id);
      chargerReservations();
    } catch {
      setErreur('Échec de la suppression de la réservation');
    }
  };

  const obtenirBadgeEtat = (etat: string) => {
    const libelle =
      etat === 'confirmed' ? 'Confirmé' : etat === 'cancelled' ? 'Annulé' : 'En attente';
    return <span className={`badge badge-${etat}`}>{libelle}</span>;
  };

  const obtenirNomHotel = (reservation: Booking) => {
    if (reservation.hotel) {
      return reservation.hotel.name;
    }
    return 'Hôtel Inconnu';
  };

  const obtenirLocalisationHotel = (reservation: Booking) => {
    if (reservation.hotel) {
      return reservation.hotel.location;
    }
    return '';
  };

  if (chargement) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Mes Réservations</h1>
      </div>

      {erreur && <div className="alert alert-error">{erreur}</div>}

      {reservations.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Vous n'avez pas encore de réservations.</p>
            <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Parcourir les Hôtels
            </a>
          </div>
        </div>
      ) : (
        <div className="booking-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="card">
              <div className="card-body booking-card">
                {editionId === reservation.id ? (
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div className="form-group">
                        <label>Arrivée</label>
                        <input
                          type="date"
                          className="form-control"
                          value={donneesEdition.checkIn}
                          onChange={(e) =>
                            setDonneesEdition({ ...donneesEdition, checkIn: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Départ</label>
                        <input
                          type="date"
                          className="form-control"
                          value={donneesEdition.checkOut}
                          onChange={(e) =>
                            setDonneesEdition({ ...donneesEdition, checkOut: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Voyageurs</label>
                        <input
                          type="number"
                          className="form-control"
                          value={donneesEdition.guests}
                          onChange={(e) =>
                            setDonneesEdition({
                              ...donneesEdition,
                              guests: parseInt(e.target.value),
                            })
                          }
                          min={1}
                          max={20}
                        />
                      </div>
                      <div className="form-group">
                        <label>État</label>
                        <select
                          className="form-control"
                          value={donneesEdition.status}
                          onChange={(e) =>
                            setDonneesEdition({ ...donneesEdition, status: e.target.value })
                          }
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button className="btn btn-primary btn-sm" onClick={gererMiseAJour}>
                        Enregistrer
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditionId(null)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="booking-info">
                      <h3>{obtenirNomHotel(reservation)}</h3>
                      <p>{obtenirLocalisationHotel(reservation)}</p>
                      <p>
                        {new Date(reservation.checkIn).toLocaleDateString('fr-FR')} →{' '}
                        {new Date(reservation.checkOut).toLocaleDateString('fr-FR')}
                      </p>
                      <p>{reservation.guests} voyageur(s)</p>
                      <p>{obtenirBadgeEtat(reservation.status)}</p>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => gererEdition(reservation)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => gererSuppression(reservation.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageReservations;
