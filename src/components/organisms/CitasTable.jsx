import React, { useState } from "react";
import { DataTable } from "../atoms/DataTable";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";
import { SearchBar } from "../molecules/SearchBar";
import { THEME } from "../../config/theme";

/**
 * CitasTable - Componente organism para tabla de citas con búsqueda
 * Combina: SearchBar + DataTable + Botones de acción
 * 
 * @param {Array} citas - Array de citas
 * @param {Function} onConfirm - Callback para confirmar cita
 * @param {Function} onCancel - Callback para cancelar cita
 * @param {Function} onView - Callback para ver detalle
 * @param {boolean} loading - Estado de carga
 * @param {boolean} showSearch - Mostrar barra de búsqueda
 * @param {boolean} showActions - Mostrar botones de acción
 */
export function CitasTable({
  citas = [],
  onConfirm,
  onCancel,
  onView,
  loading = false,
  showSearch = true,
  showActions = true,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCitas, setFilteredCitas] = useState(citas);

  // Filtrar citas
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredCitas(citas);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = citas.filter((cita) => {
      return (
        cita.doctor?.toLowerCase().includes(lowerTerm) ||
        cita.especialidad?.toLowerCase().includes(lowerTerm) ||
        cita.paciente?.toLowerCase().includes(lowerTerm) ||
        cita.estado?.toLowerCase().includes(lowerTerm) ||
        cita.fecha?.includes(term)
      );
    });

    setFilteredCitas(filtered);
  };

  // Actualizar filteredCitas cuando cambian las citas
  React.useEffect(() => {
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = citas.filter((cita) => {
        return (
          cita.doctor?.toLowerCase().includes(lowerTerm) ||
          cita.especialidad?.toLowerCase().includes(lowerTerm) ||
          cita.paciente?.toLowerCase().includes(lowerTerm) ||
          cita.estado?.toLowerCase().includes(lowerTerm) ||
          cita.fecha?.includes(searchTerm)
        );
      });
      setFilteredCitas(filtered);
    } else {
      setFilteredCitas(citas);
    }
  }, [citas, searchTerm]);

  // Formatear fecha
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "N/A";
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  // Badge de estado
  const renderEstadoBadge = (estado) => {
    const variants = {
      PENDIENTE: "warning",
      CONFIRMADA: "success",
      CANCELADA: "danger",
      COMPLETADA: "secondary",
    };

    const labels = {
      PENDIENTE: "Pendiente",
      CONFIRMADA: "Confirmada",
      CANCELADA: "Cancelada",
      COMPLETADA: "Completada",
    };

    return (
      <Badge variant={variants[estado] || "primary"}>
        {labels[estado] || estado}
      </Badge>
    );
  };

  // Botones de acción
  const renderActions = (cita) => {
    const isPendiente = cita.estado === "PENDIENTE";
    const isCancelada = cita.estado === "CANCELADA";

    return (
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        {onView && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView(cita)}
            style={{ minWidth: "70px" }}
          >
            👁️ Ver
          </Button>
        )}

        {onConfirm && isPendiente && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onConfirm(cita)}
            style={{ minWidth: "90px" }}
          >
            ✓ Confirmar
          </Button>
        )}

        {onCancel && !isCancelada && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel(cita)}
            style={{ minWidth: "90px" }}
          >
            ✕ Cancelar
          </Button>
        )}
      </div>
    );
  };

  // Columnas de la tabla
  const columns = [
    {
      header: "Fecha",
      key: "fecha",
      render: (cita) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: "600" }}>{formatFecha(cita.fecha)}</div>
          <div style={{ fontSize: "0.85rem", color: THEME.text.secondary }}>
            {cita.hora}
          </div>
        </div>
      ),
    },
    {
      header: "Doctor",
      key: "doctor",
      render: (cita) => (
        <div>
          <div style={{ fontWeight: "600" }}>{cita.doctor}</div>
          <div style={{ fontSize: "0.85rem", color: THEME.text.secondary }}>
            {cita.especialidad}
          </div>
        </div>
      ),
    },
    ...(citas.some((c) => c.paciente)
      ? [
          {
            header: "Paciente",
            key: "paciente",
            render: (cita) => cita.paciente || "N/A",
          },
        ]
      : []),
    {
      header: "Estado",
      key: "estado",
      render: (cita) => renderEstadoBadge(cita.estado),
    },
  ];

  if (showActions) {
    columns.push({
      header: "Acciones",
      key: "acciones",
      render: renderActions,
    });
  }

  return (
    <div
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: THEME.borderRadius.lg,
        boxShadow: THEME.shadows.md,
      }}
    >
      {/* Header con búsqueda */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            margin: "0 0 0.5rem 0",
            color: THEME.primary.main,
            fontSize: "1.5rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>📋</span>
          Listado de Citas
        </h2>

        {showSearch && (
          <div style={{ marginTop: "1rem" }}>
            <SearchBar
              placeholder="Buscar por doctor, especialidad, paciente o fecha..."
              onSearch={handleSearch}
              onChange={handleSearch}
              loading={loading}
              buttonText="Buscar"
            />
          </div>
        )}
      </div>

      {/* Contador */}
      <div
        style={{
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: THEME.text.secondary,
        }}
      >
        {searchTerm ? (
          <>
            Mostrando <strong>{filteredCitas.length}</strong> de{" "}
            <strong>{citas.length}</strong> citas
          </>
        ) : (
          <>
            Total: <strong>{citas.length}</strong> citas
          </>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: THEME.text.secondary,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <div>Cargando citas...</div>
        </div>
      ) : filteredCitas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: THEME.text.secondary,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <div>
            {searchTerm
              ? "No se encontraron citas con esos criterios"
              : "No hay citas registradas"}
          </div>
        </div>
      ) : (
        <DataTable data={filteredCitas} columns={columns} />
      )}
    </div>
  );
}
