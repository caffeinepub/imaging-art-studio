import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SearchEvent {
    search: string;
    timestamp: Time;
    caller: Principal;
}
export type Time = bigint;
export interface BehaviorEvent {
    id: bigint;
    timestamp: Time;
    details: string;
    caller: Principal;
    eventType: string;
}
export interface Inquiry {
    id: bigint;
    customerName: string;
    serviceType: ServiceType;
    email: string;
    message: string;
    timestamp: Time;
    phoneNumber: string;
}
export interface FeedbackEntry {
    id: bigint;
    feedback?: string;
    timestamp: Time;
    caller: Principal;
    rating?: bigint;
}
export interface UserProfile {
    name: string;
}
export enum ServiceType {
    event = "event",
    wedding = "wedding",
    portrait = "portrait",
    outdoor = "outdoor",
    product = "product",
    preWedding = "preWedding"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBehaviorEvents(): Promise<Array<BehaviorEvent>>;
    getAllFeedback(): Promise<Array<FeedbackEntry>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAverageRating(): Promise<number | null>;
    getBehaviorEventsByType(eventType: string): Promise<Array<BehaviorEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeedbackById(id: bigint): Promise<FeedbackEntry | null>;
    getInquiriesByServiceType(serviceType: ServiceType): Promise<Array<Inquiry>>;
    getInquiryById(id: bigint): Promise<Inquiry | null>;
    getRecentBehaviorEvents(limit: bigint): Promise<Array<BehaviorEvent>>;
    getRecentSearchEvents(limit: bigint): Promise<Array<SearchEvent>>;
    getTopBehaviorEvents(limit: bigint): Promise<Array<[string, bigint]>>;
    getTopSearchQueries(limit: bigint): Promise<Array<[string, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordBehaviorEvent(eventType: string, details: string): Promise<bigint>;
    recordSearchEvent(search: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitFeedback(rating: bigint | null, feedbackText: string | null): Promise<bigint>;
    submitInquiry(serviceType: ServiceType, customerName: string, phoneNumber: string, email: string, message: string): Promise<bigint>;
}
