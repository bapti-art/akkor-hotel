import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Simule le module API
vi.mock('../../services/api', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
}; 

describe('Page de connexion', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('devrait afficher le formulaire de connexion', () => {
    renderLoginPage();
    expect(screen.getByText('Bienvenue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('devrait avoir un lien vers la page d\'inscription', () => {
    renderLoginPage();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it('devrait permettre la saisie de l\'email', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput).toHaveValue('test@test.com');
  });

  it('devrait permettre la saisie du mot de passe', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Mot de passe');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
    const { authApi } = await import('../../services/api');
    (authApi.login as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { message: 'Email ou mot de passe invalide' } },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitBtn = screen.getByRole('button', { name: /connexion/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe invalide')).toBeInTheDocument();
    });
  });
});
