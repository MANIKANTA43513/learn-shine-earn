import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Trophy, Download, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Confetti from 'react-confetti'
import type { Result as ResultType, Quiz as QuizType } from '@/lib/supabase'

export default function Result() {
  const { resultId } = useParams<{ resultId: string }>()
  const navigate = useNavigate()
  
  const [result, setResult] = useState<ResultType | null>(null)
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (resultId) {
      loadResultData()
    }
  }, [resultId])

  const loadResultData = async () => {
    try {
      // Load result
      const { data: resultData } = await supabase
        .from('results')
        .select('*')
        .eq('id', resultId)
        .single()

      if (resultData) {
        setResult(resultData)
        
        // Load quiz details
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', resultData.quiz_id)
          .single()

        setQuiz(quizData)
        
        // Show confetti if passed
        if (resultData.passed) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        }
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error loading result:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const generateCertificate = () => {
    if (result?.passed) {
      navigate(`/certificate/${result.id}`)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </Layout>
    )
  }

  if (!result || !quiz) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Result not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {showConfetti && <Confetti />}
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {result.passed ? (
                <CheckCircle className="h-16 w-16 text-success" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle className="text-3xl">
              {result.passed ? 'Congratulations!' : 'Try Again!'}
            </CardTitle>
            <div className="flex justify-center mt-4">
              <Badge 
                variant={result.passed ? "default" : "destructive"}
                className="text-lg px-4 py-1"
              >
                {result.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Score Details */}
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {result.score}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Your Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground">
                  {quiz.passing_score}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Passing Score
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Correct Answers
                </span>
                <span className="font-medium">
                  {Math.round((result.score / 100) * result.total_questions)} / {result.total_questions}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Completed on {new Date(result.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            className="flex items-center justify-center space-x-2 flex-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Quiz</span>
          </Button>

          {result.passed && (
            <Button
              onClick={generateCertificate}
              className="flex items-center justify-center space-x-2 flex-1"
            >
              <Trophy className="h-4 w-4" />
              <span>Get Certificate</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center space-x-2 flex-1"
          >
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {!result.passed && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't worry! You can retake the quiz to improve your score and earn your certificate.
                </p>
                <p className="text-xs text-muted-foreground">
                  Review the material and try again when you're ready.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}