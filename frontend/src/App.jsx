import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import TodayPage from './pages/TodayPage.jsx'
import UnauthenticatedCalendarPage from './pages/CalendarPage.jsx'
import NavBar from './components/NavBar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { AuthProvider, ProfileProvider, useAuth } from './contexts/AuthContext.jsx'

import { format, addDays } from 'date-fns'
const dailyExcerpts = Array.from({ length: 33 }, (_, i) => {
    const date = format(addDays(1, i), 'yyyy-MM-dd')
    return {
        date,
        isCompleted: false,
        excerpt: {
            excerptNumber: `${i+1}`,
            slug: `day${i+1}`,
            title: `Excerpt ${i+1}`,
            composer: `Composer ${i+1}`,
            work: `Work ${i+1}`,
            key: `Horn in F`,
            measureStart: 1,
            measureEnd: 10,
            difficulty: 1,
            tags: ['Practice'],
            sheetMusicURL: `/excerpts sheet music/day${i+1}.png`,
            audioURL: `/excerpts audio/day${i+1}.mp3`
        }
    }
})

function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
            <h1 className="text-4xl font-bold text-yellow-700 mb-4">404</h1>
            <p className="text-lg text-gray-700 mb-2">This page does not exist.</p>
            <a href="/" className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">Go Home</a>
        </div>
    );
}

function AppRoutes() {
    const { user } = useAuth();
    return (
        <>
            <NavBar user={user} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/today" element={<TodayPage />} />
                <Route
                    path="/calendar"
                    element={<UnauthenticatedCalendarPage dailyExcerpts={dailyExcerpts} />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage user={user} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <ProfileProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ProfileProvider>
        </AuthProvider>
    )
}
