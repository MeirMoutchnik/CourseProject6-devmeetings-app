import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Meeting } from '../types/Meeting';
import { getMeeting, updateMeeting } from '../services/MeetingsService';

function toDateTimeLocal(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const UpdateMeeting = () => {
    const navigate = useNavigate();
    const { group_code, meeting_code } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [meeting, setMeeting] = useState<Meeting | null>(null);

    useEffect(() => {
        async function loadMeeting() {
            if (!group_code || !meeting_code) {
                setError('Meeting not found');
                return;
            }
            try {
                const data = await getMeeting(group_code, meeting_code);
                if (!data?.meeting_code) {
                    setError('Meeting not found');
                    return;
                }
                setMeeting({
                    ...data,
                    group_code: Number(data.group_code ?? group_code),
                    meeting_code: Number(data.meeting_code),
                    meeting_start: new Date(data.meeting_start),
                    meeting_end: new Date(data.meeting_end),
                });
            } catch (error) {
                setError('Meeting not found: ' + error);
            }
        }
        loadMeeting();
    }, [group_code, meeting_code]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!meeting || !group_code || !meeting_code) {
            return;
        }
        try {
            setError(null);
            setSuccess(null);
            const start = new Date(meeting.meeting_start);
            const end = new Date(meeting.meeting_end);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
                setError('Meeting start must be before meeting end');
                return;
            }
            const response = await updateMeeting(group_code, meeting_code, meeting) as Meeting & { error?: string };
            if (!response?.meeting_code) {
                setError(response.error ?? 'Meeting not updated. Log in first.');
                return;
            }
            setSuccess('Meeting updated successfully');
            navigate(`/meetings?group_code=${group_code}`);
        } catch (error) {
            setError('Meeting not updated: ' + error);
        }
    }

    if (!meeting) {
        return (
            <div className="page">
                <h1>Update Meeting</h1>
                {error && <p className="form-error">{error}</p>}
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Update Meeting</h1>
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Meeting Code" value={meeting.meeting_code} readOnly />
                <input type="number" placeholder="Group Code" value={meeting.group_code} onChange={(e) => setMeeting({ ...meeting, group_code: parseInt(e.target.value) || 0 })} />
                <input type="text" placeholder="Meeting Name" value={meeting.meeting_name} onChange={(e) => setMeeting({ ...meeting, meeting_name: e.target.value })} required />
                <input type="datetime-local" value={toDateTimeLocal(meeting.meeting_start)} onChange={(e) => setMeeting({ ...meeting, meeting_start: new Date(e.target.value) })} required />
                <input type="datetime-local" value={toDateTimeLocal(meeting.meeting_end)} onChange={(e) => setMeeting({ ...meeting, meeting_end: new Date(e.target.value) })} required />
                <input type="text" placeholder="Description" value={meeting.meeting_description} onChange={(e) => setMeeting({ ...meeting, meeting_description: e.target.value })} required />
                <input type="text" placeholder="Room" value={meeting.meeting_room} onChange={(e) => setMeeting({ ...meeting, meeting_room: e.target.value })} required />
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(`/meetings?group_code=${group_code}`)}>Cancel</button>
            </form>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
        </div>
    );
}
