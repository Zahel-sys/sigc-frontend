/**
 * Components - Exportación centralizada (Barrel Pattern)
 * 
 * Facilita los imports desde cualquier parte de la app:
 * 
 * Antes:
 *   import { Button } from '../components/atoms/Button';
 *   import { FormGroup } from '../components/molecules/FormGroup';
 *   import { DoctorForm } from '../components/organisms/DoctorForm';
 * 
 * Ahora:
 *   import { Button, FormGroup, DoctorForm } from '../components';
 */

// ========================================
// ATOMS - Componentes base
// ========================================
export { Badge } from "./atoms/Badge";
export { Button } from "./atoms/Button";
export { Card } from "./atoms/Card";
export { DataTable } from "./atoms/DataTable";
export { FormField } from "./atoms/FormField";
export { Modal } from "./atoms/Modal";

// ========================================
// MOLECULES - Componentes compuestos
// ========================================
export { FormGroup } from "./molecules/FormGroup";
export { SearchBar } from "./molecules/SearchBar";
export { UserCard } from "./molecules/UserCard";
export { CitaCard } from "./molecules/CitaCard";

// ========================================
// ORGANISMS - Componentes complejos
// ========================================
export { DoctorForm } from "./organisms/DoctorForm";
export { CitasTable } from "./organisms/CitasTable";
export { Sidebar } from "./organisms/Sidebar";

// ========================================
// COMPONENTES ESPECÍFICOS
// ========================================
export { default as EspecialidadCard } from "./EspecialidadCard";
export { default as NavbarCliente } from "./NavbarCliente";
export { default as PrivateRoute } from "./PrivateRoute";
export { default as ReservarCita } from "./ReservarCita";
