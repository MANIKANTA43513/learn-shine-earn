// Sample quiz data for development/demo purposes
export const sampleQuizzes = [
  {
    id: 'quiz-1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
    passing_score: 70,
    created_at: new Date().toISOString()
  },
  {
    id: 'quiz-2', 
    title: 'React Development',
    description: 'Assess your React skills covering components, hooks, and state management.',
    passing_score: 75,
    created_at: new Date().toISOString()
  },
  {
    id: 'quiz-3',
    title: 'Web Development Basics',
    description: 'Fundamental concepts of HTML, CSS, and web development principles.',
    passing_score: 65,
    created_at: new Date().toISOString()
  }
]

export const sampleQuestions = [
  // JavaScript Fundamentals Quiz
  {
    id: 'q1-1',
    quiz_id: 'quiz-1',
    question_text: 'Which of the following is used to declare a variable in JavaScript?',
    options: ['var', 'let', 'const', 'All of the above'],
    correct_answer: 3,
    order_index: 1
  },
  {
    id: 'q1-2',
    quiz_id: 'quiz-1',
    question_text: 'What is the result of typeof null in JavaScript?',
    options: ['null', 'undefined', 'object', 'boolean'],
    correct_answer: 2,
    order_index: 2
  },
  {
    id: 'q1-3',
    quiz_id: 'quiz-1',
    question_text: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correct_answer: 0,
    order_index: 3
  },
  {
    id: 'q1-4',
    quiz_id: 'quiz-1',
    question_text: 'What does the "===" operator do in JavaScript?',
    options: ['Assignment', 'Loose equality', 'Strict equality', 'Not equal'],
    correct_answer: 2,
    order_index: 4
  },
  {
    id: 'q1-5',
    quiz_id: 'quiz-1',
    question_text: 'Which of the following is NOT a JavaScript data type?',
    options: ['String', 'Number', 'Boolean', 'Float'],
    correct_answer: 3,
    order_index: 5
  },

  // React Development Quiz
  {
    id: 'q2-1',
    quiz_id: 'quiz-2',
    question_text: 'What is JSX?',
    options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'],
    correct_answer: 1,
    order_index: 1
  },
  {
    id: 'q2-2',
    quiz_id: 'quiz-2',
    question_text: 'Which hook is used to manage state in functional components?',
    options: ['useEffect', 'useState', 'useContext', 'useCallback'],
    correct_answer: 1,
    order_index: 2
  },
  {
    id: 'q2-3',
    quiz_id: 'quiz-2',
    question_text: 'What is the purpose of the key prop in React lists?',
    options: ['Styling', 'Performance optimization', 'Event handling', 'Data binding'],
    correct_answer: 1,
    order_index: 3
  },
  {
    id: 'q2-4',
    quiz_id: 'quiz-2',
    question_text: 'When does useEffect run by default?',
    options: ['Before render', 'After every render', 'Only on mount', 'On state change'],
    correct_answer: 1,
    order_index: 4
  },
  {
    id: 'q2-5',
    quiz_id: 'quiz-2',
    question_text: 'What is React context used for?',
    options: ['Styling components', 'Managing global state', 'Routing', 'API calls'],
    correct_answer: 1,
    order_index: 5
  },

  // Web Development Basics Quiz
  {
    id: 'q3-1',
    quiz_id: 'quiz-3',
    question_text: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
    correct_answer: 0,
    order_index: 1
  },
  {
    id: 'q3-2',
    quiz_id: 'quiz-3',
    question_text: 'Which CSS property is used to change the text color?',
    options: ['text-color', 'color', 'font-color', 'text-style'],
    correct_answer: 1,
    order_index: 2
  },
  {
    id: 'q3-3',
    quiz_id: 'quiz-3',
    question_text: 'What is the correct HTML element for the largest heading?',
    options: ['<h6>', '<heading>', '<h1>', '<header>'],
    correct_answer: 2,
    order_index: 3
  },
  {
    id: 'q3-4',
    quiz_id: 'quiz-3',
    question_text: 'Which HTTP method is used to retrieve data?',
    options: ['POST', 'PUT', 'GET', 'DELETE'],
    correct_answer: 2,
    order_index: 4
  },
  {
    id: 'q3-5',
    quiz_id: 'quiz-3',
    question_text: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correct_answer: 1,
    order_index: 5
  }
]

// Helper function to create sample data in Supabase (for development)
export const createSampleData = async (supabase: any) => {
  try {
    // Insert quizzes
    const { error: quizzesError } = await supabase
      .from('quizzes')
      .upsert(sampleQuizzes, { onConflict: 'id' })

    if (quizzesError) {
      console.error('Error inserting quizzes:', quizzesError)
      return false
    }

    // Insert questions  
    const { error: questionsError } = await supabase
      .from('questions')
      .upsert(sampleQuestions, { onConflict: 'id' })

    if (questionsError) {
      console.error('Error inserting questions:', questionsError)
      return false
    }

    console.log('Sample data created successfully!')
    return true
  } catch (error) {
    console.error('Error creating sample data:', error)
    return false
  }
}