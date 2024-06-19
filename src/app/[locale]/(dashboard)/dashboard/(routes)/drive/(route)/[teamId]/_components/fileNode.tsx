"use client";

import { Text } from '@/components/container';
import { Icons } from '@/components/shared/icons';
import React, { useState } from 'react';

type FileNodeProps = {
    node: any; // Adapter le type selon votre structure de données
    files: any[]; // Adapter le type selon votre structure de données
};

const FileNode: React.FC<FileNodeProps> = ({ node, files }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const renderChildren = () => {
        const childFiles = files.filter((file) => file.parentId === node.id);

        return (
            <div className="ml-[12px]">
                {node.children.map((childNode: any) => (
                    <FileNode
                        key={childNode.id}
                        node={childNode}
                        files={files}
                    />
                ))}
                {childFiles.map((file: any) => (
                    <div key={file.id} className="flex items-center">
                        📄 <Text.Span className="ml-1">{file.name}</Text.Span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="">
            <div onClick={handleToggle} className="cursor-pointer flex items-center">
                {isOpen ? <Icons.treeChevronBottom size={12} /> : <Icons.treeChevronRight size={12} />}
                {isOpen ? '📂' : '📁'}
                <Text.Span className="ml-1">{node.name}</Text.Span>
            </div>
            {isOpen && renderChildren()}
        </div>

    );
};

export default FileNode;
