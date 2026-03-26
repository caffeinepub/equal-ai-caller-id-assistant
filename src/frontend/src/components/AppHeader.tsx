import { Button } from "@/components/ui/button";
import { Phone, Shield } from "lucide-react";
import type { View } from "../App";

interface AppHeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

export default function AppHeader({ onNavigate, currentView }: AppHeaderProps) {
  const navItems: { label: string; view: View }[] = [
    { label: "Features", view: "home" },
    { label: "Lookup", view: "lookup" },
    { label: "History", view: "history" },
    { label: "Notes", view: "notes" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-cta">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Equal AI
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              className={`text-sm font-medium transition-colors ${
                currentView === item.view
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <Button
          onClick={() => onNavigate("lookup")}
          className="gradient-primary text-white font-semibold px-5 py-2 rounded-full shadow-cta border-0 hover:opacity-90 transition-opacity"
          data-ocid="nav.primary_button"
        >
          <Phone className="w-4 h-4 mr-2" />
          Try Lookup
        </Button>
      </div>
    </header>
  );
}
