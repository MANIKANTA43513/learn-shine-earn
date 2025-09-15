import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import type { Quiz as QuizType, Question } from '@/lib/supabase'

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (quizId) {
      loadQuizData()
    }
  }, [quizId])

  const loadQuizData = async () => {
    try {
      // Load quiz details
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single()

      // Load questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index')

      if (quizData && questionsData) {
        setQuiz(quizData)
        setQuestions(questionsData)
        setAnswers(new Array(questionsData.length).fill(-1))
      } else {
        toast.error('Quiz not found')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
      toast.error('Failed to load quiz')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitQuiz = async () => {
    if (answers.includes(-1)) {
      toast.error('Please answer all questions before submitting')
      return
    }

    setSubmitting(true)
    try {
      // Calculate score
      let correctAnswers = 0
      questions.forEach((question, index) => {
        if (answers[index] === question.correct_answer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / questions.length) * 100)
      const passed = score >= (quiz?.passing_score || 70)

      // Save result to database
      const { data: result, error } = await supabase
        .from('results')
        .insert({
          user_id: user?.id,
          quiz_id: quizId,
          score,
          total_questions: questions.length,
          passed,
          answers
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Quiz submitted successfully!')
      navigate(`/result/${result.id}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </Layout>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Quiz not found</p>
        </div>
      </Layout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>Passing Score: {quiz.passing_score}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestionIndex] === index ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Answered: {answers.filter(a => a !== -1).length}/{questions.length}</span>
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={submitQuiz}
              disabled={submitting}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  )
}