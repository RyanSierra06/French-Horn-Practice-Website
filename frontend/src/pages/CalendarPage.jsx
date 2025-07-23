import React, { useState, useEffect } from 'react'
import { format, addDays, isAfter, startOfDay, differenceInCalendarDays } from 'date-fns'
import { CalendarDays, Check, Music, Circle } from 'lucide-react'
import ExcerptDetails from '../components/ExcerptDetailsComponent.jsx'
import { useAuth, useProfile } from '../contexts/AuthContext.jsx'
import excerptsData from '../../../backend/data/excerpts.json'

export default function CalendarPage({ dailyExcerpts, user, userProgress }) {
    const [selectedExcerpt, setSelectedExcerpt] = useState(null)
    const [progressData, setProgressData] = useState({})
    const [loading, setLoading] = useState(true)
    const [setCurrentDayExcerpt] = useState(null)
    const { user: authUser, token, loading: authLoading } = useAuth()
    const {progressRefreshCount } = useProfile()

    const getESTDate = () => {
        const now = new Date()
        const estOffset = -5 * 60
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
        return new Date(utc + (estOffset * 60000))
    }

    const totalDays = 33
    const totalExcerpts = excerptsData.length

    const today = getESTDate()
    const userStartDate = authUser?.startDate ? new Date(authUser.startDate) : null
    const userCurrentDay = userStartDate ? differenceInCalendarDays(startOfDay(today), startOfDay(userStartDate)) + 1 : 1

    useEffect(() => {
        if (authLoading) return;
        
        const fetchCurrentDayExcerpt = async () => {
            try {
                let url = 'http://localhost:4000/api/excerpts/today'
                
                if (authUser) {
                    console.log('Calendar - User data being sent:', authUser)
                    const userParam = encodeURIComponent(JSON.stringify(authUser))
                    url += `?user=${userParam}`
                    console.log('Calendar - Full URL:', url)
                } else {
                    console.log('Calendar - No user, using unauthenticated endpoint')
                }
                
                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    console.log('Calendar - Received excerpt:', data)
                    setCurrentDayExcerpt(data)
                }
            } catch (err) {
                console.error('Failed to fetch current day excerpt:', err)
            }
        }

        fetchCurrentDayExcerpt()
    }, [authUser, authLoading])

    useEffect(() => {
        if (authUser && token && !authLoading) {
            fetchProgressData()
        } else if (!authLoading) {
            setLoading(false)
        }
    }, [authUser, token, authLoading, progressRefreshCount])

    const fetchProgressData = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/progress', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                const progressMap = {}
                data.forEach(progress => {
                    progressMap[progress.excerptSlug] = progress.completed
                })
                setProgressData(progressMap)
            }
        } catch (err) {
            console.error('Failed to fetch progress:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleProgressUpdate = () => {
        fetchProgressData()
    }

    const getUserExcerptIndex = (day) => {
        if (authUser && authUser.startExcerptIndex !== undefined) {
            return (authUser.startExcerptIndex + (day - 1)) % totalExcerpts
        } else {
            const globalStartDate = new Date('2024-06-01T00:00:00Z')
            const now = getESTDate()
            const daysSinceGlobalStart = Math.floor((now - globalStartDate) / (1000 * 60 * 60 * 24))
            return (daysSinceGlobalStart + (day - 1)) % totalExcerpts
        }
    }

    const getExcerptForDay = (day) => {
        const idx = getUserExcerptIndex(day)
        return excerptsData[idx]
    }

    const getExcerptSlugForDay = (day) => {
        const excerpt = getExcerptForDay(day)
        return excerpt ? excerpt.slug : null
    }

    const getDayStatus = (day) => {
        if (!authUser) return 'locked'
        if (!userStartDate) return 'locked'
        if (day < userCurrentDay) {
            const excerptSlug = getExcerptSlugForDay(day)
            if (!excerptSlug) return 'locked'
            return progressData[excerptSlug] ? 'completed' : 'missed'
        } else if (day === userCurrentDay) {
            const excerptSlug = getExcerptSlugForDay(day)
            if (!excerptSlug) return 'unlocked'
            return progressData[excerptSlug] ? 'completed' : 'unlocked'
        } else {
            return 'locked'
        }
    }

    const getDayStyles = (day) => {
        const status = getDayStatus(day)
        const baseStyles = 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center rounded-xl border-2 shadow transition-all'
        switch (status) {
            case 'completed':
                return `${baseStyles} bg-green-50 border-green-200 text-green-700 cursor-pointer hover:bg-green-100 hover:scale-105`
            case 'missed':
                return `${baseStyles} bg-red-100 border-red-300 text-red-800 cursor-pointer hover:bg-red-200 hover:scale-105`
            case 'unlocked':
                return `${baseStyles} bg-yellow-100 border border-yellow-200 text-black cursor-pointer hover:bg-yellow-100 hover:scale-105`
            default:
                return `${baseStyles} bg-blue-50 border-blue-200 text-blue-600 cursor-not-allowed opacity-60`
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-yellow-50 pt-24">
                <div className="p-6 pt-24">
                    <div className="text-center">
                        <p className="text-gray-600">Loading calendar...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-yellow-50">
            <div className="p-6 pt-20">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">
                        33-Day of French Horn Calendar
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg font-normal">
                        Track your daily progress and unlock new pieces!
                    </p>
                </header>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4 max-w-5xl mx-auto">
                    {Array.from({ length: totalDays }, (_, i) => {
                        const day = i + 1
                        const excerpt = getExcerptForDay(day)
                        const status = getDayStatus(day)
                        const showComposer = status === 'completed' || status === 'missed' || status === 'unlocked'
                        let Icon = null
                        if (status === 'completed') Icon = Check
                        else if (status === 'unlocked') Icon = Music
                        else if (status === 'missed') Icon = Music
                        else Icon = Circle
                        let iconColor = ''
                        if (status === 'completed') iconColor = 'text-green-600'
                        else if (status === 'unlocked' || status === 'missed') iconColor = 'text-yellow-500'
                        else iconColor = 'text-gray-400'
                        return (
                            <div
                                key={day}
                                className={getDayStyles(day).replace(/w-\d+/g, 'w-20').replace(/h-\d+/g, 'h-20').replace(/sm:w-\d+/g, 'sm:w-24').replace(/sm:h-\d+/g, 'sm:h-24').replace(/md:w-\d+/g, 'md:w-28').replace(/md:h-\d+/g, 'md:h-28')}
                                onClick={() => {
                                    if (status !== 'locked' && excerpt) {
                                        setSelectedExcerpt({ excerpt, day })
                                    }
                                }}
                            >
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <span className="text-lg md:text-xl font-bold leading-none">{day}</span>
                                    <Icon className={`w-4 h-4 my-1 ${iconColor}`} />
                                    {showComposer && excerpt && (
                                        <span className="text-xs md:text-sm text-black text-center mt-1 line-clamp-2">
                                            {excerpt.composer}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-green-50 border border-green-200 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></span>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-yellow-100 border border-yellow-200 flex items-center justify-center"><Music className="w-4 h-4 text-yellow-500" /></span>
                    <span>Unlocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-50 border border-blue-200 flex items-center justify-center"><Circle className="w-4 h-4 text-gray-400" /></span>
                    <span>Upcoming</span>
                  </div>
                </div>

                {!authUser && (
                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>Log in to unlock all days and track your progress.</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <a href="/login" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">Log In</a>
                            <a href="/register" className="px-4 py-2 bg-gray-200 text-yellow-800 rounded hover:bg-yellow-100 transition">Register</a>
                        </div>
                    </div>
                )}

                {selectedExcerpt && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setSelectedExcerpt(null)}
                    >
                        <div className="flex flex-col items-end w-full max-w-lg mx-auto">
                            <div
                                className="bg-white rounded-lg p-6 w-full shadow-xl relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <ExcerptDetails 
                                    excerpt={selectedExcerpt.excerpt} 
                                    onProgressUpdate={handleProgressUpdate}
                                    showClose={true}
                                    onClose={() => setSelectedExcerpt(null)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
