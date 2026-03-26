import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  History,
  Loader2,
  MapPin,
  Phone,
  Search,
  Signal,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { View } from "../App";
import { Category, Variant_spam_legitimate } from "../backend";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import {
  useAddNote,
  useCallHistory,
  useReportNumber,
  useSearchNumber,
} from "../hooks/useQueries";

type CountryCode = "US" | "IN";

const COUNTRY_OPTIONS: Record<
  CountryCode,
  { flag: string; code: string; placeholder: string; label: string }
> = {
  US: {
    flag: "🇺🇸",
    code: "+1",
    placeholder: "(555) 000-0000",
    label: "United States",
  },
  IN: { flag: "🇮🇳", code: "+91", placeholder: "98765 43210", label: "India" },
};

interface LookupPageProps {
  onNavigate: (view: View, number?: string) => void;
  initialNumber?: string;
}

function formatPhoneNumber(value: string, country: CountryCode = "US") {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (country === "IN") {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function getRiskColor(risk: number) {
  if (risk < 30) return "bg-green-500";
  if (risk < 70) return "bg-yellow-500";
  return "bg-red-500";
}

function getRiskLabel(risk: number) {
  if (risk < 30)
    return { label: "Safe", color: "text-green-600", bg: "bg-green-50" };
  if (risk < 70)
    return { label: "Caution", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { label: "Danger", color: "text-red-600", bg: "bg-red-50" };
}

function getCategoryColor(
  cat: Category,
): "default" | "destructive" | "secondary" | "outline" {
  switch (cat) {
    case Category.scam:
      return "destructive";
    case Category.spam:
      return "destructive";
    case Category.legitimate:
      return "default";
    default:
      return "secondary";
  }
}

export default function LookupPage({
  onNavigate,
  initialNumber = "",
}: LookupPageProps) {
  const [country, setCountry] = useState<CountryCode>("IN");
  const [rawInput, setRawInput] = useState(initialNumber);
  const [searchTrigger, setSearchTrigger] = useState(initialNumber.length > 0);
  const [noteText, setNoteText] = useState("");

  const rawDigits = rawInput.replace(/\D/g, "");
  const {
    data: result,
    isLoading,
    error,
  } = useSearchNumber(rawDigits, searchTrigger && rawDigits.length >= 7);
  const { data: history } = useCallHistory();
  const reportMutation = useReportNumber();
  const addNoteMutation = useAddNote();

  useEffect(() => {
    if (initialNumber) {
      setRawInput(formatPhoneNumber(initialNumber.replace(/\D/g, ""), country));
      setSearchTrigger(true);
    }
  }, [initialNumber, country]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(formatPhoneNumber(e.target.value, country));
    setSearchTrigger(false);
  };

  const handleCountryChange = (val: CountryCode) => {
    setCountry(val);
    setRawInput("");
    setSearchTrigger(false);
  };

  const handleLookup = () => {
    if (rawDigits.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSearchTrigger(true);
  };

  const handleReport = async (type: Variant_spam_legitimate) => {
    if (!rawDigits) return;
    await reportMutation.mutateAsync({ number: rawDigits, reportType: type });
    toast.success(
      type === Variant_spam_legitimate.spam
        ? "Reported as spam"
        : "Reported as legitimate",
    );
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !rawDigits) return;
    await addNoteMutation.mutateAsync({
      number: rawDigits,
      note: noteText.trim(),
    });
    setNoteText("");
    toast.success("Note saved!");
  };

  const spamRisk = result ? Math.min(100, Number(result.spamRisk)) : 0;
  const riskInfo = getRiskLabel(spamRisk);

  const recentHistory = (history || []).slice(0, 5);
  const countryOpt = COUNTRY_OPTIONS[country];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNavigate={onNavigate} currentView="lookup" />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Caller Lookup
          </h1>
          <p className="text-muted-foreground mb-8">
            Enter a phone number to identify the caller and check for spam.
          </p>

          {/* Search box */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
            <label
              htmlFor="phone-input"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <Select
                value={country}
                onValueChange={(v) => handleCountryChange(v as CountryCode)}
              >
                <SelectTrigger className="w-[110px] shrink-0 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 +1</SelectItem>
                  <SelectItem value="IN">🇮🇳 +91</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone-input"
                type="tel"
                placeholder={countryOpt.placeholder}
                value={rawInput}
                onChange={handleInput}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="flex-1 text-base font-medium rounded-lg border-border"
                data-ocid="lookup.input"
              />
              <Button
                onClick={handleLookup}
                disabled={isLoading}
                className="gradient-primary text-white font-semibold rounded-lg px-5 border-0 hover:opacity-90 shadow-cta"
                data-ocid="lookup.primary_button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Lookup</span>
              </Button>
            </div>
          </div>

          {/* Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl shadow-card p-8 text-center mb-6"
                data-ocid="lookup.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  Analyzing number…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div
              className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6"
              data-ocid="lookup.error_state"
            >
              <p className="text-destructive text-sm font-medium">
                Failed to look up number. Please try again.
              </p>
            </div>
          )}

          {/* Result card */}
          <AnimatePresence>
            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="bg-card rounded-2xl shadow-card p-6 mb-6"
                data-ocid="lookup.panel"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground">
                      {result.name || "Unknown Caller"}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      {countryOpt.flag} {countryOpt.code} {rawInput}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold ${riskInfo.bg} ${riskInfo.color}`}
                  >
                    {riskInfo.label}
                  </div>
                </div>

                {/* Spam risk meter */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                    <span>Spam Risk</span>
                    <span>{spamRisk}%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${spamRisk}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`h-full rounded-full ${getRiskColor(spamRisk)}`}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge
                    variant={getCategoryColor(result.category)}
                    className="capitalize"
                  >
                    {result.category}
                  </Badge>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {result.location || "Unknown"}
                    </div>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Signal className="w-3.5 h-3.5" /> Carrier
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {result.carrier || "Unknown"}
                    </div>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Users className="w-3.5 h-3.5" /> Reports
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {String(result.reportCount)} community reports
                    </div>
                  </div>
                </div>

                {/* Report buttons */}
                <div className="flex gap-2 mb-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReport(Variant_spam_legitimate.spam)}
                    disabled={reportMutation.isPending}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    data-ocid="lookup.delete_button"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Report as Spam
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleReport(Variant_spam_legitimate.legitimate)
                    }
                    disabled={reportMutation.isPending}
                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                    data-ocid="lookup.secondary_button"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Report as Legitimate
                  </Button>
                </div>

                {/* Add note */}
                <div>
                  <label
                    htmlFor="note-input"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    <FileText className="w-4 h-4 inline mr-1" />
                    Add Personal Note
                  </label>
                  <Textarea
                    id="note-input"
                    placeholder="Add a note about this number…"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="mb-2 resize-none text-sm"
                    rows={2}
                    data-ocid="lookup.textarea"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!noteText.trim() || addNoteMutation.isPending}
                    className="gradient-primary text-white border-0 hover:opacity-90"
                    data-ocid="lookup.save_button"
                  >
                    {addNoteMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    ) : null}
                    Save Note
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent history */}
          {recentHistory.length > 0 && (
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Recent Lookups</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("history")}
                  className="text-primary text-xs"
                  data-ocid="lookup.link"
                >
                  <History className="w-3.5 h-3.5 mr-1" />
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {recentHistory.map((entry, i) => (
                  <button
                    key={`${entry.number}-${entry.timestamp}`}
                    type="button"
                    onClick={() => onNavigate("lookup", entry.number)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-left"
                    data-ocid={`lookup.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {formatPhoneNumber(entry.number, country)}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {entry.action}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        Number(entry.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
