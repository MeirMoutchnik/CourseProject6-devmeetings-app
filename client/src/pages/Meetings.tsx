import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Meeting } from '../types/Meeting';
import type { Group } from '../types/Group';
import { getMeetings, deleteMeeting } from '../services/MeetingsService';
import { getGroups } from '../services/GroupsSerive';

function formatMeetingDate(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return String(value);
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMeetingDuration(start: Date | string, end: Date | string) {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return '';
    }
    const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    if (totalMinutes < 0) {
        return '';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
        return `${minutes} min`;
    }
    if (minutes === 0) {
        return `${hours} h`;
    }
    return `${hours} h ${minutes} min`;
}

export const Meetings = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const group_code = searchParams.get('group_code') ?? '';
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadGroups() {
            try {
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
        async function loadMeetings() {
            try {
                setError(null);
                if (!group_code) {
                    setMeetings([]);
                    return;
                }
                setLoading(true);
                const data = await getMeetings(group_code);
                if (!Array.isArray(data)) {
                    setError('Meetings not found');
                    setMeetings([]);
                    return;
                }
                setMeetings(data);
            } catch (error) {
                setError('Meetings not found: ' + error);
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        }
        loadMeetings();
    }, [group_code]);

    async function handleDelete(meeting_code: number) {
        try {
            setError(null);
            setSuccess(null);
            await deleteMeeting(group_code, String(meeting_code));
            setMeetings(meetings.filter((meeting) => meeting.meeting_code !== meeting_code));
            setSuccess('Meeting deleted');
        } catch (error) {
            setError('Meeting not deleted: ' + error);
        }
    }

    return (
        <div className="page page-wide">
            <h1>Meetings</h1>
            <select
                value={group_code}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                        setSearchParams({ group_code: value });
                    } else {
                        setSearchParams({});
                    }
                }}
            >
                {!group_code && <option value="">Select a group</option>}
                {groups.map((group) => (
                    <option key={group.group_code} value={String(group.group_code)}>{group.group_name}</option>
                ))}
            </select>
            {!group_code && <p>Select a group to see its meetings.</p>}
            {group_code && loading && <p>Loading meetings...</p>}
            {group_code && !loading && meetings.length === 0 && !error && <p>No meetings for this group.</p>}
            {group_code && !loading && meetings.length > 0 && (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>Room</th>
                        <th className="actions-heading" colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.map((meeting) => (
                        <tr key={meeting.meeting_code}>
                            <td>{meeting.meeting_name}</td>
                            <td>{formatMeetingDate(meeting.meeting_start)}</td>
                            <td>{formatMeetingDate(meeting.meeting_end)}</td>
                            <td>{formatMeetingDuration(meeting.meeting_start, meeting.meeting_end)}</td>
                            <td>{meeting.meeting_description}</td>
                            <td>{meeting.meeting_room}</td>
                            <td className="action-cell">
                                <button type="button" onClick={() => navigate(`/update-meeting/${group_code}/${meeting.meeting_code}`)}>Update</button>
                            </td>
                            <td className="action-cell">
                                <button type="button" onClick={() => handleDelete(meeting.meeting_code)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
        </div>
    )
}
