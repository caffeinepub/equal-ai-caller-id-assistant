import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import LookupPage from "./pages/LookupPage";
import NotesPage from "./pages/NotesPage";

export type View = "home" | "lookup" | "history" | "notes";

const queryClient = new QueryClient();

export default function App() {
  const [view, setView] = useState<View>("home");
  const [lookupNumber, setLookupNumber] = useState("");

  const navigateTo = (v: View, number?: string) => {
    if (number) setLookupNumber(number);
    setView(v);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {view === "home" && <LandingPage onNavigate={navigateTo} />}
      {view === "lookup" && (
        <LookupPage onNavigate={navigateTo} initialNumber={lookupNumber} />
      )}
      {view === "history" && <HistoryPage onNavigate={navigateTo} />}
      {view === "notes" && <NotesPage onNavigate={navigateTo} />}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
