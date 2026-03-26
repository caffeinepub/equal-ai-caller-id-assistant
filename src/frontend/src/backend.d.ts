import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CallHistoryEntry {
    action: Variant_report_call_lookup;
    number: string;
    timestamp: Time;
}
export interface ContactNote {
    note: string;
    createdAt: Time;
    number: string;
}
export interface NumberReport {
    user: Principal;
    reportType: Variant_spam_legitimate;
    number: string;
    timestamp: Time;
}
export type Time = bigint;
export interface CallerIDRecord {
    reportCount: bigint;
    name: string;
    number: string;
    spamRisk: bigint;
    category: Category;
    carrier: string;
    location: string;
}
export enum Category {
    scam = "scam",
    spam = "spam",
    legitimate = "legitimate",
    telemarketer = "telemarketer",
    robocall = "robocall",
    unknown_ = "unknown"
}
export enum Variant_report_call_lookup {
    report = "report",
    call = "call",
    lookup = "lookup"
}
export enum Variant_spam_legitimate {
    spam = "spam",
    legitimate = "legitimate"
}
export interface backendInterface {
    addContactNote(number: string, note: string): Promise<void>;
    addOrUpdateCallerID(record: CallerIDRecord): Promise<void>;
    createIfNotFound(number: string): Promise<CallerIDRecord>;
    getAllCallerIDs(): Promise<Array<CallerIDRecord>>;
    getCallHistory(): Promise<Array<CallHistoryEntry>>;
    getCallerID(number: string): Promise<CallerIDRecord>;
    getContactNotes(): Promise<Array<ContactNote>>;
    getNumberReports(number: string): Promise<Array<NumberReport>>;
    initialize(): Promise<void>;
    logCall(number: string, action: Variant_report_call_lookup): Promise<void>;
    numberExists(number: string): Promise<boolean>;
    reportNumber(number: string, reportType: Variant_spam_legitimate): Promise<void>;
    searchNumber(number: string): Promise<CallerIDRecord | null>;
}
