import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { describe, it, expect, beforeEach } from 'vitest';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}; 

describe('Barre de navigation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devrait afficher le nom de la marque', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Akkor Hôtel')).toBeInTheDocument();
  });

  it('devrait afficher connexion/inscription si non authentifié', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it('devrait afficher le lien hôtels', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Hôtels')).toBeInTheDocument();
  });

  it('devrait afficher les infos utilisateur si authentifié', () => {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@test.com',
      pseudo: 'testuser',
      role: 'user',
    }));
    localStorage.setItem('token', 'fake-token');

    renderWithProviders(<Navbar />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  it('devrait afficher mes réservations si authentifié', () => {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@test.com',
      pseudo: 'testuser',
      role: 'user',
    }));
    localStorage.setItem('token', 'fake-token');

    renderWithProviders(<Navbar />);
    expect(screen.getByText('Mes Réservations')).toBeInTheDocument();
  });

  it('devrait afficher le lien admin pour un administrateur', () => {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'admin@test.com',
      pseudo: 'admin',
      role: 'admin',
    }));
    localStorage.setItem('token', 'fake-token');

    renderWithProviders(<Navbar />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('ne devrait pas afficher le lien admin pour un utilisateur standard', () => {
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'user@test.com',
      pseudo: 'user',
      role: 'user',
    }));
    localStorage.setItem('token', 'fake-token');

    renderWithProviders(<Navbar />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
