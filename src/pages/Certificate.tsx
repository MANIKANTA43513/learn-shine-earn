import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Result as ResultType, Quiz as QuizType } from '@/lib/supabase'

export default function Certificate() {
  const { resultId } = useParams<{ resultId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const certificateRef = useRef<HTMLDivElement>(null)
  
  const [result, setResult] = useState<ResultType | null>(null)
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (resultId) {
      loadCertificateData()
    }
  }, [resultId])

  const loadCertificateData = async () => {
    try {
      // Load result
      const { data: resultData } = await supabase
        .from('results')
        .select('*')
        .eq('id', resultId)
        .single()

      if (resultData && resultData.passed) {
        setResult(resultData)
        
        // Load quiz details
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', resultData.quiz_id)
          .single()

        setQuiz(quizData)
      } else {
        toast.error('Certificate not available')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error loading certificate data:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificateRef.current || !result || !quiz || !user) return

    setGenerating(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 297 // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${quiz.title.replace(/\s+/g, '_')}_Certificate.pdf`)
      
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Failed to generate certificate')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading certificate...</p>
        </div>
      </Layout>
    )
  }

  if (!result || !quiz || !user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Certificate not found</p>
        </div>
      </Layout>
    )
  }

  const userName = user.user_metadata?.name || user.email
  const completionDate = new Date(result.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Certificate Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div 
              ref={certificateRef}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-16 text-center relative"
              style={{ aspectRatio: '1.414/1' }}
            >
              {/* Decorative border */}
              <div className="absolute inset-4 border-4 border-primary/20 rounded-lg"></div>
              <div className="absolute inset-6 border-2 border-primary/40 rounded-lg"></div>
              
              {/* Certificate content */}
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-primary">
                    Certificate of Completion
                  </h1>
                  <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-gray-600">
                    This is to certify that
                  </p>
                  
                  <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-primary/30 pb-2 px-8 inline-block">
                    {userName}
                  </h2>
                  
                  <p className="text-lg text-gray-600">
                    has successfully completed the
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-primary">
                    {quiz.title}
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-8 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {result.score}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Final Score
                      </div>
                    </div>
                    
                    <div className="h-12 w-px bg-gray-300"></div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {completionDate}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date of Completion
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature section */}
                <div className="flex justify-center pt-8">
                  <div className="text-center">
                    <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                    <p className="text-sm text-gray-600">CertifyMe Platform</p>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="text-xs text-gray-500 absolute bottom-4 right-4">
                  Certificate ID: {result.id.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={downloadCertificate}
            disabled={generating}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{generating ? 'Generating...' : 'Download PDF'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              navigator.share?.({
                title: `${quiz.title} Certificate`,
                text: `I just completed ${quiz.title} with a score of ${result.score}%!`,
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Certificate link copied to clipboard!')
              })
            }}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  )
}