interface Note {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
interface RecordState {
    error: string | null;
    notes: Note[];
    currentNote: Note | null;
    saveNote: (content: string, id?: number) => Promise<void>;
    getNotes: () => Promise<Note[]>;
    getNote: (id: number) => Promise<Note | null>;
    deleteNote: (id: number) => Promise<void>;
    clearError: () => void;
}
export declare const useRecordStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RecordState>>;
export {};
//# sourceMappingURL=recordStore.d.ts.map