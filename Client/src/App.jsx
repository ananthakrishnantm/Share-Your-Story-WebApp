import "./App.css";
import { BrowserRouter } from "react-router-dom";

import {
  UseAuth,
  UseAuthProvider,
} from "./components/GlobalStateMangement/UseAuthProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="wrapper background-color">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UseAuthProvider>
            <AppRoutes />
          </UseAuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
