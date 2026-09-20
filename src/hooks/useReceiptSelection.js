// Shared receipt drawer selection and connection lookup state for evidence views.

import { useCallback, useState } from "react";
import { getConnectedReceipts } from "../analysis";

/**
 * Coordinates the selected receipt, its related connections, and drawer actions.
 *
 * @param {Receipt|null} initialReceipt
 * @param {Connection[]} connections
 * @param {Map<string, Receipt>} receiptsById
 * @returns {{
 *   selectedReceipt: Receipt|null,
 *   openReceipt: Function,
 *   closeReceipt: Function,
 *   connectedReceipts: object[],
 *   drawerProps: { receipt: Receipt|null, onClose: Function, onSelect: Function, connections: Connection[], receiptsById: Map<string, Receipt> }
 * }}
 */
export function useReceiptSelection(initialReceipt = null, connections = [], receiptsById = new Map(), connectionsByReceipt = null) {
  const [internalSelectedReceipt, setInternalSelectedReceipt] = useState(initialReceipt ?? null);

  const selectedReceipt = initialReceipt ?? internalSelectedReceipt;

  const openReceipt = useCallback((receipt) => {
    setInternalSelectedReceipt(receipt);
  }, []);

  const closeReceipt = useCallback(() => {
    setInternalSelectedReceipt(null);
  }, []);

  const connectedReceipts = selectedReceipt
    ? connectionsByReceipt
      ? (connectionsByReceipt.get(selectedReceipt.id) || [])
          .map((conn) => ({
            receipt: receiptsById.get(conn.sourceId === selectedReceipt.id ? conn.targetId : conn.sourceId),
            conn,
          }))
          .filter((row) => row.receipt)
          .sort((a, b) => b.conn.score - a.conn.score)
      : getConnectedReceipts(selectedReceipt.id, connections, receiptsById)
    : [];

  return {
    selectedReceipt,
    openReceipt,
    closeReceipt,
    connectedReceipts,
    drawerProps: {
      receipt: selectedReceipt,
      onClose: closeReceipt,
      onSelect: openReceipt,
      connections,
      receiptsById,
      connectedReceipts,
    },
  };
}
