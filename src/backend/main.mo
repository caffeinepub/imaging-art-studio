import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ServiceType = {
    #wedding;
    #preWedding;
    #product;
    #event;
    #portrait;
    #outdoor;
  };

  type Inquiry = {
    id : Nat;
    timestamp : Time.Time;
    serviceType : ServiceType;
    customerName : Text;
    phoneNumber : Text;
    email : Text;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  type SearchEvent = {
    timestamp : Time.Time;
    caller : Principal;
    search : Text;
  };

  type FeedbackEntry = {
    timestamp : Time.Time;
    id : Nat;
    caller : Principal;
    rating : ?Nat;
    feedback : ?Text;
  };

  type BehaviorEvent = {
    timestamp : Time.Time;
    id : Nat;
    caller : Principal;
    eventType : Text;
    details : Text;
  };

  let inquiries = Map.empty<Nat, Inquiry>();
  var nextInquiryId = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let searchEvents = Map.empty<Nat, SearchEvent>();
  var nextSearchEventId = 0;
  let feedback = Map.empty<Nat, FeedbackEntry>();
  var nextFeedbackId = 0;
  type BehaviorTracking = {
    behaviorEvents : Map.Map<Nat, BehaviorEvent>;
    nextBehaviorEventId : Nat;
  };
  var behaviorTracking = {
    behaviorEvents = Map.empty<Nat, BehaviorEvent>();
    nextBehaviorEventId = 0;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Inquiry Submission - Open to all users including anonymous/guests
  public shared ({ caller }) func submitInquiry(
    serviceType : ServiceType,
    customerName : Text,
    phoneNumber : Text,
    email : Text,
    message : Text,
  ) : async Nat {
    let id = nextInquiryId;
    nextInquiryId += 1;

    let inquiry : Inquiry = {
      id;
      timestamp = Time.now();
      serviceType;
      customerName;
      phoneNumber;
      email;
      message;
    };

    inquiries.add(id, inquiry);
    id;
  };

  // Inquiry Retrieval - Restricted to authenticated users only
  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inquiries");
    };
    inquiries.values().toArray();
  };

  public query ({ caller }) func getInquiryById(id : Nat) : async ?Inquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inquiries");
    };
    inquiries.get(id);
  };

  public query ({ caller }) func getInquiriesByServiceType(serviceType : ServiceType) : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inquiries");
    };
    inquiries.values().toArray().filter(
      func(inquiry) { inquiry.serviceType == serviceType }
    );
  };

  // Search Analytics
  public shared ({ caller }) func recordSearchEvent(search : Text) : async () {
    let id = nextSearchEventId;
    nextSearchEventId += 1;

    let event : SearchEvent = {
      timestamp = Time.now();
      caller;
      search;
    };

    searchEvents.add(id, event);
  };

  public query ({ caller }) func getRecentSearchEvents(limit : Nat) : async [SearchEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view search analytics");
    };

    let events = searchEvents.values().toArray();
    let reversed = events.reverse();
    reversed.sliceToArray(0, Nat.min(limit, events.size()));
  };

  public query ({ caller }) func getTopSearchQueries(limit : Nat) : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view search analytics");
    };

    let queryCounts = Map.empty<Text, Nat>();

    for (event in searchEvents.values()) {
      let count = switch (queryCounts.get(event.search)) {
        case (?existing) { existing + 1 };
        case (null) { 1 };
      };
      queryCounts.add(event.search, count);
    };

    let sortedEntries = queryCounts.toArray();
    sortedEntries.sliceToArray(0, Nat.min(limit, sortedEntries.size()));
  };

  // Feedback Management
  public shared ({ caller }) func submitFeedback(rating : ?Nat, feedbackText : ?Text) : async Nat {
    let id = nextFeedbackId;
    nextFeedbackId += 1;

    let entry : FeedbackEntry = {
      id;
      timestamp = Time.now();
      caller;
      rating;
      feedback = feedbackText;
    };

    feedback.add(id, entry);
    id;
  };

  public query ({ caller }) func getAllFeedback() : async [FeedbackEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };
    feedback.values().toArray();
  };

  public query ({ caller }) func getFeedbackById(id : Nat) : async ?FeedbackEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view feedback");
    };
    feedback.get(id);
  };

  public query ({ caller }) func getAverageRating() : async ?Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view rating analytics");
    };

    let ratings = feedback.values().toArray().map(
      func(entry) { entry.rating }
    ).filter(
      func(r) { r != null }
    ).map(
      func(optNat) {
        switch (optNat) {
          case (?v) { v };
          case (null) { 0 };
        };
      }
    );
    if (ratings.size() == 0) { return null };
    let sum = ratings.foldLeft(
      0,
      func(acc, r) { acc + r },
    );
    ?((sum.toFloat()) / (ratings.size().toInt().toFloat()));
  };

  // Behavior Tracking Management
  public shared ({ caller }) func recordBehaviorEvent(eventType : Text, details : Text) : async Nat {
    let id = behaviorTracking.nextBehaviorEventId;
    behaviorTracking := {
      behaviorTracking with nextBehaviorEventId = id + 1;
    };

    let event : BehaviorEvent = {
      id;
      timestamp = Time.now();
      caller;
      eventType;
      details;
    };

    behaviorTracking.behaviorEvents.add(id, event);
    id;
  };

  public query ({ caller }) func getAllBehaviorEvents() : async [BehaviorEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all behavior events");
    };
    behaviorTracking.behaviorEvents.values().toArray();
  };

  public query ({ caller }) func getBehaviorEventsByType(eventType : Text) : async [BehaviorEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view behavior events");
    };
    let allEvents = behaviorTracking.behaviorEvents.values().toArray();
    allEvents.filter(
      func(event) { event.eventType == eventType }
    );
  };

  public query ({ caller }) func getRecentBehaviorEvents(limit : Nat) : async [BehaviorEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view behavior events");
    };

    let events = behaviorTracking.behaviorEvents.values().toArray();
    let reversed = events.reverse();
    reversed.sliceToArray(0, Nat.min(limit, events.size()));
  };

  public query ({ caller }) func getTopBehaviorEvents(limit : Nat) : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view behavior analytics");
    };

    let eventCounts = Map.empty<Text, Nat>();

    for (event in behaviorTracking.behaviorEvents.values()) {
      let count = switch (eventCounts.get(event.eventType)) {
        case (?existing) { existing + 1 };
        case (null) { 1 };
      };
      eventCounts.add(event.eventType, count);
    };

    let sortedEntries = eventCounts.toArray();
    sortedEntries.sliceToArray(0, Nat.min(limit, sortedEntries.size()));
  };
};
