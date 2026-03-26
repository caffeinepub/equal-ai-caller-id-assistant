import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";

actor {
  type Category = {
    #spam;
    #telemarketer;
    #robocall;
    #scam;
    #unknown;
    #legitimate;
  };

  type CallerIDRecord = {
    number : Text;
    name : Text;
    spamRisk : Nat;
    location : Text;
    carrier : Text;
    category : Category;
    reportCount : Nat;
  };

  type CallHistoryEntry = {
    number : Text;
    timestamp : Time.Time;
    action : { #lookup; #call; #report };
  };

  type ContactNote = {
    number : Text;
    note : Text;
    createdAt : Time.Time;
  };

  type NumberReport = {
    number : Text;
    user : Principal;
    reportType : { #spam; #legitimate };
    timestamp : Time.Time;
  };

  // Comparison modules
  module CallerIDRecord {
    public func compare(a : CallerIDRecord, b : CallerIDRecord) : Order.Order {
      Text.compare(a.number, b.number);
    };
  };

  module CallHistoryEntry {
    public func compare(a : CallHistoryEntry, b : CallHistoryEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module ContactNote {
    public func compare(a : ContactNote, b : ContactNote) : Order.Order {
      Text.compare(a.number, b.number);
    };
  };

  module NumberReport {
    public func compare(a : NumberReport, b : NumberReport) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  // Persistent state
  let callerIDMap = Map.empty<Text, CallerIDRecord>();
  let callHistoryMap = Map.empty<Principal, List.List<CallHistoryEntry>>();
  let contactNotesMap = Map.empty<Principal, List.List<ContactNote>>();
  let numberReportsMap = Map.empty<Text, List.List<NumberReport>>();

  // Initialize with sample data
  let initialized = Map.empty<Text, Bool>();

  // Sample data
  let sampleData : [CallerIDRecord] = [
    {
      number = "123-456-7890";
      name = "IRS Scam Caller";
      spamRisk = 95;
      location = "Washington, DC";
      carrier = "AT&T";
      category = #scam;
      reportCount = 5;
    },
    {
      number = "555-123-4567";
      name = "Bank of America";
      spamRisk = 2;
      location = "Charlotte, NC";
      carrier = "Verizon";
      category = #legitimate;
      reportCount = 20;
    },
    {
      number = "800-555-1212";
      name = "Robocall Service";
      spamRisk = 85;
      location = "New York, NY";
      carrier = "T-Mobile";
      category = #robocall;
      reportCount = 12;
    },
    {
      number = "415-555-9999";
      name = "Spam Caller";
      spamRisk = 78;
      location = "San Francisco, CA";
      carrier = "Sprint";
      category = #spam;
      reportCount = 8;
    },
    {
      number = "212-555-1212";
      name = "Unknown Number";
      spamRisk = 50;
      location = "New York, NY";
      carrier = "Unknown";
      category = #unknown;
      reportCount = 2;
    },
    {
      number = "888-555-4321";
      name = "Telemarketing";
      spamRisk = 91;
      location = "Dallas, TX";
      carrier = "AT&T";
      category = #telemarketer;
      reportCount = 15;
    },
    {
      number = "404-555-8888";
      name = "Google Business";
      spamRisk = 1;
      location = "Mountain View, CA";
      carrier = "Verizon";
      category = #legitimate;
      reportCount = 30;
    },
    {
      number = "617-555-2323";
      name = "Spam Risk";
      spamRisk = 73;
      location = "Boston, MA";
      carrier = "T-Mobile";
      category = #spam;
      reportCount = 11;
    },
    {
      number = "202-555-1414";
      name = "Government Office";
      spamRisk = 3;
      location = "Washington, DC";
      carrier = "Sprint";
      category = #legitimate;
      reportCount = 25;
    },
    {
      number = "312-555-7676";
      name = "Scammer";
      spamRisk = 88;
      location = "Chicago, IL";
      carrier = "AT&T";
      category = #scam;
      reportCount = 10;
    },
  ];

  // Initialize persistent state with sample data
  public shared ({ caller }) func initialize() : async () {
    if (initialized.isEmpty()) {
      for (record in sampleData.values()) {
        callerIDMap.add(record.number, record);
      };
      initialized.add("true", true);
    };
  };

  // 1. Phone number lookup/update
  public shared ({ caller }) func addOrUpdateCallerID(record : CallerIDRecord) : async () {
    callerIDMap.add(record.number, record);
  };

  public query ({ caller }) func getCallerID(number : Text) : async CallerIDRecord {
    switch (callerIDMap.get(number)) {
      case (null) {
        {
          number;
          name = "Unknown";
          spamRisk = 50;
          location = "Unknown";
          carrier = "Unknown";
          category = #unknown;
          reportCount = 0;
        };
      };
      case (?record) { record };
    };
  };

  public query ({ caller }) func searchNumber(number : Text) : async ?CallerIDRecord {
    callerIDMap.get(number);
  };

  public query ({ caller }) func getAllCallerIDs() : async [CallerIDRecord] {
    callerIDMap.values().toArray().sort();
  };

  // 2. Call history
  public shared ({ caller }) func logCall(number : Text, action : { #lookup; #call; #report }) : async () {
    let entry : CallHistoryEntry = {
      number;
      timestamp = Time.now();
      action;
    };

    let history = switch (callHistoryMap.get(caller)) {
      case (null) { List.empty<CallHistoryEntry>() };
      case (?entries) { entries };
    };

    history.add(entry);
    callHistoryMap.add(caller, history);
  };

  public query ({ caller }) func getCallHistory() : async [CallHistoryEntry] {
    switch (callHistoryMap.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray().sort() };
    };
  };

  // 3. Contact notes
  public shared ({ caller }) func addContactNote(number : Text, note : Text) : async () {
    let contactNote : ContactNote = {
      number;
      note;
      createdAt = Time.now();
    };

    let notes = switch (contactNotesMap.get(caller)) {
      case (null) { List.empty<ContactNote>() };
      case (?entries) { entries };
    };

    notes.add(contactNote);
    contactNotesMap.add(caller, notes);
  };

  public query ({ caller }) func getContactNotes() : async [ContactNote] {
    switch (contactNotesMap.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray().sort() };
    };
  };

  // 4. Community reports
  public shared ({ caller }) func reportNumber(number : Text, reportType : { #spam; #legitimate }) : async () {
    let report : NumberReport = {
      number;
      user = caller;
      reportType;
      timestamp = Time.now();
    };

    switch (numberReportsMap.get(number)) {
      case (null) {
        let reports = List.empty<NumberReport>();
        reports.add(report);
        numberReportsMap.add(number, reports);
      };
      case (?reports) {
        reports.add(report);
        numberReportsMap.add(number, reports);
      };
    };

    switch (callerIDMap.get(number)) {
      case (null) { () };
      case (?record) {
        let updatedRecord = {
          number = record.number;
          name = record.name;
          spamRisk = if (reportType == #spam) {
            Nat.min(record.spamRisk + 10, 100);
          } else {
            Nat.max(record.spamRisk - 10, 0);
          };
          location = record.location;
          carrier = record.carrier;
          category = record.category;
          reportCount = record.reportCount + 1;
        };
        callerIDMap.add(number, updatedRecord);
      };
    };
  };

  public query ({ caller }) func getNumberReports(number : Text) : async [NumberReport] {
    switch (numberReportsMap.get(number)) {
      case (null) { [] };
      case (?reports) { reports.toArray().sort() };
    };
  };

  // Helper function to check if number exists
  public query ({ caller }) func numberExists(number : Text) : async Bool {
    callerIDMap.containsKey(number);
  };

  // Function to create a new caller ID if not found
  public shared ({ caller }) func createIfNotFound(number : Text) : async CallerIDRecord {
    if (callerIDMap.containsKey(number)) {
      Runtime.trap("Number already exists");
    };
    let newRecord : CallerIDRecord = {
      number;
      name = "Unknown";
      spamRisk = 50;
      location = "Unknown";
      carrier = "Unknown";
      category = #unknown;
      reportCount = 0;
    };
    callerIDMap.add(number, newRecord);
    newRecord;
  };
};
