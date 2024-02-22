/* eslint-disable no-prototype-builtins */
import { LucideIcon } from 'lucide-react';

export function isEmpty(obj: object) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

type OptionType = {
  label: string;
  value: string;
  icon?: LucideIcon;
}[];

export function enumToKeyValueArray(obj: object) {
  let array: OptionType = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      array.push({
        // @ts-expect-error
        label: obj[key],
        // @ts-expect-error
        value: obj[key],
      });
    }
  }
  return array;
}

export function enumToArray(obj: object) {
  let array: string[] = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      array.push(
        // @ts-expect-error
        obj[key]
      );
    }
  }
  return array;
}
