import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from '../../../components/molecules/UserCard';

describe('UserCard', () => {
  const mockUser = {
    nombre: 'Dr. Juan Pérez',
    email: 'juan.perez@sigc.com',
    rol: 'ADMIN',
    telefono: '123-456-7890'
  };

  it('renderiza información del usuario correctamente', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('Dr. Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan.perez@sigc.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  it('muestra badge de rol correcto para ADMIN', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('muestra badge de rol correcto para PACIENTE', () => {
    const paciente = { ...mockUser, rol: 'PACIENTE' };
    render(<UserCard user={paciente} />);
    
    expect(screen.getByText('Paciente')).toBeInTheDocument();
  });

  it('muestra iniciales cuando no hay avatar', () => {
    render(<UserCard user={mockUser} />);
    
    // Iniciales de "Dr. Juan Pérez" -> "DJ"
    expect(screen.getByText('DJ')).toBeInTheDocument();
  });

  it('muestra iniciales de un solo nombre', () => {
    const user = { ...mockUser, nombre: 'Maria' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('no muestra teléfono si no existe', () => {
    const userSinTelefono = { ...mockUser, telefono: undefined };
    render(<UserCard user={userSinTelefono} />);
    
    expect(screen.queryByText(/123-456/)).not.toBeInTheDocument();
  });

  it('muestra botones de acción por defecto', () => {
    render(
      <UserCard 
        user={mockUser} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(screen.getByText(/Editar/i)).toBeInTheDocument();
    expect(screen.getByText(/Eliminar/i)).toBeInTheDocument();
  });

  it('oculta botones cuando showActions es false', () => {
    render(
      <UserCard 
        user={mockUser} 
        onEdit={() => {}} 
        onDelete={() => {}} 
        showActions={false}
      />
    );
    
    expect(screen.queryByText(/Editar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Eliminar/i)).not.toBeInTheDocument();
  });

  it('llama a onEdit cuando se hace click en Editar', () => {
    const handleEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={handleEdit} />);
    
    const editButton = screen.getByText(/Editar/i);
    fireEvent.click(editButton);
    
    expect(handleEdit).toHaveBeenCalledWith(mockUser);
  });

  it('llama a onDelete cuando se hace click en Eliminar', () => {
    const handleDelete = vi.fn();
    render(<UserCard user={mockUser} onDelete={handleDelete} />);
    
    const deleteButton = screen.getByText(/Eliminar/i);
    fireEvent.click(deleteButton);
    
    expect(handleDelete).toHaveBeenCalledWith(mockUser);
  });

  it('llama a onClick cuando se hace click en la card', () => {
    const handleClick = vi.fn();
    render(<UserCard user={mockUser} onClick={handleClick} />);
    
    const card = screen.getByText('Dr. Juan Pérez').closest('div').parentElement;
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('no muestra botón de editar si onEdit no está definido', () => {
    render(<UserCard user={mockUser} onDelete={() => {}} />);
    
    expect(screen.queryByText(/Editar/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Eliminar/i)).toBeInTheDocument();
  });

  it('no muestra botón de eliminar si onDelete no está definido', () => {
    render(<UserCard user={mockUser} onEdit={() => {}} />);
    
    expect(screen.getByText(/Editar/i)).toBeInTheDocument();
    expect(screen.queryByText(/Eliminar/i)).not.toBeInTheDocument();
  });

  it('maneja avatares con URL', () => {
    const userConAvatar = { ...mockUser, avatar: 'https://example.com/avatar.jpg' };
    const { container } = render(<UserCard user={userConAvatar} />);
    
    // El avatar debería tener background-image con la URL
    const avatarDiv = container.querySelector('[style*="background"]');
    expect(avatarDiv).toBeTruthy();
  });
});
