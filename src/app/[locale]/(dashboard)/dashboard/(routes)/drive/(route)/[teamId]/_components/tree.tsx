"use client";

import React from 'react';
import FileNode from './fileNode';
import { Container, Text } from '@/components/container';

type FileTreeProps = {
    data: any;
};

const Tree: React.FC<FileTreeProps> = ({ data }) => {
    const rootFolders = data.folders.data.filter((folder: any) => folder.parentId === null);

    return (

        <div className='max-h-[250px]'>
            <Container.Div className="flex flex-col gap-0 mb-2">
                <Text.H3>Arbre</Text.H3>
                <Text.Small>cet arbre represente tout les dossier et fichiers du groupe</Text.Small>
            </Container.Div>
            {rootFolders.length > 0 ? (
                <div className='overflow-auto scrollbar-custom-small max-h-[170px]'>
                    {rootFolders.map((folder: any) => (
                        <FileNode
                            key={folder.id}
                            node={folder}
                            files={data.files.data}
                        />
                    ))}
                </div>
            ) : (
                <Text.Small>Il n'y a pas de dossier</Text.Small>
            )}
        </div>
    );
};

export default Tree;
