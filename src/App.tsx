import { useState } from 'react';
import questions from './data/questions.json';

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

const App = () => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'ok' | 'ng' | null>(null);

  const q = questions[idx] as Question;

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    const isCorrect = id === q.correct;
    setResult(isCorrect ? 'ok' : 'ng');
  };

  const handleNext = () => {
    setIdx((p) => p + 1);
    setSelected(null);
    setResult(null);
  };

  const handleRetry = () => {
    setSelected(null);
    setResult(null);
  };

  if (idx >= questions.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-3xl font-bold">全問クリア！🎉</h1>
        <video src="/videos/clear.mp4" autoPlay playsInline muted loop className="w-64 rounded-lg" />
      </div>
    );
  }

  // 候補者を2行に分割
  const candidatesPerRow = Math.ceil(q.candidates.length / 2);
  const row1 = q.candidates.slice(0, candidatesPerRow);
  const row2 = q.candidates.slice(candidatesPerRow);

  // 結果画面
  if (selected && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {result === 'ok' ? '正解！🎉' : '不正解...😢'}
          </h2>
          {result === 'ok' ? (
            <video
              src={q.candidates.find((c) => c.id === selected)!.okVideo}
              autoPlay
              muted
              playsInline
              className="w-80 rounded-lg shadow-lg"
            />
          ) : (
            <img
              src={q.candidates.find((c) => c.id === selected)!.ngImage}
              alt="不正解"
              className="w-48 h-48 object-cover rounded-full border-4 border-red-200 mx-auto"
            />
          )}
        </div>
        <button
          onClick={result === 'ok' ? handleNext : handleRetry}
          className={`px-8 py-3 rounded-lg text-white font-bold text-lg ${
            result === 'ok' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } transition-colors`}
        >
          {result === 'ok' ? '次の問題へ' : 'もう一度挑戦'}
        </button>
      </div>
    );
  }

  // 問題画面
  return (
    <div className="min-h-screen flex flex-col items-center gap-8 p-4">
      {/* 問題文 */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center">{q.question}</h1>
      </div>

      {/* 候補者グリッド */}
      <div className="w-full max-w-3xl space-y-8">
        {/* 1行目 */}
        <div className="grid grid-cols-5 gap-4">
          {row1.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src={c.photo}
                alt={c.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </div>

        {/* 2行目 */}
        <div className="grid grid-cols-5 gap-4">
          {row2.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src={c.photo}
                alt={c.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
