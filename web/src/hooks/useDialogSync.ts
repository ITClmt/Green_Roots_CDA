import { useEffect, useRef } from "react";

/**
 * Synchronise l'état ouvert/fermé d'un <dialog> natif avec React.
 * Gère également la touche Échap via l'événement natif "close".
 */
export function useDialogSync(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  return dialogRef;
}
