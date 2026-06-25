// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Bastones seleccionados: [{ id, nombre, precio, opciones: {} }]
  const [items, setItems] = useState([]);

  function agregarBaston(baston) {
    setItems((prev) => [...prev, baston]);
  }

  function eliminarItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function limpiarCarrito() {
    setItems([]);
  }

  function actualizarOpciones(index, opciones) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, opciones } : item))
    );
  }

  const total = items.reduce((sum, item) => {
    const opcionesTotal = item.opciones
      ? Object.values(item.opciones).reduce((s, o) => s + (o.activo ? o.precio : 0), 0)
      : 0;
    return sum + item.precio + opcionesTotal;
  }, 0);

  const value = {
    items,
    agregarBaston,
    eliminarItem,
    limpiarCarrito,
    actualizarOpciones,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
