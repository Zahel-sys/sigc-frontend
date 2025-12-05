import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Loading Spinner Component
export const LoadingSpinner = ({ 
  size = "md", 
  text = "Cargando...", 
  color = "success" 
}) => {
  const sizeClasses = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg"
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div 
        className={`spinner-border text-${color} ${sizeClasses[size]}`} 
        role="status"
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <span className="mt-2 text-muted small">{text}</span>
      )}
    </div>
  );
};

// Card Skeleton for Especialidades/Doctores
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <SkeletonTheme baseColor="#e9ecef" highlightColor="#f8f9fa">
      <div className="row g-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <Skeleton height={200} />
              <div className="card-body">
                <Skeleton height={20} className="mb-2" />
                <Skeleton height={15} count={2} className="mb-2" />
                <Skeleton height={35} className="mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <SkeletonTheme baseColor="#e9ecef" highlightColor="#f8f9fa">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index}>
                  <Skeleton height={20} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex}>
                    <Skeleton height={15} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonTheme>
  );
};

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <SkeletonTheme baseColor="#e9ecef" highlightColor="#f8f9fa">
      <div>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="mb-3">
            <Skeleton height={20} width={100} className="mb-2" />
            <Skeleton height={40} />
          </div>
        ))}
        <Skeleton height={45} className="mt-4" />
      </div>
    </SkeletonTheme>
  );
};

// Dashboard Stats Skeleton
export const DashboardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e9ecef" highlightColor="#f8f9fa">
      <div className="container mt-4">
        {/* User Info Skeleton */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-auto">
                <Skeleton circle height={80} width={80} />
              </div>
              <div className="col">
                <Skeleton height={25} width={200} className="mb-2" />
                <Skeleton height={20} width={300} className="mb-2" />
                <div className="row">
                  <div className="col-md-6">
                    <Skeleton height={15} width={150} />
                  </div>
                  <div className="col-md-6">
                    <Skeleton height={15} width={150} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Skeleton */}
        <div className="row g-4 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center p-4">
                  <Skeleton circle height={70} width={70} className="mb-3" />
                  <Skeleton height={20} width={120} className="mb-2" />
                  <Skeleton height={15} width={180} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="card shadow-sm">
          <div className="card-header">
            <Skeleton height={20} width={200} />
          </div>
          <div className="card-body">
            <TableSkeleton rows={3} columns={5} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// Button Loading State
export const ButtonLoading = ({ 
  loading = false, 
  loadingText = "Cargando...", 
  children, 
  className = "btn btn-primary",
  disabled = false,
  ...props 
}) => {
  return (
    <button 
      className={`${className} ${loading ? "opacity-75" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span 
            className="spinner-border spinner-border-sm me-2" 
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon = "fas fa-inbox", 
  title = "No hay datos", 
  description = "No se encontraron elementos para mostrar.",
  actionButton = null 
}) => {
  return (
    <div className="text-center py-5">
      <i className={`${icon} fa-3x text-muted mb-3`}></i>
      <h5 className="text-muted mb-2">{title}</h5>
      <p className="text-muted mb-3">{description}</p>
      {actionButton}
    </div>
  );
};

// Retry Component
export const RetryComponent = ({ 
  onRetry, 
  error = "Ocurrió un error", 
  description = "Algo salió mal. Intenta nuevamente." 
}) => {
  return (
    <div className="text-center py-5">
      <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
      <h5 className="text-dark mb-2">{error}</h5>
      <p className="text-muted mb-3">{description}</p>
      <button 
        className="btn btn-outline-primary" 
        onClick={onRetry}
      >
        <i className="fas fa-redo me-2"></i>
        Reintentar
      </button>
    </div>
  );
};