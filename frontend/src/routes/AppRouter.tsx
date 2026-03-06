import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/private/Dashboard";
import Profile from "../pages/private/Profile";
import Settings from "../pages/private/Settings";
import { LayoutSelector } from "../components/layout/LayoutSelector";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <LayoutSelector>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </LayoutSelector>
        </BrowserRouter>
    );
};

export default AppRouter;