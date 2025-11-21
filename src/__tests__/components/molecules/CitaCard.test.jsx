import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CitaCard } from '../../../components/molecules/CitaCard';

describe('CitaCard', () => {
  const mockCita = {
    fecha: '2025-11-25',
    hora: '10:00',
    doctor: 'Dr. Juan Pérez',
    especialidad: 'Cardiología',
    estado: 'PENDIENTE',
    motivo: 'Consulta de control'
  };

  it('renderiza información de la cita correctamente', () => {
    render(<CitaCard cita={mockCita} />);
    
    expect(screen.getByText('Dr. Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Cardiología')).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });

  it('muestra badge de estado PENDIENTE', () => {
    render(<CitaCard cita={mockCita} />);
    
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('muestra badge de estado CONFIRMADA', () => {
    const citaConfirmada = { ...mockCita, estado: 'CONFIRMADA' };
    render(<CitaCard cita={citaConfirmada} />);
    
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
  });

  it('muestra badge de estado CANCELADA', () => {
    const citaCancelada = { ...mockCita, estado: 'CANCELADA' };
    render(<CitaCard cita={citaCancelada} />);
    
    expect(screen.getByText('Cancelada')).toBeInTheDocument();
  });

  it('muestra badge de estado COMPLETADA', () => {
    const citaCompletada = { ...mockCita, estado: 'COMPLETADA' };
    render(<CitaCard cita={citaCompletada} />);
    
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('muestra motivo de consulta cuando existe', () => {
    render(<CitaCard cita={mockCita} />);
    
    expect(screen.getByText('Consulta de control')).toBeInTheDocument();
  });

  it('no muestra motivo cuando no existe', () => {
    const citaSinMotivo = { ...mockCita, motivo: undefined };
    render(<CitaCard cita={citaSinMotivo} />);
    
    expect(screen.queryByText(/Motivo de consulta/i)).not.toBeInTheDocument();
  });

  it('muestra botón de confirmar para citas pendientes', () => {
    render(<CitaCard cita={mockCita} onConfirm={() => {}} />);
    
    expect(screen.getByText(/Confirmar/i)).toBeInTheDocument();
  });

  it('no muestra botón de confirmar para citas confirmadas', () => {
    const citaConfirmada = { ...mockCita, estado: 'CONFIRMADA' };
    render(<CitaCard cita={citaConfirmada} onConfirm={() => {}} />);
    
    expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
  });

  it('muestra botón de cancelar para citas no canceladas', () => {
    render(<CitaCard cita={mockCita} onCancel={() => {}} />);
    
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('no muestra botón de cancelar para citas ya canceladas', () => {
    const citaCancelada = { ...mockCita, estado: 'CANCELADA' };
    render(<CitaCard cita={citaCancelada} onCancel={() => {}} />);
    
    expect(screen.queryByText(/Cancelar/i)).not.toBeInTheDocument();
  });

  it('llama a onConfirm cuando se hace click en Confirmar', () => {
    const handleConfirm = vi.fn();
    render(<CitaCard cita={mockCita} onConfirm={handleConfirm} />);
    
    const confirmButton = screen.getByText(/Confirmar/i);
    fireEvent.click(confirmButton);
    
    expect(handleConfirm).toHaveBeenCalledWith(mockCita);
  });

  it('llama a onCancel cuando se hace click en Cancelar', () => {
    const handleCancel = vi.fn();
    render(<CitaCard cita={mockCita} onCancel={handleCancel} />);
    
    const cancelButton = screen.getByText(/Cancelar/i);
    fireEvent.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalledWith(mockCita);
  });

  it('llama a onClick cuando se hace click en la card', () => {
    const handleClick = vi.fn();
    render(<CitaCard cita={mockCita} onClick={handleClick} />);
    
    const card = screen.getByText('Dr. Juan Pérez').closest('div').parentElement;
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('oculta botones cuando showActions es false', () => {
    render(
      <CitaCard 
        cita={mockCita} 
        onConfirm={() => {}} 
        onCancel={() => {}} 
        showActions={false}
      />
    );
    
    expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancelar/i)).not.toBeInTheDocument();
  });

  it('formatea la fecha correctamente', () => {
    render(<CitaCard cita={mockCita} />);
    
    // La fecha "2025-11-25" debería formatearse a algo legible
    const fechaElement = screen.getByText(/noviembre/i);
    expect(fechaElement).toBeInTheDocument();
  });

  it('aplica estilo diferente a citas canceladas', () => {
    const citaCancelada = { ...mockCita, estado: 'CANCELADA' };
    const { container } = render(<CitaCard cita={citaCancelada} />);
    
    // La card debería tener opacidad reducida
    const card = container.firstChild;
    expect(card).toHaveStyle({ opacity: '0.7' });
  });

  it('no muestra acciones para citas canceladas aunque showActions sea true', () => {
    const citaCancelada = { ...mockCita, estado: 'CANCELADA' };
    render(
      <CitaCard 
        cita={citaCancelada} 
        onConfirm={() => {}} 
        onCancel={() => {}} 
        showActions={true}
      />
    );
    
    expect(screen.queryByText(/Confirmar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancelar/i)).not.toBeInTheDocument();
  });
});
