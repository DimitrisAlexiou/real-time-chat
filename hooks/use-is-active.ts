import useActiveList from '@/hooks/use-active-list';

export const useIsActive = (email?: string) => {
	const { members } = useActiveList();

	if (!email) return false;

	return members.includes(email);
};
