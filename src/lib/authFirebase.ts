'use server';
import admin from 'firebase-admin';

export async function createCustomToken(userId: string) {
  try {
    const customToken = await admin.auth().createCustomToken(userId);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw new Error('Could not generate token');
  }
}
