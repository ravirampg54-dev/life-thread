import { useCallback, useState } from "react";

export function useReceiptSelection(initialReceipt = null) {
  const [internalSelectedReceipt, setInternalSelectedReceipt] = useState(initialReceipt ?? null);

  const selectedReceipt = initialReceipt ?? internalSelectedReceipt;

  const openReceipt = useCallback((receipt) => {
    setInternalSelectedReceipt(receipt);
  }, []);

  const closeReceipt = useCallback(() => {
    setInternalSelectedReceipt(null);
  }, []);

  return {
    selectedReceipt,
    openReceipt,
    closeReceipt,
  };
}
