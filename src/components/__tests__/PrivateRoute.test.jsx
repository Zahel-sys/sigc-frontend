import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock React Router
const MockedBrowserRouter = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <MockedBrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MockedBrowserRouter>
    );

    // Should not render protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    const mockUser = JSON.stringify({
      nombre: 'Test User',
      email: 'test@test.com',
      rol: 'PACIENTE',
      token: 'mock-token'
    });
    
    mockLocalStorage.getItem.mockReturnValue(mockUser);

    render(
      <MockedBrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MockedBrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect ADMIN to /admin when trying to access PACIENTE route', () => {
    const mockAdmin = JSON.stringify({
      nombre: 'Admin User',
      email: 'admin@test.com',
      rol: 'ADMIN',
      token: 'mock-token'
    });
    
    mockLocalStorage.getItem.mockReturnValue(mockAdmin);

    render(
      <MockedBrowserRouter>
        <PrivateRoute requiredRole="PACIENTE">
          <div>Patient Content</div>
        </PrivateRoute>
      </MockedBrowserRouter>
    );

    // Should not render patient content for admin
    expect(screen.queryByText('Patient Content')).not.toBeInTheDocument();
  });

  it('should handle corrupted localStorage gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    console.error = vi.fn(); // Mock console.error

    render(
      <MockedBrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MockedBrowserRouter>
    );

    expect(console.error).toHaveBeenCalled();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});