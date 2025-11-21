import React, { Component } from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary - Componente para capturar errores de React
 * Evita que toda la aplicación se rompa cuando hay un error en un componente
 * 
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Método del ciclo de vida para capturar errores
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Método del ciclo de vida para log de errores
   */
  componentDidCatch(error, errorInfo) {
    // Log del error a consola en desarrollo
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Actualizar estado con detalles del error
    this.setState({
      error,
      errorInfo
    });

    // En producción, aquí se podría enviar el error a un servicio como Sentry
    if (import.meta.env.VITE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
      // Ejemplo: Sentry.captureException(error);
      console.log('Error enviado a servicio de monitoreo');
    }
  }

  /**
   * Reiniciar el estado del error
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Recargar la página
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.VITE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">⚠️</div>
            
            <h1 className="error-boundary__title">
              Algo salió mal
            </h1>
            
            <p className="error-boundary__message">
              Lo sentimos, ha ocurrido un error inesperado.
              {isDevelopment && ' Por favor, revisa la consola para más detalles.'}
            </p>

            {/* Mostrar detalles solo en desarrollo */}
            {isDevelopment && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__summary">
                  Detalles del error (solo visible en desarrollo)
                </summary>
                <div className="error-boundary__stack">
                  <strong>Error:</strong>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <strong>Pila de componentes:</strong>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary__actions">
              <button 
                className="error-boundary__button error-boundary__button--primary"
                onClick={this.handleReset}
              >
                Intentar de nuevo
              </button>
              
              <button 
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
              >
                Recargar página
              </button>
            </div>

            <div className="error-boundary__footer">
              <p>Si el problema persiste, por favor contacta al soporte técnico.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
