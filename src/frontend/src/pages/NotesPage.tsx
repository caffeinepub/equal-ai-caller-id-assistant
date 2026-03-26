import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, FileText, StickyNote, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { View } from "../App";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";
import { useAddNote, useContactNotes } from "../hooks/useQueries";

interface NotesPageProps {
  onNavigate: (view: View, number?: string) => void;
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3"];

export default function NotesPage({ onNavigate }: NotesPageProps) {
  const { data: notes, isLoading } = useContactNotes();
  const addNoteMutation = useAddNote();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const getKey = (number: string, idx: number) => `${number}-${idx}`;

  const handleEdit = (key: string, text: string) => {
    setEditingKey(key);
    setEditText(text);
  };

  const handleSaveEdit = async (number: string) => {
    if (!editText.trim()) return;
    await addNoteMutation.mutateAsync({ number, note: editText.trim() });
    setEditingKey(null);
    toast.success("Note updated!");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNavigate={onNavigate} currentView="notes" />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Personal Notes
          </h1>
          <p className="text-muted-foreground mb-8">
            Your private notes for remembered phone numbers.
          </p>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4" data-ocid="notes.loading_state">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : !notes || notes.length === 0 ? (
              <div className="p-12 text-center" data-ocid="notes.empty_state">
                <StickyNote className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  No notes yet
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add notes while looking up numbers.
                </p>
                <Button
                  onClick={() => onNavigate("lookup")}
                  className="gradient-primary text-white border-0 hover:opacity-90 rounded-full px-5"
                  data-ocid="notes.primary_button"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Go to Lookup
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {notes.map((note, i) => {
                    const key = getKey(note.number, i);
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 py-4"
                        data-ocid={`notes.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => onNavigate("lookup", note.number)}
                              className="text-sm font-semibold text-primary hover:underline mb-1 block"
                              data-ocid="notes.link"
                            >
                              {formatPhoneNumber(note.number)}
                            </button>
                            {editingKey === key ? (
                              <div className="mt-2">
                                <Textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="text-sm resize-none mb-2"
                                  rows={2}
                                  data-ocid="notes.textarea"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(note.number)}
                                    disabled={addNoteMutation.isPending}
                                    className="gradient-primary text-white border-0 hover:opacity-90"
                                    data-ocid="notes.save_button"
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingKey(null)}
                                    data-ocid="notes.cancel_button"
                                  >
                                    <X className="w-3.5 h-3.5 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {note.note}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground/60 mt-2">
                              {new Date(
                                Number(note.createdAt) / 1_000_000,
                              ).toLocaleString()}
                            </p>
                          </div>
                          {editingKey !== key && (
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(key, note.note)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                data-ocid={`notes.edit_button.${i + 1}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                data-ocid={`notes.delete_button.${i + 1}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
