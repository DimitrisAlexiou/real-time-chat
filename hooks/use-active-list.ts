import { create } from 'zustand';

interface ActiveListStore {
	members: string[];
	add: (id: string) => void;
	remove: (id: string) => void;
	set: (id: string[]) => void;
}

const useActiveList = create<ActiveListStore>((set) => ({
	members: [],
	add: (id: string) => set((state) => ({ members: [...state.members, id] })),
	remove: (id: string) =>
		set((state) => ({
			members: state.members.filter((memberId) => memberId !== id),
		})),
	set: (members: string[]) => set({ members }),
}));

export default useActiveList;
