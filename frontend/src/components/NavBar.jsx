import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, User, Headphones, LogIn, LogOut, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function NavBar({ user }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()
    const currentPath = location.pathname
    const isActive = (path) => currentPath === path
    const handleProfileClick = () => {
        navigate('/profile')
    }
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center">
                        <img
                            src="/122355-200.png"
                            alt="French Horn Icon"
                            className="w-6 h-6 object-contain"
                            draggable={false}
                        />
                    </div>
                    <span className="font-semibold text-black select-none">33 Days Of French Horn</span>
                </Link>

                <div className="flex space-x-2">
                    <Link to="/" className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/') ? 'bg-yellow-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'}`}>
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    <Link to="/today" className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/today') ? 'bg-yellow-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'}`}>
                        <Headphones className="w-4 h-4" />
                        <span>Today</span>
                    </Link>
                    <Link to="/calendar" className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/calendar') ? 'bg-yellow-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>Calendar</span>
                    </Link>
                    <button
                        onClick={handleProfileClick}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/profile') ? 'bg-yellow-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'}`}
                    >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </button>
                    {!user && (
                        <Link to="/login" className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/login') ? 'bg-yellow-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-yellow-100 hover:text-yellow-700'}`}>
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition bg-gray-200 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-700"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}
