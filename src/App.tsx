<<<<<<< HEAD
=======

>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { HashRouter, Routes, Route } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
<<<<<<< HEAD
        <HashRouter>
=======
        <BrowserRouter>
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
<<<<<<< HEAD
        </HashRouter>
=======
        </BrowserRouter>
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
