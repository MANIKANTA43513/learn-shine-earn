import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { SampleDataLoader } from '@/components/SampleDataLoader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Trophy, Clock, PlayCircle } from 'lucide-react'
import type { Quiz, Result } from '@/lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load available quizzes
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })

      // Load user results
      const { data: resultsData } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      setQuizzes(quizzesData || [])
      setResults(resultsData || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserQuizResult = (quizId: string) => {
    return results.find(result => result.quiz_id === quizId)
  }

  const getStats = () => {
    const completed = results.length
    const passed = results.filter(r => r.passed).length
    const totalScore = results.reduce((sum, r) => sum + r.score, 0)
    const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0

    return { completed, passed, avgScore }
  }

  const stats = getStats()

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quizzes Completed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Certificates Earned
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Quizzes */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <SampleDataLoader onDataLoaded={loadDashboardData} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const userResult = getUserQuizResult(quiz.id)
                
                return (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {quiz.description}
                          </CardDescription>
                        </div>
                        {userResult && (
                          <Badge variant={userResult.passed ? "default" : "destructive"}>
                            {userResult.passed ? "Passed" : "Failed"}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Passing Score: {quiz.passing_score}%
                        </div>
                        
                        {userResult && (
                          <div className="text-sm">
                            <span className="font-medium">Your Score: </span>
                            <span className={userResult.passed ? "text-success" : "text-destructive"}>
                              {userResult.score}%
                            </span>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                            className="flex-1 flex items-center justify-center space-x-2"
                          >
                            <PlayCircle className="h-4 w-4" />
                            <span>{userResult ? 'Retake' : 'Start'} Quiz</span>
                          </Button>
                          
                          {userResult?.passed && (
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/certificate/${userResult.id}`)}
                            >
                              <Trophy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}