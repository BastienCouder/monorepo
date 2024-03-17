'use client';

import React, { useState } from 'react';

interface CreateFileProps {
  basePath: string;
}

const CreateFile: React.FC<CreateFileProps> = ({ basePath }) => {
  const [fileName, setFileName] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:3000/api/file/createFile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: `${basePath}/${fileName}` }),
        }
      );
      if (response.ok) {
        setFileName('');
      } else {
        alert('Échec de la création du fichier');
      }
    } catch (error) {
      console.error('Erreur lors de la création du fichier:', error);
    }
  };

  return (
    <div>
      <h2>Créer un fichier</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Nom du fichier"
          required
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateFile;
