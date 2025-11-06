import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Contact from "./pages/Contact";
import WriterDashboard from "./pages/writer/WriterDashboard";
import ProducerDashboard from "./pages/producer/ProducerDashboard";
import NotFound from "./pages/NotFound";
import NewScript from "./pages/writer/NewScript";
import Matches from "./pages/writer/Matches";
import Messages from "./pages/writer/Messages";
import Analytics from "./pages/writer/Analytics";
import Discover from "./pages/producer/Discover";
import ProducerMatches from "./pages/producer/Matches";
import ProducerMessages from "./pages/producer/Messages";
import Collections from "./pages/producer/Collections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/writer/dashboard" element={<WriterDashboard />} />
          <Route path="/writer/scripts/new" element={<NewScript />} />
          <Route path="/writer/matches" element={<Matches />} />
          <Route path="/writer/messages" element={<Messages />} />
          <Route path="/writer/analytics" element={<Analytics />} />
          <Route path="/producer/dashboard" element={<ProducerDashboard />} />
          <Route path="/producer/discover" element={<Discover />} />
          <Route path="/producer/matches" element={<ProducerMatches />} />
          <Route path="/producer/messages" element={<ProducerMessages />} />
          <Route path="/producer/collections" element={<Collections />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
