import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { logoutUser } from '../services/UserService';

export const NavBar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const group_code = searchParams.get('group_code');
    const meetingsPath = group_code ? `/meetings?group_code=${group_code}` : '/meetings';
    const addMeetingPath = group_code ? `/add-meeting?group_code=${group_code}` : '/add-meeting';
    const handleLogout = async () => {
        await logoutUser();
        window.dispatchEvent(new Event('auth-changed'));
        navigate('/login');
    }
    return (
        <nav className="site-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to={meetingsPath}>Meetings</Link>
            <Link to={addMeetingPath}>Add Meeting</Link>
            {localStorage.getItem('token') && <button onClick={handleLogout}>Logout</button>}
            {!localStorage.getItem('token') && <Link to="/login">Login</Link>}
            {!localStorage.getItem('token') && <Link to="/register">Register</Link>}
        </nav>
    )
}