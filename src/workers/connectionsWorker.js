// Runs the O(n * candidates) connection-scoring pass off the main thread so
// large archives (tens of thousands of receipts, once Spotify history is
// included) never freeze the UI while the graph is being built.
import { buildConnections } from "../analysis/connections";

self.onmessage = (event) => {
  const receipts = event.data;
  const connections = buildConnections(receipts);
  self.postMessage(connections);
};
