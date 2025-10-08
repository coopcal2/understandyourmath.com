import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Sparkles, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { MathProblem, Step } from '../lib/supabase';

export default function MathExplainer() {
  const { user, signOut } = useAuth();
  const [problem, setProblem] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [savedProblems, setSavedProblems] = useState<MathProblem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedProblems();
    }
  }, [user]);

  const loadSavedProblems = async () => {
    if (!user) return;

    setLoadingProblems(true);
    const { data, error } = await supabase
      .from('math_problems')
      .select('*')
      .eq('user_id', user.id)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedProblems(data);
    }
    setLoadingProblems(false);
  };

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const handleExplain = async () => {
    if (!problem.trim() || !user) return;

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const exampleSteps: Step[] = [
      {
        title: 'Understand the Problem',
        content: 'First, let\'s identify what we\'re being asked to solve. Read through the problem carefully and note any given information and what we need to find.'
      },
      {
        title: 'Identify the Formula or Method',
        content: 'Based on the type of problem, we need to select the appropriate mathematical formula or method. This step is crucial as it sets the foundation for our solution.'
      },
      {
        title: 'Substitute Known Values',
        content: 'Now that we have our formula, let\'s plug in the values we know from the problem statement. Make sure to substitute carefully and keep track of units if applicable.'
      },
      {
        title: 'Simplify and Solve',
        content: 'Work through the mathematical operations step by step. Simplify expressions, combine like terms, and isolate the variable we\'re solving for.'
      },
      {
        title: 'Check Your Answer',
        content: 'Finally, verify that your answer makes sense. Plug it back into the original equation if possible, and check that units are correct and the magnitude is reasonable.'
      }
    ];

    setSteps(exampleSteps);
    setExpandedSteps(new Set([0]));

    const { error } = await supabase
      .from('math_problems')
      .insert({
        user_id: user.id,
        problem_text: problem,
        explanation_steps: exampleSteps
      });

    if (!error) {
      loadSavedProblems();
    }

    setIsLoading(false);
  };

  const handleDeleteProblem = async (id: string) => {
    const { error } = await supabase
      .from('math_problems')
      .delete()
      .eq('id', id);

    if (!error) {
      setSavedProblems(savedProblems.filter(p => p.id !== id));
    }
  };

  const handleLoadProblem = (savedProblem: MathProblem) => {
    setProblem(savedProblem.problem_text);
    setSteps(savedProblem.explanation_steps);
    setExpandedSteps(new Set([0]));
  };

  const formatExpiresIn = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) return 'Expired';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen className="w-6 h-6" />
              <span className="font-bold text-xl">Understand Your Math</span>
            </div>

            <button
              onClick={handleSignOut}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Your Problems
              </h3>

              {loadingProblems ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : savedProblems.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No saved problems yet. Create one to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {savedProblems.map((savedProblem) => (
                    <div
                      key={savedProblem.id}
                      className="border-2 border-slate-200 rounded-xl p-3 hover:border-blue-300 transition-colors"
                    >
                      <button
                        onClick={() => handleLoadProblem(savedProblem)}
                        className="w-full text-left mb-2"
                      >
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">
                          {savedProblem.problem_text}
                        </p>
                      </button>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatExpiresIn(savedProblem.expires_at)}
                        </div>

                        <button
                          onClick={() => handleDeleteProblem(savedProblem.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Enter Your Math Problem
              </h2>

              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Type your math problem here... For example: 'Solve for x: 2x + 5 = 13'"
                className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-slate-800 placeholder-slate-400"
              />

              <button
                onClick={handleExplain}
                disabled={!problem.trim() || isLoading}
                className="mt-4 w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {isLoading ? 'Analyzing...' : 'Explain It'}
              </button>
            </div>

            {steps.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Step-by-Step Explanation
                </h3>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="border-2 border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-300"
                    >
                      <button
                        onClick={() => toggleStep(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {step.title}
                          </span>
                        </div>

                        {expandedSteps.has(index) ? (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        )}
                      </button>

                      {expandedSteps.has(index) && (
                        <div className="px-4 pb-4 pt-2 bg-slate-50 border-t-2 border-slate-200">
                          <p className="text-slate-700 leading-relaxed">
                            {step.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is a placeholder demonstration. In production, this will connect to OpenAI API to provide real, personalized step-by-step explanations for your specific math problems.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>

        <footer className="text-center mt-12 text-slate-600">
          <p>&copy; 2025 Understand Your Math</p>
        </footer>
      </div>
    </div>
  );
}
