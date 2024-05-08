'use server';

import { storage } from '@/lib/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export async function downloadFile(fileName: string) {
  try {
    const fileRef = ref(storage, fileName);
    const fileUrl = await getDownloadURL(fileRef);
    return { url: fileUrl };
  } catch (error: any) {
    // Retourner l'erreur dans une structure que vous pouvez gérer côté client
    return { error: error.message };
  }
}
