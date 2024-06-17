import { create } from 'zustand';

export type ModalType =
    | 'delete-user'
    | 'add-user-to-team'
    | 'get-key'
    | 'rename-team'
    | 'create-folder-team'
    | 'create-group'
    | 'delete-team'
    | 'dropzone';

interface ModalData {
    userId?: string;
    teamId?: string;
    teamName?: string;
    key?: string;
    keyActive?: boolean;
    parentFolderId?: string;
    storageUsed?: number;
    storageLimit?: number;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
