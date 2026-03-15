import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelApi } from '../services/api';
import { Hotel, Pagination } from '../types';
import { useAuth } from '../context/AuthContext';

const PageHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [chargement, setChargement] = useState(true);
  const [triPar, setTriPar] = useState('createdAt');
  const [ordre, setOrdre] = useState('desc');
  const [filtreNom, setFiltreNom] = useState('');
  const [filtreLocalisation, setFiltreLocalisation] = useState('');
  const [limite, setLimite] = useState(10);
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuth();

  const fetchHotels = async () => {
    setChargement(true);
    try {
      const params: Record<string, string | number> = {
        sortBy: triPar,
        order: ordre,
        limit: limite,
        page,
      };
      if (filtreNom) params.name = filtreNom;
      if (filtreLocalisation) params.location = filtreLocalisation;

      const res = await hotelApi.getAll(params);
      setHotels(res.data.hotels);
      setPagination(res.data.pagination);
    } catch {
      console.error('Échec du chargement des hôtels');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [triPar, ordre, limite, page]);

  const handleSearch = () => {
    setPage(1);
    fetchHotels();
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>Trouvez Votre Séjour Parfait</h1>
        <p>
          Découvrez d'incroyables hôtels autour du monde. Réservez votre prochaine 
          aventure avec Akkor Hôtel.
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary">
            Commencer
          </Link>
        )}
      </div>

      <div className="filters">
        <div className="form-group">
          <label>Rechercher par Nom</label>
          <input
            type="text"
            className="form-control"
            value={filtreNom}
            onChange={(e) => setFiltreNom(e.target.value)}
            placeholder="Nom d'hôtel..."
          />
        </div>
        <div className="form-group">
          <label>Localisation</label>
          <input
            type="text"
            className="form-control"
            value={filtreLocalisation}
            onChange={(e) => setFiltreLocalisation(e.target.value)}
            placeholder="Ville, pays..."
          />
        </div>
        <div className="form-group">
          <label>Trier Par</label>
          <select
            className="form-control"
            value={triPar}
            onChange={(e) => setTriPar(e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="name">Nom</option>
            <option value="location">Localisation</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ordre</label>
          <select
            className="form-control"
            value={ordre}
            onChange={(e) => setOrdre(e.target.value)}
          >
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>
        <div className="form-group">
          <label>Par page</label>
          <select
            className="form-control"
            value={limite}
            onChange={(e) => setLimite(parseInt(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      {chargement ? (
        <div className="loader">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotels/${hotel.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card hotel-card">
                  <div className="hotel-card-image">
                    {hotel.picture_list.length > 0 ? (
                      <img
                        src={hotel.picture_list[0]}
                        alt={hotel.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      '🏨'
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{hotel.name}</h3>
                    <p className="location">{hotel.location}</p>
                    <p className="description">{hotel.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hotels.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Aucun hôtel trouvé. Essayez d'autres critères de recherche.</p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Précédent
              </button>
              <span>
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageHotels;
