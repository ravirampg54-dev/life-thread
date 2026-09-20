// Shared keyboard helpers for modal dialogs: Tab cycling + Escape.

function focusableIn(container) {
  if (!container) return [];
  return [...container.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter(
    (element) => element.offsetParent !== null && !element.disabled
  );
}

/**
 * Traps Tab inside `container` and calls `onEscape` on Escape.
 * Returns an unsubscribe function.
 */
export function bindFocusTrap(container, onEscape) {
  const onKey = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onEscape?.();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = focusableIn(container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}

export function restoreFocus(target) {
  if (target instanceof HTMLElement && document.contains(target)) target.focus();
}
