import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
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

  type UserProfile = {
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

  // Old actor state without feedback, nextFeedbackId, and BehaviorTracking
  type OldActor = {
    inquiries : Map.Map<Nat, Inquiry>;
    nextInquiryId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    searchEvents : Map.Map<Nat, SearchEvent>;
    nextSearchEventId : Nat;
  };

  // New actor state with feedback, nextFeedbackId, and BehaviorTracking
  type NewActor = {
    inquiries : Map.Map<Nat, Inquiry>;
    nextInquiryId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    searchEvents : Map.Map<Nat, SearchEvent>;
    nextSearchEventId : Nat;
    feedback : Map.Map<Nat, FeedbackEntry>;
    nextFeedbackId : Nat;
    behaviorTracking : {
      behaviorEvents : Map.Map<Nat, BehaviorEvent>;
      nextBehaviorEventId : Nat;
    };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      feedback = Map.empty<Nat, FeedbackEntry>();
      nextFeedbackId = 0;
      behaviorTracking = {
        behaviorEvents = Map.empty<Nat, BehaviorEvent>();
        nextBehaviorEventId = 0;
      };
    };
  };
};
