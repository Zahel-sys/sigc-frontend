import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-danger shadow-lg">
              <div className="card-header bg-danger text-white text-center">
                <h4 className="mb-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  ¡Oops! Algo salió mal
                </h4>
              </div>
              <div className="card-body text-center p-4">
                <div className="mb-4">
                  <i className="fas fa-bug fa-4x text-danger mb-3"></i>
                  <h5 className="text-dark">Error inesperado</h5>
                  <p className="text-muted mb-0">
                    La aplicación encontró un problema y necesita reiniciarse.
                  </p>
                </div>
                
                {/* Error Details (only in development) */}
                {import.meta.env.MODE === 'development' && (
                  <div className="alert alert-danger text-start mb-4">
                    <h6 className="fw-bold">Detalles del error:</h6>
                    <code className="small">{error.message}</code>
                  </div>
                )}
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button 
                    className="btn btn-danger"
                    onClick={resetErrorBoundary}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Reintentar
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.location.href = '/'}
                  >
                    <i className="fas fa-home me-2"></i>
                    Ir al Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Smaller Error Component for sections
export const SectionErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="fas fa-exclamation-triangle me-2"></i>
      <div className="flex-grow-1">
        <h6 className="mb-1">Error en esta sección</h6>
        <small className="text-muted">
          {error.message || 'No se pudo cargar el contenido'}
        </small>
      </div>
      <button 
        className="btn btn-outline-danger btn-sm ms-2"
        onClick={resetErrorBoundary}
      >
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
};

// Network Error Component
export const NetworkErrorFallback = ({ resetErrorBoundary }) => {
  return (
    <div className="text-center py-5">
      <i className="fas fa-wifi fa-3x text-muted mb-3"></i>
      <h5 className="text-dark mb-2">Problema de conexión</h5>
      <p className="text-muted mb-3">
        No se pudo conectar con el servidor. Verifica tu conexión a internet.
      </p>
      <div className="d-grid gap-2 d-md-flex justify-content-md-center">
        <button 
          className="btn btn-primary"
          onClick={resetErrorBoundary}
        >
          <i className="fas fa-redo me-2"></i>
          Reintentar
        </button>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-refresh me-2"></i>
          Recargar Página
        </button>
      </div>
    </div>
  );
};

// Main Error Boundary Wrapper
export const AppErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (import.meta.env.MODE === 'development') {
          console.error('Error Boundary caught an error:', error, errorInfo);
        }
        
        // Here you could send error to logging service
        // logErrorToService(error, errorInfo);
      }}
      onReset={() => {
        // Clear any state that might cause the error
        localStorage.removeItem('cache');
        // Optionally reload the page
        // window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Section Error Boundary (for smaller components)
export const SectionErrorBoundary = ({ children, fallback = SectionErrorFallback }) => {
  return (
    <ErrorBoundary
      FallbackComponent={fallback}
      onError={(error, errorInfo) => {
        console.warn('Section Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorFallback;