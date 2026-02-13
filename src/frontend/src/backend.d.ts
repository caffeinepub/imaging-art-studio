import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Inquiry {
    id: bigint;
    customerName: string;
    serviceType: ServiceType;
    email: string;
    message: string;
    timestamp: Time;
    phoneNumber: string;
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
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiriesByServiceType(serviceType: ServiceType): Promise<Array<Inquiry>>;
    getInquiryById(id: bigint): Promise<Inquiry | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(serviceType: ServiceType, customerName: string, phoneNumber: string, email: string, message: string): Promise<bigint>;
}
