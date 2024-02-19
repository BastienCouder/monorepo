import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceUnderscoresWithSpaces(str: string) {
  return str.replace(/_/g, ' ');
}

export function replaceUnderscoresWithDash(str: string) {
  return str.replace(/_/g, '-');
}

export function replaceEncodedSpaces(str: string) {
  return str.replace(/%20/g, ' ');
}

export const validateString = (value: unknown, maxLength: number) => {
  if (!value || typeof value !== 'string' || value.length > maxLength) {
    return false;
  }
  return true;
};
