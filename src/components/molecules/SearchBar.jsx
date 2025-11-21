import React, { useState } from "react";
import { Button } from "../atoms/Button";
import { FormField } from "../atoms/FormField";
import { THEME } from "../../config/theme";

/**
 * SearchBar - Componente molecule para búsqueda
 * Combina: Input + Button de búsqueda + Clear button
 * 
 * @param {string} placeholder - Placeholder del input
 * @param {Function} onSearch - Callback cuando se busca (recibe el valor)
 * @param {Function} onChange - Callback en cada cambio (opcional)
 * @param {string} initialValue - Valor inicial
 * @param {boolean} loading - Estado de carga
 * @param {string} buttonText - Texto del botón de búsqueda
 */
export function SearchBar({
  placeholder = "Buscar...",
  onSearch,
  onChange,
  initialValue = "",
  loading = false,
  buttonText = "Buscar",
  icon = "🔍",
}) {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (onChange) {
      onChange(value);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onSearch) {
      onSearch("");
    }
    if (onChange) {
      onChange("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      {/* Input Container */}
      <div style={{ flex: 1, position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.2rem",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        >
          {icon}
        </span>

        <FormField
          type="text"
          value={searchValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={loading}
          style={{
            paddingLeft: "3rem",
            paddingRight: searchValue ? "3rem" : "1rem",
            height: "100%",
          }}
        />

        {/* Clear Button */}
        {searchValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: THEME.text.secondary,
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = THEME.danger.main)}
            onMouseLeave={(e) => (e.target.style.color = THEME.text.secondary)}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={loading || !searchValue.trim()}
        style={{
          minWidth: "120px",
          whiteSpace: "nowrap",
        }}
      >
        {buttonText}
      </Button>
    </form>
  );
}
