import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { TRPCProvider } from "./providers/trpcProvider.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TRPCProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TRPCProvider>
  </StrictMode>,
);
