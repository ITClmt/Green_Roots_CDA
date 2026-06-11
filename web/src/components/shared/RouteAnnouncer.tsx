import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setMessage(document.title);
    }, 100);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {message}
    </span>
  );
}
