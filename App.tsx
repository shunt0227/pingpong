import React, { useState, useCallback } from 'react';
import Controls from './components/Controls';
import Results from './components/Results';
import ManualModal from './components/ManualModal';
import { generateAssignments, generateAssignmentsWithSkip } from './logic/assignment';
import { AssignmentResult, SeedSkipResult } from './types';
import { ALL_PLAYERS } from './constants';

const initialPreAssignments = ALL_PLAYERS.reduce((acc, player) => {
  acc[player] = ''; // '' means 'なし'
  return acc;
}, {} as Record<string, string>);


const App: React.FC = () => {
  const [team1Count, setTeam1Count] = useState<number>(4);
  const team2Count = 8 - team1Count;
  const [assignments, setAssignments] = useState<AssignmentResult | SeedSkipResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for Seed Skip mode
  const [isSeedSkipMode, setIsSeedSkipMode] = useState<boolean>(false);
  const [preAssignments, setPreAssignments] = useState<Record<string, string>>(initialPreAssignments);
  
  // State for Manual Modal
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleOpenManual = useCallback(() => setIsManualOpen(true), []);
  const handleCloseManual = useCallback(() => setIsManualOpen(false), []);


  const handleTeam1CountChange = useCallback((count: number) => {
    if (count === team1Count) return;
    setTeam1Count(count);
    setAssignments(null);
    setError(null);
  }, [team1Count]);
  
  const handleModeChange = useCallback((isSkipMode: boolean) => {
    setIsSeedSkipMode(isSkipMode);
    // Reset all settings to avoid state conflicts when changing modes
    setTeam1Count(4);
    setAssignments(null);
    setError(null);
    setPreAssignments(initialPreAssignments);
  }, []);

  const handleGenerate = useCallback(() => {
    setError(null);
    setAssignments(null); // Clear previous results immediately

    let result: AssignmentResult | SeedSkipResult | null;
    let errorMessage: string | null = null;
    
    if (isSeedSkipMode) {
      const fixedPlayerCount = Object.values(preAssignments).filter(b => b && b !== '').length;
      if (fixedPlayerCount === 0) {
        setError("シード飛ばしモードでは、少なくとも1人の選手を固定してください。");
        return;
      }
      
      result = generateAssignmentsWithSkip(preAssignments);
      if (!result) {
        errorMessage = "ブロックの割り当てに失敗しました。固定したブロックの組み合わせが、チーム内または全体のルールを満たせない可能性があります。ブロックの選択を見直してください。";
      }
    } else {
      result = generateAssignments(team1Count, team2Count);
      if (!result) {
        errorMessage = "ブロックの割り当てに失敗しました。内部エラーが発生したため、もう一度試してください。";
      }
    }

    if (result) {
      setAssignments(result);
    } else if (errorMessage) {
      setError(errorMessage);
    }
  }, [isSeedSkipMode, preAssignments, team1Count, team2Count]);
  
  const handleReset = useCallback(() => {
    setIsSeedSkipMode(false);
    setTeam1Count(4);
    setAssignments(null);
    setError(null);
    setPreAssignments(initialPreAssignments);
  }, []);

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          <i className="fa-solid fa-table-tennis-paddle-ball text-sky-500 mr-3"></i>
          卓球大会ブロック分け
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          チーム人数や固定ブロックを指定して、ルールに基づいたブロック分けを自動生成します。
        </p>
      </header>

      <main>
        <Controls
          team1Count={team1Count}
          setTeam1Count={handleTeam1CountChange}
          team2Count={team2Count}
          onGenerate={handleGenerate}
          onReset={handleReset}
          onOpenManual={handleOpenManual}
          error={error}
          isSeedSkipMode={isSeedSkipMode}
          onModeChange={handleModeChange}
          preAssignments={preAssignments}
          setPreAssignments={setPreAssignments}
        />

        {assignments && 
            <Results 
                assignments={assignments} 
                preAssignments={preAssignments}
            />
        }
        
        {!assignments && !error && (
            <div className="w-full max-w-4xl mx-auto mt-8 p-10 text-center bg-sky-50 dark:bg-sky-900/30 border-2 border-dashed border-sky-300 dark:border-sky-700 rounded-2xl">
                <i className="fa-solid fa-wand-magic-sparkles text-4xl text-sky-400"></i>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    上の設定を行い「ブロック分けを作成」ボタンを押してください。
                </p>
            </div>
        )}
      </main>
      
      <ManualModal isOpen={isManualOpen} onClose={handleCloseManual} />

      <footer className="text-center mt-12 py-4 text-sm text-slate-500 dark:text-slate-400">
        <p>Created with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;