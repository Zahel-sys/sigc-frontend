import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../../../components/organisms/Sidebar';

describe('Sidebar', () => {
  const mockUserAdmin = {
    nombre: 'Admin User',
    email: 'admin@sigc.com',
    rol: 'ADMIN'
  };

  const mockUserPaciente = {
    nombre: 'Juan Pérez',
    email: 'juan@sigc.com',
    rol: 'PACIENTE'
  };

  it('renderiza información del usuario', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@sigc.com')).toBeInTheDocument();
  });

  it('muestra iniciales del usuario cuando no hay avatar', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    // "Admin User" -> "AU"
    expect(screen.getByText('AU')).toBeInTheDocument();
  });

  it('genera iniciales correctamente para un solo nombre', () => {
    const user = { ...mockUserAdmin, nombre: 'Admin' };
    render(
      <Sidebar 
        user={user}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('muestra menú de administrador para rol ADMIN', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Doctores')).toBeInTheDocument();
    expect(screen.getByText('Especialidades')).toBeInTheDocument();
    expect(screen.getByText('Horarios')).toBeInTheDocument();
  });

  it('muestra menú de paciente para rol PACIENTE', () => {
    render(
      <Sidebar 
        user={mockUserPaciente}
        currentPath="/cliente"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Mis Citas')).toBeInTheDocument();
    expect(screen.getByText('Especialidades')).toBeInTheDocument();
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
  });

  it('resalta el item activo según currentPath', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin/doctores"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    const doctoresItem = screen.getByText('Doctores').closest('div');
    expect(doctoresItem).toHaveClass('active');
  });

  it('llama a onNavigate cuando se hace click en un item', () => {
    const handleNavigate = vi.fn();
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={handleNavigate}
        onLogout={() => {}}
      />
    );
    
    const doctoresItem = screen.getByText('Doctores');
    fireEvent.click(doctoresItem);
    
    expect(handleNavigate).toHaveBeenCalledWith('/admin/doctores');
  });

  it('llama a onLogout cuando se hace click en cerrar sesión', () => {
    const handleLogout = vi.fn();
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={handleLogout}
      />
    );
    
    const logoutButton = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(logoutButton);
    
    expect(handleLogout).toHaveBeenCalled();
  });

  it('colapsa y expande el sidebar', () => {
    const { container } = render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    const sidebar = container.firstChild;
    const toggleButton = screen.getByLabelText(/Toggle sidebar/i);
    
    // Estado inicial - expandido
    expect(sidebar).not.toHaveClass('collapsed');
    
    // Colapsar
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('collapsed');
    
    // Expandir
    fireEvent.click(toggleButton);
    expect(sidebar).not.toHaveClass('collapsed');
  });

  it('oculta texto de items cuando está colapsado', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    const toggleButton = screen.getByLabelText(/Toggle sidebar/i);
    
    // Expandido - texto visible
    expect(screen.getByText('Doctores')).toBeVisible();
    
    // Colapsar
    fireEvent.click(toggleButton);
    
    // Texto oculto (solo iconos visibles)
    expect(screen.getByText('Doctores')).not.toBeVisible();
  });

  it('usa items de menú personalizados cuando se proporcionan', () => {
    const customMenuItems = [
      { path: '/custom1', label: 'Custom 1', icon: '🎯' },
      { path: '/custom2', label: 'Custom 2', icon: '🎨' }
    ];

    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/custom1"
        onNavigate={() => {}}
        onLogout={() => {}}
        customMenuItems={customMenuItems}
      />
    );
    
    expect(screen.getByText('Custom 1')).toBeInTheDocument();
    expect(screen.getByText('Custom 2')).toBeInTheDocument();
    expect(screen.queryByText('Doctores')).not.toBeInTheDocument();
  });

  it('muestra iconos en items de menú', () => {
    render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    expect(screen.getByText('📊')).toBeInTheDocument(); // Dashboard
    expect(screen.getByText('👨‍⚕️')).toBeInTheDocument(); // Doctores
    expect(screen.getByText('🏥')).toBeInTheDocument(); // Especialidades
    expect(screen.getByText('🕐')).toBeInTheDocument(); // Horarios
  });

  it('maneja usuario sin rol correctamente', () => {
    const userSinRol = { ...mockUserAdmin, rol: undefined };
    render(
      <Sidebar 
        user={userSinRol}
        currentPath="/"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    // No debe romper, pero no debe mostrar items de menú
    expect(screen.queryByText('Doctores')).not.toBeInTheDocument();
    expect(screen.queryByText('Mis Citas')).not.toBeInTheDocument();
  });

  it('mantiene estado de colapso entre renders', () => {
    const { rerender, container } = render(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    const toggleButton = screen.getByLabelText(/Toggle sidebar/i);
    fireEvent.click(toggleButton);
    
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('collapsed');
    
    // Re-render con nueva prop
    rerender(
      <Sidebar 
        user={mockUserAdmin}
        currentPath="/admin/doctores"
        onNavigate={() => {}}
        onLogout={() => {}}
      />
    );
    
    // Estado de colapso debe persistir
    expect(sidebar).toHaveClass('collapsed');
  });
});
