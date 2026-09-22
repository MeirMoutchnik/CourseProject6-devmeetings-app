import type { Group } from '../types/Group';

const API_URL = 'http://localhost:3000/groups';

export const getGroups = async (): Promise<Group[]> => {
    const response = await fetch(`${API_URL}`);
    return response.json();
}
