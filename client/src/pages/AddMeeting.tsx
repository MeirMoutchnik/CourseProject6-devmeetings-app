import { useState, useEffect } from 'react';
import { createMeeting } from '../services/MeetingsService';
import { getGroups } from '../services/GroupsSerive';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Meeting } from '../types/Meeting';
import type { Group } from '../types/Group';

function toDateTimeLocal(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const AddMeeting = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const groupFromUrl = Number(searchParams.get('group_code')) || 0;
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [meeting, setMeeting] = useState<Meeting>({
        meeting_code: 0,
        group_code: groupFromUrl,
        meeting_name: '',
        meeting_start: new Date(),
        meeting_end: new Date(Date.now() + 60 * 60 * 1000),
        meeting_description: '',
        meeting_room: ''
    });
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function loadGroups() {
            try {
                setError(null);
                const data = await getGroups();
                if (!Array.isArray(data)) {
                    setError('Groups not found');
                    return;
                }
                setGroups(data);
            } catch (error) {
                setError('Groups not found: ' + error);
            }
        }
        loadGroups();
    }, []);

    useEffect(() => {
        if (groupFromUrl) {
            setMeeting((prev) => prev.group_code === groupFromUrl ? prev : { ...prev, group_code: groupFromUrl });
        }
    }, [groupFromUrl]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            const start = new Date(meeting.meeting_start);
            const end = new Date(meeting.meeting_end);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
                setError('Meeting start must be before meeting end');
                return;
            }
            if (!meeting.group_code) {
                setError('Select a group');
                return;
            }

            if (meeting.meeting_start < new Date()) {
                setError('Meeting start must be in the future');
                return;
            }

            const response = await createMeeting(meeting) as Meeting & { error?: string };
            if (!response?.meeting_code) {
                setError(response.error ?? 'Meeting not created. Log in first.');
                return;
            }
            setSuccess('Meeting created successfully');
            navigate(`/meetings?group_code=${meeting.group_code}`);
        } catch (error) {
            setError('Error adding meeting: ' + error);
        }
    }

    return (
        <div className="page">
            <h1>Add Meeting</h1>
            <form onSubmit={handleSubmit}>
                <select value={meeting.group_code || ''} onChange={(e) => setMeeting({ ...meeting, group_code: parseInt(e.target.value) || 0 })}>
                    {!meeting.group_code && <option value="">Select a group</option>}
                    {groups.map((group) => (
                        <option key={group.group_code} value={group.group_code}>{group.group_name}</option>
                    ))}
                </select>
                <input type="text" placeholder="Meeting Name" value={meeting.meeting_name} onChange={(e) => setMeeting({ ...meeting, meeting_name: e.target.value })} required />
                <input type="datetime-local" value={toDateTimeLocal(meeting.meeting_start)} onChange={(e) => setMeeting({ ...meeting, meeting_start: new Date(e.target.value) })} required />
                <input type="datetime-local" value={toDateTimeLocal(meeting.meeting_end)} onChange={(e) => setMeeting({ ...meeting, meeting_end: new Date(e.target.value) })} required />
                <input type="text" placeholder="Meeting Description" value={meeting.meeting_description} onChange={(e) => setMeeting({ ...meeting, meeting_description: e.target.value })} required />
                <input type="text" placeholder="Meeting Room" value={meeting.meeting_room} onChange={(e) => setMeeting({ ...meeting, meeting_room: e.target.value })} required />
                <button type="submit">Add Meeting</button>
            </form>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
        </div>
    )
}
