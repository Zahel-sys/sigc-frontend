import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// ✅ Éxito
export const showSuccess = (mensaje, titulo = "Éxito") => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "success",
    confirmButtonColor: "#16a34a",
    confirmButtonText: "Aceptar",
  });
};

// ⚠️ Advertencia
export const showWarning = (mensaje, titulo = "Atención") => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "warning",
    confirmButtonColor: "#eab308",
    confirmButtonText: "Entendido",
  });
};

// ❌ Error
export const showError = (mensaje, titulo = "Error") => {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "error",
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Cerrar",
  });
};

// ❓ Confirmación
export const showConfirm = async (mensaje, titulo = "¿Estás seguro?") => {
  const result = await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#dc2626",
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  });
  return result.isConfirmed;
};
