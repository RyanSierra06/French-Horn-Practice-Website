import React, { useState, useEffect } from 'react'
import { format, differenceInCalendarDays, startOfDay } from 'date-fns'
import ExcerptDetails from '../components/ExcerptDetailsComponent.jsx'
import { useAuth, useProfile } from '../contexts/AuthContext.jsx'

export default function TodayPage() {
    const { user, loading: authLoading, refreshUser } = useAuth()
    const { refreshProfile } = useProfile()
    const [excerpt, setExcerpt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentUserData, setCurrentUserData] = useState(null)

    const getESTDate = () => {
        const now = new Date()
        const estOffset = -5 * 60 // EST is UTC-5
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
        return new Date(utc + (estOffset * 60000))
    }
    
    const today = getESTDate()

    useEffect(() => {
        const fetchTodaysExcerpt = async () => {
            try {
                setLoading(true)
                setError(null)

                let currentUser = user;
                if (user) {
                    try {
                        const response = await fetch('http://localhost:4000/api/auth/me', {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (response.ok) {
                            currentUser = await response.json();
                            setCurrentUserData(currentUser);
                        }
                    } catch (err) {
                        console.error('Failed to refresh user data:', err);
                        currentUser = user;
                        setCurrentUserData(user);
                    }
                } else {
                    setCurrentUserData(null);
                }

                const userParam = currentUser ? JSON.stringify({
                    startDate: currentUser.startDate,
                    currentDay: currentUser.currentDay
                }) : null
                
                const url = userParam 
                    ? `http://localhost:4000/api/excerpts/today?user=${encodeURIComponent(userParam)}`
                    : 'http://localhost:4000/api/excerpts/today'
                
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error('Failed to fetch today\'s excerpt')
                }
                
                const excerptData = await response.json()
                setExcerpt(excerptData)
            } catch (err) {
                console.error('Error fetching today\'s excerpt:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading) {
            fetchTodaysExcerpt()
        }
    }, [authLoading])

    useEffect(() => {
        if (!user) {
            setCurrentUserData(null);
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-yellow-50">
                <main className="max-w-3xl mx-auto p-6 space-y-6 pt-24">
                    <div className="text-center">
                        <p className="text-gray-600">Loading today's excerpt...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-yellow-50">
                <main className="max-w-3xl mx-auto p-6 space-y-6 pt-24">
                    <div className="text-center">
                        <p className="text-red-600">Error loading today's excerpt: {error}</p>
                    </div>
                </main>
            </div>
        )
    }

    let dayLabel = ''
    const userForDisplay = currentUserData || user;
    if (userForDisplay && userForDisplay.startDate) {

        const userStartDate = new Date(userForDisplay.startDate)
        const userCurrentDay = differenceInCalendarDays(startOfDay(today), startOfDay(userStartDate)) + 1
        dayLabel = `Day ${userCurrentDay} · `
    }

    return (
        <div className="min-h-screen bg-yellow-50">
            <main className="max-w-3xl mx-auto p-6 space-y-6 pt-24">
                <header className="text-center">
                    <h1 className="text-3xl font-serif font-bold text-gray-800">
                        {dayLabel}{format(today, 'EEEE, MMMM do')}
                    </h1>
                </header>

                {excerpt && (
                    <ExcerptDetails
                        key={`${excerpt.slug}-${user?.startDate || 'guest'}`}
                        excerpt={excerpt} 
                        onProgressUpdate={refreshProfile}
                    />
                )}
            </main>
        </div>
    )
} 