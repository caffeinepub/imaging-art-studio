import { ServiceType } from '../backend';

export const serviceTypeOptions = [
  { value: ServiceType.wedding, label: 'Wedding Photography' },
  { value: ServiceType.preWedding, label: 'Pre-Wedding Shoots' },
  { value: ServiceType.product, label: 'Product Photography' },
  { value: ServiceType.event, label: 'Event Photography' },
  { value: ServiceType.portrait, label: 'Portrait Photography' },
  { value: ServiceType.outdoor, label: 'Outdoor Shoots' },
];

export function getServiceTypeLabel(serviceType: ServiceType): string {
  const option = serviceTypeOptions.find((opt) => opt.value === serviceType);
  return option?.label || serviceType;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - at least 10 digits
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}
