// src/components/WhatsApp/WhatsAppButton.jsx
import "./WhatsAppButton.css";
import React from "react";

const WHATSAPP_NUMERO = "524351203525";
const WHATSAPP_MENSAJE = "Hola, me interesa recibir mas informacion sobre Sense Vision";

export default function WhatsAppButton() {
  const url = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(WHATSAPP_MENSAJE);

  return (
    React.createElement("a", {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "sv-whatsapp-btn",
      "aria-label": "Contactar por WhatsApp"
    },
      React.createElement("svg", {
        viewBox: "0 0 24 24",
        width: 28,
        height: 28,
        fill: "currentColor",
        "aria-hidden": "true",
        focusable: "false"
      },
        React.createElement("path", {
          d: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.94.56 3.75 1.53 5.28L2 22l4.95-1.6a9.8 9.8 0 0 0 5.09 1.4h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2Zm0 18.07h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.09 1 1-3.01-.2-.31a8.16 8.16 0 0 1-1.25-4.37c0-4.5 3.66-8.16 8.16-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.16-8.16 8.16Zm4.48-6.12c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.07-.39-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.04-.33-.04-.45-.08-.12-.5-1.21-.69-1.66-.18-.43-.37-.37-.51-.38-.13-.01-.29-.01-.45-.01-.16 0-.41.06-.63.31-.21.25-.82.8-.82 1.96 0 1.15.84 2.27.95 2.42.12.16 1.6 2.45 3.88 3.34 1.94.76 2.34.62 2.76.58.43-.04 1.39-.57 1.58-1.12.2-.55.2-1.02.14-1.12-.06-.1-.23-.16-.48-.27Z"
        })
      )
    )
  );
}

