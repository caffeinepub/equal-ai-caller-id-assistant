import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CallHistoryEntry,
  type CallerIDRecord,
  type ContactNote,
  Variant_report_call_lookup,
  type Variant_spam_legitimate,
} from "../backend";
import { useActor } from "./useActor";

export function useCallHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<CallHistoryEntry[]>({
    queryKey: ["callHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactNote[]>({
    queryKey: ["contactNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchNumber(number: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<CallerIDRecord | null>({
    queryKey: ["searchNumber", number],
    queryFn: async () => {
      if (!actor) return null;
      await actor.logCall(number, Variant_report_call_lookup.lookup);
      return actor.createIfNotFound(number);
    },
    enabled: !!actor && !isFetching && enabled && number.length > 0,
  });
}

export function useReportNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      number,
      reportType,
    }: { number: string; reportType: Variant_spam_legitimate }) => {
      if (!actor) throw new Error("No actor");
      await actor.reportNumber(number, reportType);
    },
    onSuccess: (_data, { number }) => {
      queryClient.invalidateQueries({ queryKey: ["searchNumber", number] });
    },
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ number, note }: { number: string; note: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.addContactNote(number, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactNotes"] });
    },
  });
}
