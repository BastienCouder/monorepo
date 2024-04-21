
"use client"
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface SelectionContextType {
    selectedItems: string[];
    toggleItem: (itemId: string) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const useSelection = () => {
    const context = useContext(SelectionContext);
    if (!context) {
        throw new Error('useSelection must be used within a SelectionProvider');
    }
    return context;
};

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    console.log(selectedItems);

    const toggleItem = (itemId: string) => {
        setSelectedItems(prev => {
            const index = prev.indexOf(itemId);
            if (index > -1) {

                return [...prev.slice(0, index), ...prev.slice(index + 1)];
            } else {

                return [...prev, itemId];
            }
        });
    };

    return (
        <SelectionContext.Provider value={{ selectedItems, toggleItem }}>
            {children}
        </SelectionContext.Provider>
    );
};

export const useSelectedItems = () => {
    const { selectedItems } = useSelection();
    return selectedItems;
};
