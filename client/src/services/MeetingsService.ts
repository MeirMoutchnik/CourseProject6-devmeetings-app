import type { Meeting } from '../types/Meeting';

const API_URL = 'http://localhost:3000/meetings';

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`,
    };
}

export const getMeetings = async (group_code: string): Promise<Meeting[]> => {
    const response = await fetch(`${API_URL}/${group_code}`);
    return response.json();
}

export const getMeeting = async (group_code: string, meeting_code: string): Promise<Meeting> => {
    const response = await fetch(`${API_URL}/${group_code}/${meeting_code}`);
    return response.json();
}

export const createMeeting = async (meeting: Meeting): Promise<Meeting> => {
    const response = await fetch(`${API_URL}/${meeting.group_code}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(meeting),
    });
    return response.json();
}

export const updateMeeting = async (group_code: string, meeting_code: string, meeting: Meeting): Promise<Meeting> => {
    const response = await fetch(`${API_URL}/${group_code}/${meeting_code}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(meeting),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error ?? 'Meeting not updated');
    }
    return data;
}

export const deleteMeeting = async (group_code: string, meeting_code: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${group_code}/${meeting_code}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error ?? 'Meeting not deleted');
    }
    return data;
}
