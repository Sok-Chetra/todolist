import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import React, { useEffect } from 'react';

const Firebase = () => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyCafdvsn-Rp2uzuO_HStkYGdp1U9l6h7Jo',
    authDomain: 'todo-list-4313d.firebaseapp.com',
    projectId: 'todo-list-4313d',
    storageBucket: 'todo-list-4313d.appspot.com',
    messagingSenderId: '170516655745',
    appId: '1:170516655745:web:e0e289fbdb8121471ee780',
    measurementId: 'G-FNJM3RR2HX',
  };

  useEffect(() => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }, []);

  return;
};

export default Firebase;
