

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PendingRequestsProvider } from "./components/PendingRequestsProvider";

createRoot(document.getElementById("root")!).render(
  <PendingRequestsProvider>
    <App />
  </PendingRequestsProvider>
);
  