import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Meetings } from './pages/Meetings';
import { AddMeeting } from './pages/AddMeeting';
import { UpdateMeeting } from './pages/UpdateMeeting';
import { NavBar } from './components/NavBar';
import { Register } from './pages/Register';
import { Login } from './pages/Login';

export default function App() {
    return (
        <div className="app-root">
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/add-meeting" element={<AddMeeting />} />
                <Route path="/update-meeting/:group_code/:meeting_code" element={<UpdateMeeting />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    )
}
