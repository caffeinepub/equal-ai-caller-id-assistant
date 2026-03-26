import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Phone, RefreshCw, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { View } from "../App";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import { useCallHistory } from "../hooks/useQueries";

interface HistoryPageProps {
  onNavigate: (view: View, number?: string) => void;
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const { data: history, isLoading } = useCallHistory();
  const [search, setSearch] = useState("");

  const filtered = (history || []).filter((h) =>
    h.number.includes(search.replace(/\D/g, "")),
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNavigate={onNavigate} currentView="history" />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Call History
          </h1>
          <p className="text-muted-foreground mb-6">
            All numbers you've looked up, with timestamps and actions.
          </p>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-border"
              data-ocid="history.search_input"
            />
          </div>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3" data-ocid="history.loading_state">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center" data-ocid="history.empty_state">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  No history yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Look up a number to see it appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((entry, i) => (
                  <motion.div
                    key={`${entry.number}-${String(entry.timestamp)}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    data-ocid={`history.item.${i + 1}`}
                  >
                    <button
                      type="button"
                      onClick={() => onNavigate("lookup", entry.number)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {formatPhoneNumber(entry.number)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {new Date(
                              Number(entry.timestamp) / 1_000_000,
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="capitalize text-xs"
                        >
                          {entry.action}
                        </Badge>
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
