import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock SweetAlert
vi.mock('../../utils/alerts', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const MockedBrowserRouter = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should show warning when fields are empty', async () => {
    const { showWarning } = await import('../../utils/alerts');
    
    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    expect(showWarning).toHaveBeenCalledWith('Por favor completa todos los campos.');
  });

  it('should handle successful admin login', async () => {
    const { showSuccess } = await import('../../utils/alerts');
    
    // Mock successful API response
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        rol: 'ADMIN',
        email: 'admin@test.com',
        idUsuario: 1
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'admin@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith('Bienvenido Administrador', 'Acceso concedido');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('usuario', JSON.stringify(mockResponse.data));
    });
  });

  it('should handle successful patient login', async () => {
    const { showSuccess } = await import('../../utils/alerts');
    
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        rol: 'PACIENTE',
        email: 'patient@test.com',
        idUsuario: 2
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'patient@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith('Inicio de sesión exitoso', 'Bienvenido a SIGC');
      expect(mockNavigate).toHaveBeenCalledWith('/cliente');
    });
  });

  it('should handle login errors', async () => {
    const { showError } = await import('../../utils/alerts');
    
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Credenciales inválidas' }
      }
    });

    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'wrong@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Credenciales inválidas');
    });
  });

  it('should show loading state during submission', async () => {
    // Mock a delayed response
    mockedAxios.post.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
    );

    render(
      <MockedBrowserRouter>
        <Login />
      </MockedBrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Should show loading text
    expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    
    // Button should be disabled
    expect(screen.getByRole('button', { name: /ingresando/i })).toBeDisabled();
  });
});