import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  let inquiries = Map.empty<Nat, Inquiry>();
  var nextInquiryId = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();

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
};
