import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from '../../pages/RegisterPage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../services/api', () => ({
  authApi: {
    register: vi.fn(),
  },
}));

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  ); 
};

describe('Page d\'inscription', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('devrait afficher le formulaire d\'inscription', () => {
    renderRegisterPage();
    expect(screen.getByText('Créer un Compte')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Pseudo')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
  });

  it('devrait avoir un lien vers la page de connexion', () => {
    renderRegisterPage();
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('devrait afficher une erreur quand les mots de passe ne correspondent pas', async () => {
    renderRegisterPage();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Pseudo'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), {
      target: { value: 'different' },
    });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur en cas d\'échec d\'inscription', async () => {
    const { authApi } = await import('../../services/api');
    (authApi.register as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { message: 'Email déjà enregistré' } },
    });

    renderRegisterPage();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'existing@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Pseudo'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Email déjà enregistré')).toBeInTheDocument();
    });
  });
});
