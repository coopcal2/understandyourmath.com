import { useState } from 'react';
import { BookOpen, Sparkles, Lock } from 'lucide-react';

interface HomePageProps {
  onShowAuth: () => void;
}

export default function HomePage({ onShowAuth }: HomePageProps) {
  const [problem, setProblem] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleExplain = () => {
    if (problem.trim()) {
      setShowPreview(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Understand Your Math</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Sick of just getting full answers on ChatGPT?
              </h2>

              <div className="text-2xl sm:text-3xl font-semibold mb-6">
                <span className="text-red-600 line-through mr-3">Plagiarize</span>
                <span className="text-blue-600">Understand.</span>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                AI that actually explains your math problems step-by-step — not just gives you the answer.
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Try it out - Enter a math problem:
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Type your math problem here... For example: 'Solve for x: 2x + 5 = 13'"
                className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-slate-800 placeholder-slate-400"
              />

              <button
                onClick={handleExplain}
                disabled={!problem.trim()}
                className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Explain It
              </button>
            </div>

            {showPreview && (
              <div className="relative mb-8 border-2 border-blue-200 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center">
                  <Lock className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Sign in to see the explanation
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create a free account to get step-by-step explanations for all your math problems
                  </p>
                  <button
                    onClick={onShowAuth}
                    className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up Free
                  </button>
                </div>

                <div className="p-6 select-none blur-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Step-by-Step Explanation
                  </h3>

                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="border-2 border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {step}
                          </div>
                          <span className="font-semibold text-slate-800">
                            Step {step} Title
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          This is where the detailed explanation for this step would appear, walking you through the solution process...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-center text-sm text-slate-600 font-medium mb-4">
                Sign in to save your problems and see explanations
              </div>

              <button
                onClick={onShowAuth}
                className="w-full bg-white border-2 border-slate-300 text-slate-700 font-semibold py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <button
                onClick={onShowAuth}
                className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign up with Email
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-8">
              Start understanding your math problems today
            </p>
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-600">
          <p>&copy; 2025 Understand Your Math</p>
        </footer>
      </div>
    </div>
  );
}
