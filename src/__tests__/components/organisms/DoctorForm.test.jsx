import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DoctorForm } from '../../../components/organisms/DoctorForm';

describe('DoctorForm', () => {
  const mockEspecialidades = [
    { id: 1, nombre: 'Cardiología' },
    { id: 2, nombre: 'Dermatología' }
  ];

  const mockInitialData = {
    nombre: 'Dr. Juan Pérez',
    especialidad: 'Cardiología',
    cupoPacientes: '10',
    imagen: null
  };

  it('renderiza correctamente en modo creación', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText(/Agregar Doctor/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardar/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('renderiza correctamente en modo edición', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
        isEditing
        initialData={mockInitialData}
      />
    );
    
    expect(screen.getByText(/Editar Doctor/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Juan Pérez')).toBeInTheDocument();
  });

  it('muestra lista de especialidades en select', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText('Cardiología')).toBeInTheDocument();
    expect(screen.getByText('Dermatología')).toBeInTheDocument();
  });

  it('valida campo nombre (mínimo 3 caracteres)', async () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const nombreInput = screen.getByLabelText(/Nombre/i);
    const submitButton = screen.getByText(/Guardar/i);
    
    fireEvent.change(nombreInput, { target: { value: 'Dr' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/El nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
  });

  it('valida campo especialidad (requerido)', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const submitButton = screen.getByText(/Guardar/i);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Seleccione una especialidad/i)).toBeInTheDocument();
  });

  it('valida campo cupoPacientes (1-20)', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const cupoInput = screen.getByLabelText(/Cupo de Pacientes/i);
    const submitButton = screen.getByText(/Guardar/i);
    
    fireEvent.change(cupoInput, { target: { value: '25' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/El cupo debe estar entre 1 y 20/i)).toBeInTheDocument();
  });

  it('valida tamaño de imagen (máximo 5MB)', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const fileInput = screen.getByLabelText(/Imagen/i);
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    const submitButton = screen.getByText(/Guardar/i);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/La imagen no debe superar 5MB/i)).toBeInTheDocument();
  });

  it('valida formato de imagen (jpg, jpeg, png)', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const fileInput = screen.getByLabelText(/Imagen/i);
    const invalidFile = new File(['content'], 'file.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    
    const submitButton = screen.getByText(/Guardar/i);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Solo se permiten imágenes/i)).toBeInTheDocument();
  });

  it('llama a onSubmit con datos válidos', () => {
    const handleSubmit = vi.fn();
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={handleSubmit}
        onCancel={() => {}}
      />
    );
    
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Dr. Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/Especialidad/i), { target: { value: 'Cardiología' } });
    fireEvent.change(screen.getByLabelText(/Cupo/i), { target: { value: '10' } });
    
    const submitButton = screen.getByText(/Guardar/i);
    fireEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('llama a onCancel cuando se hace click en Cancelar', () => {
    const handleCancel = vi.fn();
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={handleCancel}
      />
    );
    
    const cancelButton = screen.getByText(/Cancelar/i);
    fireEvent.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalled();
  });

  it('deshabilita botones cuando loading es true', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
        loading
      />
    );
    
    expect(screen.getByText(/Guardar/i)).toBeDisabled();
    expect(screen.getByText(/Cancelar/i)).toBeDisabled();
  });

  it('limpia error cuando se modifica un campo', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    
    const nombreInput = screen.getByLabelText(/Nombre/i);
    const submitButton = screen.getByText(/Guardar/i);
    
    // Generar error
    fireEvent.change(nombreInput, { target: { value: 'Dr' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/El nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
    
    // Modificar campo - el error debe desaparecer
    fireEvent.change(nombreInput, { target: { value: 'Dr. Juan Pérez' } });
    expect(screen.queryByText(/El nombre debe tener al menos 3 caracteres/i)).not.toBeInTheDocument();
  });

  it('carga datos iniciales en modo edición', () => {
    render(
      <DoctorForm 
        especialidades={mockEspecialidades}
        onSubmit={() => {}}
        onCancel={() => {}}
        isEditing
        initialData={mockInitialData}
      />
    );
    
    expect(screen.getByDisplayValue('Dr. Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });
});
