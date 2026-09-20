// Shared disclosure state for opening, filtering, and closing evidence sections.

import { useCallback, useState } from "react";

/**
 * Small open/filter/close state machine shared by evidence lists (chapters,
 * threads, discoveries) so each page reuses the same expand pattern.
 *
 * @param {*} [initialValue]
 * @returns {{ value: *, open: Function, close: Function, isOpen: boolean }}
 */
export function useDisclosure(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const open = useCallback((nextValue) => setValue(nextValue), []);
  const close = useCallback(() => setValue(null), []);

  return { value, open, close, isOpen: value !== null };
}