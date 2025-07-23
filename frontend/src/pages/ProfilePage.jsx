import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useProfile } from '../contexts/AuthContext.jsx'
import ExcerptDetails from '../components/ExcerptDetailsComponent.jsx'
import { BookmarkCheck, CheckCircle, Calendar, Trophy, Headphones } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import excerptsData from '../../../backend/data/excerpts.json'

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const { favorites, completed, profileLoading: loading, profileError: error } = useProfile()
    const [modalExcerpt, setModalExcerpt] = useState(null)

    if (authLoading) return null

    const displayUser = user || { username: 'Guest' }
    const displayFavorites = user ? favorites : []
    const displayCompleted = user ? completed : []
    const displayLoading = user ? loading : false

    const isFavoritesSlugs = displayFavorites.length > 0 && typeof displayFavorites[0] === 'string'
    const isCompletedSlugs = displayCompleted.length > 0 && typeof displayCompleted[0] === 'string'

    const completedDays = !isCompletedSlugs && displayCompleted.length ? displayCompleted.length : 0;
    const favoriteCount = !isFavoritesSlugs && displayFavorites.length ? displayFavorites.length : 0;
    const totalDays = 33;

    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    function getLongestStreak() {
      if (!user) return 0;
      if (isCompletedSlugs || !displayCompleted.length || !user?.startDate || user.startExcerptIndex === undefined) return 0;

      const completedSlugs = new Set(displayCompleted.map(e => e.slug));
      const totalDays = 33;
      const startDate = new Date(user.startDate);

      const today = new Date();
      const userCurrentDay = Math.min(
        Math.floor((today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) + 1,
        totalDays
      );
      if (!Array.isArray(excerptsData) || excerptsData.length === 0) return 0;

      const getExcerptSlugForDay = (day) => {
        const idx = (user.startExcerptIndex + (day - 1)) % excerptsData.length;
        return excerptsData[idx]?.slug;
      };

      let maxStreak = 0, currentStreak = 0;
      for (let day = 1; day <= userCurrentDay; day++) {
        const slug = getExcerptSlugForDay(day);
        if (completedSlugs.has(slug)) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      return maxStreak;
    }
    const longestStreak = getLongestStreak();

    return (
        <div className="min-h-screen bg-yellow-50 pt-16 flex flex-col items-center">
            <div className="w-full max-w-3xl mt-8 space-y-8 pb-8">

                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">
                        Hello, {displayUser.username}
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg font-normal">
                        {user ? 'Welcome to your profile and achievements!' : 'Create an account to track your progress and achievements!'}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-full mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {displayLoading ? 0 : completedDays}
                      </div>
                      <p className="text-sm text-gray-500">Days Completed</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-yellow-800/10 rounded-full mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-yellow-800" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {displayLoading ? 0 : longestStreak}
                      </div>
                      <p className="text-sm text-gray-500">Best Streak</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-600/10 rounded-full mx-auto mb-3">
                        <BookmarkCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {displayLoading ? 0 : favoriteCount}
                      </div>
                      <p className="text-sm text-gray-500">Favorites</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-full mx-auto mb-3">
                        <Headphones className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {displayLoading ? 0 : completionRate}%
                      </div>
                      <p className="text-sm text-gray-500">Percent Complete</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <BookmarkCheck className="w-5 h-5 text-yellow-600" />
                      Favorite Excerpts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!isFavoritesSlugs && displayFavorites.length > 0) ? (
                      <div className="space-y-3">
                        {displayFavorites.map((excerpt) => (
                          <div
                            key={excerpt.slug}
                            className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100"
                            onClick={() => setModalExcerpt(excerpt)}
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{excerpt.title}</h4>
                              <p className="text-sm text-gray-600">{excerpt.composer}</p>
                            </div>
                            <Badge className="bg-yellow-200 text-yellow-800">Level {excerpt.difficulty}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        {user ? 'No favorites yet. Mark excerpts as favorites while practicing!' : 'Create an account to save your favorite excerpts!'}
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Most Recently Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!isCompletedSlugs && displayCompleted.length > 0) ? (
                      <div className="space-y-3">
                        {displayCompleted.map((excerpt) => (
                          <div
                            key={excerpt.slug}
                            className="flex justify-between items-center p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100"
                            onClick={() => setModalExcerpt(excerpt)}
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{excerpt.title}</h4>
                              <p className="text-sm text-gray-600">{excerpt.composer}</p>
                            </div>
                            <Badge className="bg-green-200 text-green-800">Level {excerpt.difficulty}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        {user ? 'No completed excerpts yet. Mark excerpts as practiced to add them here!' : 'Create an account to track your completed excerpts!'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {!user && (
                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>Create an account to unlock all features and track your progress.</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <Link to="/login" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">Log In</Link>
                            <Link to="/register" className="px-4 py-2 bg-gray-200 text-yellow-800 rounded hover:bg-yellow-100 transition">Register</Link>
                        </div>
                    </div>
                )}

                {modalExcerpt && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModalExcerpt(null)}>
                    <div className="flex flex-col items-end w-full max-w-lg mx-auto">
                      <div className="bg-white rounded-lg p-6 w-full shadow-xl relative" onClick={e => e.stopPropagation()}>
                        <ExcerptDetails excerpt={modalExcerpt} showClose={true} onClose={() => setModalExcerpt(null)} />
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
    )
}
