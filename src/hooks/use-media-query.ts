'use client';
import { useState, useEffect } from 'react';

// Hook personnalisé useMediaQuery
export const useMediaQuery = (query: any) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Mise à jour de l'état initial si la requête correspond
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Fonction à appeler lorsque l'état de correspondance change
    const listener = () => {
      setMatches(media.matches);
    };

    // Écouter les changements
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
