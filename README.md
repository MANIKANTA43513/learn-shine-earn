# CertifyMe - Micro-Certification Platform

A comprehensive micro-certification platform where students can take quizzes, get instant results, and download professional certificates.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Interactive Quizzes**: Question-by-question navigation with progress tracking
- **Instant Results**: Immediate scoring and pass/fail status
- **Certificate Generation**: Professional PDF certificates with user details
- **Dashboard**: View quiz history, scores, and manage certificates
- **Responsive Design**: Beautiful, modern interface that works on all devices

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF, html2canvas
- **Animations**: Framer Motion, React Confetti
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account and project

## 🏗️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd certifyme-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Update `src/lib/supabase.ts` with your Supabase credentials:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 4. Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

-- Create results table
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own results" ON results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own results" ON results FOR SELECT USING (auth.uid() = user_id);
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` to see your application.

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Load Sample Data**: Click "Load Sample Quizzes" to populate the database
3. **Take Quizzes**: Select a quiz and answer questions one by one
4. **View Results**: Get instant feedback with score and pass/fail status
5. **Download Certificate**: Generate and download PDF certificates for passed quizzes

## 📊 Database Schema

### Users (Supabase Auth)
- `id`: UUID (Primary Key)
- `email`: String
- `user_metadata.name`: String

### Quizzes
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String
- `passing_score`: Integer
- `created_at`: Timestamp

### Questions
- `id`: UUID (Primary Key)
- `quiz_id`: UUID (Foreign Key)
- `question_text`: String
- `options`: String Array
- `correct_answer`: Integer
- `order_index`: Integer

### Results
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `quiz_id`: UUID (Foreign Key)
- `score`: Integer
- `total_questions`: Integer
- `passed`: Boolean
- `answers`: Integer Array
- `created_at`: Timestamp

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables (if needed)
3. Deploy with one click

### Environment Variables

No additional environment variables are required as Supabase credentials are configured in the source code. For production, consider using environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Design Features

- Modern, professional design with educational theme
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Progress indicators and interactive elements
- Professional certificate templates
- Accessible UI components

## 🔧 Development

### Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Application pages
├── contexts/          # React contexts (Auth)
├── lib/               # Utilities and configurations
├── data/              # Sample data and helpers
└── hooks/             # Custom React hooks
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ using React, Supabase, and modern web technologies.