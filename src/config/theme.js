/**
 * Configuración centralizada de colores y estilos (Open/Closed Principle)
 * Todos los colores están aquí, no hardcodeados en componentes
 */

export const THEME = {
  // Paleta principal
  primary: {
    main: '#20c997',
    dark: '#16a085',
    light: '#d1f2eb',
    gradient: 'linear-gradient(135deg, #20c997, #16a085)',
    shadowColor: 'rgba(32, 201, 151, 0.3)',
  },

  secondary: {
    main: '#0d6efd',
    dark: '#0a58ca',
    light: '#cff4fc',
    gradient: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
    shadowColor: 'rgba(13, 110, 253, 0.3)',
  },

  warning: {
    main: '#fd7e14',
    dark: '#dc5f32',
    light: '#ffe5cc',
    gradient: 'linear-gradient(135deg, #fd7e14, #dc5f32)',
    shadowColor: 'rgba(253, 126, 20, 0.3)',
  },

  success: {
    main: '#198754',
    dark: '#157347',
    light: '#d1e7dd',
  },

  danger: {
    main: '#dc3545',
    dark: '#b02a37',
    light: '#f8d7da',
  },

  info: {
    main: '#0dcaf0',
    dark: '#0aa2c0',
    light: '#cff4fc',
  },

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Colores de texto
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    disabled: '#9ca3af',
    inverse: '#ffffff',
  },

  // Colores de fondo
  background: {
    default: '#ffffff',
    light: '#f9fafb',
    dark: '#111827',
    paper: '#ffffff',
  },

  // Colores de borde
  border: {
    light: '#e5e7eb',
    main: '#d1d5db',
    dark: '#9ca3af',
  },

  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
  },

  // Bordes
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '15px',
  },

  // Sombras
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },

  // Transiciones
  transition: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
};

/**
 * Función helper para convertir THEME a estilos CSS
 */
export const getThemeStyle = (path) => {
  const keys = path.split('.');
  let value = THEME;

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return null;
    }
  }

  return value;
};

export default THEME;
