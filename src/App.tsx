import { useState } from 'react';
import questions from './data/questions.json';
import './App.css';

interface Candidate {
  id: string;
  name: string;
  photo: string;
  okVideo: string;
  ngImage: string;
}

interface Question {
  question: string;
  correct: string;
  candidates: Candidate[];
}

interface AnswerHistory {
  question: string;
  correct: string;
  attempts: string[];
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswerTable, setShowAnswerTable] = useState(false);
  const [answerHistories, setAnswerHistories] = useState<AnswerHistory[]>([]);
  const [currentAttempts, setCurrentAttempts] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex] as Question;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    const isAnswerCorrect = candidate.id === currentQuestion.correct;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    
    // 現在の問題の回答履歴に追加
    setCurrentAttempts(prev => [...prev, candidate.name]);

    if (isAnswerCorrect) {
      // 正解した場合、回答履歴を保存
      setAnswerHistories(prev => [...prev, {
        question: currentQuestion.question,
        correct: currentQuestion.candidates.find(c => c.id === currentQuestion.correct)?.name || '',
        attempts: [...currentAttempts, candidate.name]
      }]);
      // 次の問題のために回答履歴をリセット
      setCurrentAttempts([]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">パスワードを入力してください</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="パスワード"
              />
              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">パスワードが正しくありません</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showAnswerTable) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">クイズ結果</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">問題</th>
                  <th className="py-3 px-4 text-left">正解</th>
                  <th className="py-3 px-4 text-left">あなたの回答</th>
                </tr>
              </thead>
              <tbody>
                {answerHistories.map((history, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{history.question}</td>
                    <td className="py-3 px-4">{history.correct}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {history.attempts.map((attempt, attemptIndex) => (
                          <div
                            key={attemptIndex}
                            className={`px-2 py-1 rounded ${
                              attempt === history.correct
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {attemptIndex + 1}回目: {attempt}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
          {isCorrect ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">正解です！</h2>
              <video
                src={currentQuestion.candidates.find(c => c.id === currentQuestion.correct)?.okVideo}
                autoPlay
                className="w-full rounded-lg mb-4"
              />
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  次の問題へ
                </button>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">おめでとうございます！</h3>
                  <p className="text-gray-600 mb-4">すべての問題をクリアしました！</p>
                  <button
                    onClick={() => setShowAnswerTable(true)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    すべての回答を見る
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">不正解です</h2>
              <img
                src={currentQuestion.candidates.find(c => c.id === currentQuestion.correct)?.ngImage}
                alt="不正解"
                className="w-full rounded-lg mb-4"
              />
              <button
                onClick={handleTryAgain}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                もう一度挑戦
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {currentQuestion.candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => handleCandidateClick(candidate)}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square rounded-full overflow-hidden mb-2">
                <img
                  src={candidate.ngImage}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-medium">{candidate.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
