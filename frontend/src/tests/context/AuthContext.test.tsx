import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { describe, it, expect, beforeEach } from 'vitest';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Contexte d\'authentification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devrait démarrer sans utilisateur', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  }); 

  it('devrait connecter un utilisateur', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'test@test.com',
          pseudo: 'test',
          role: 'user',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    expect(result.current.user?.email).toBe('test@test.com');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it('devrait détecter le rôle administrateur', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'admin@test.com',
          pseudo: 'admin',
          role: 'admin',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it('devrait détecter le rôle employé', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'emp@test.com',
          pseudo: 'employee',
          role: 'employee',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    expect(result.current.isEmployee).toBe(true);
  });

  it('devrait déconnecter l\'utilisateur', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'test@test.com',
          pseudo: 'test',
          role: 'user',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('devrait persister l\'utilisateur dans localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'test@test.com',
          pseudo: 'test',
          role: 'user',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    expect(localStorage.getItem('token')).toBe('token123');
    expect(localStorage.getItem('user')).toContain('test@test.com');
  });

  it('devrait charger l\'utilisateur depuis localStorage', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        email: 'stored@test.com',
        pseudo: 'stored',
        role: 'user',
      })
    );
    localStorage.setItem('token', 'stored-token');

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user?.email).toBe('stored@test.com');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('devrait mettre à jour l\'utilisateur', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        {
          id: 1,
          email: 'old@test.com',
          pseudo: 'old',
          role: 'user',
          createdAt: '',
          updatedAt: '',
        },
        'token123'
      );
    });

    act(() => {
      result.current.updateUser({
        id: 1,
        email: 'new@test.com',
        pseudo: 'new',
        role: 'user',
        createdAt: '',
        updatedAt: '',
      });
    });

    expect(result.current.user?.email).toBe('new@test.com');
    expect(result.current.user?.pseudo).toBe('new');
  });
});
