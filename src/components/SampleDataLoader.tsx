import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { createSampleData } from '@/data/sampleData'
import { toast } from 'sonner'
import { Database, Loader2 } from 'lucide-react'

interface SampleDataLoaderProps {
  onDataLoaded: () => void
}

export function SampleDataLoader({ onDataLoaded }: SampleDataLoaderProps) {
  const [loading, setLoading] = useState(false)

  const handleLoadSampleData = async () => {
    setLoading(true)
    try {
      const success = await createSampleData(supabase)
      if (success) {
        toast.success('Sample quizzes loaded successfully!')
        onDataLoaded()
      } else {
        toast.error('Failed to load sample data. Please check your database connection.')
      }
    } catch (error) {
      console.error('Error loading sample data:', error)
      toast.error('Failed to load sample data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle>No Quizzes Available</CardTitle>
        <CardDescription>
          It looks like there are no quizzes in the database yet. Load some sample quizzes to get started!
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={handleLoadSampleData} 
          disabled={loading}
          className="flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading Sample Data...</span>
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              <span>Load Sample Quizzes</span>
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          This will create 3 sample quizzes: JavaScript Fundamentals, React Development, and Web Development Basics.
        </p>
      </CardContent>
    </Card>
  )
}