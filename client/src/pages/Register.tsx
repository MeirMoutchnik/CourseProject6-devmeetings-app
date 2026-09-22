import { useState } from 'react';
import { registerUser } from '../services/UserService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({
        user_id: 0,
        user_name: '',
        user_email: '',
        user_password: '',
        user_role: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newUser = await registerUser(user);
            if (newUser.user_id) {
                navigate('/login');
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    return (
        <div className="page">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={user.user_name} onChange={(e) => setUser({ ...user, user_name: e.target.value })} />
                <input type="email" placeholder="Email" value={user.user_email} onChange={(e) => setUser({ ...user, user_email: e.target.value })} />
                <input type="password" placeholder="Password" value={user.user_password} onChange={(e) => setUser({ ...user, user_password: e.target.value })} />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}