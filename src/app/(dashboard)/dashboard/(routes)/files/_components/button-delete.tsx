'use client';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

interface ButtonDeleteProps {
  path: string; // Chemin complet du fichier/dossier à supprimer
  refreshList: () => void; // Fonction pour rafraîchir la liste après suppression
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ path, refreshList }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/file?path=${encodeURIComponent(path)}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      refreshList(); // Rafraîchir la liste après la suppression réussie
    } catch (error) {
      console.error('Error deleting file or folder:', error);
    }
  };

  return (
    <button onClick={handleDelete} className="ml-4">
      <AiOutlineDelete />
    </button>
  );
};

export default ButtonDelete;
