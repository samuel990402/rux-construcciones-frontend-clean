import { useState } from "react";

export function useApiError() {
  const [error, setError] = useState(null);

  function handle(e) {
    setError(
      e?.response?.data?.error ||
      "Ocurrió un error inesperado"
    );
  }

  function clear() {
    setError(null);
  }

  return { error, handle, clear };
}
