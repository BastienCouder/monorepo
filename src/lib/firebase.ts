'use client';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA34zw4F-oLK2FJWabRFxN6YVzFGDiZdUk',
  authDomain: 'saas-file-manager-c4e8d.firebaseapp.com',
  projectId: 'saas-file-manager-c4e8d',
  storageBucket: 'saas-file-manager-c4e8d.appspot.com',
  messagingSenderId: '442457240666',
  appId: '1:442457240666:web:3e4779666b97e3bcd01463',
  measurementId: 'G-QGL8C6TBQS',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
