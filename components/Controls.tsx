import React from 'react';
import { BLOCKS, ALL_PLAYERS } from '../constants';

interface ControlsProps {
  team1Count: number;
  setTeam1Count: (count: number) => void;
  team2Count: number;
  onGenerate: () => void;
  onReset: () => void;
  onOpenManual: () => void;
  error: string | null;
  isSeedSkipMode: boolean;
  onModeChange: (isSkip: boolean) => void;
  preAssignments: Record<string, string>;
  setPreAssignments: (assignments: Record<string, string>) => void;
}

const TeamCountsSelector: React.FC<{
  team1Count: number;
  onSelectTeam1Count: (count: number) => void;
  team2Count: number;
}> = ({ team1Count, onSelectTeam1Count, team2Count }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
    <div className="lg:col-span-2">
      <label className="text-lg font-medium text-slate-700 dark:text-slate-300">
        チームⅠの人数
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-3">
        {Array.from({ length: 8 }, (_, i) => i + 1).map(count => (
          <button
            key={count}
            type="button"
            onClick={() => onSelectTeam1Count(count)}
            aria-pressed={team1Count === count}
            className={`w-full font-bold py-2 px-3 rounded-lg border-2 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              team1Count === count
                ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-0.5'
            }`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
    <div>
      <label htmlFor="team2-display" className="text-lg font-medium text-slate-700 dark:text-slate-300">
        チームⅡの人数
      </label>
      <div
        id="team2-display"
        className="w-full px-4 py-2 mt-3 text-center bg-slate-100 dark:bg-slate-700/60 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-lg font-bold"
      >
        {team2Count}
      </div>
    </div>
  </div>
);

const SeedSkipControl: React.FC<{
  preAssignments: Record<string, string>;
  setPreAssignments: (assignments: Record<string, string>) => void;
}> = ({ preAssignments, setPreAssignments }) => {
  const selectedBlocks = Object.values(preAssignments).filter(b => b !== '');

  const handleBlockChange = (player: string, block: string) => {
    setPreAssignments({
      ...preAssignments,
      [player]: block,
    });
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
        固定ブロックの指定（シード飛ばし）
      </h3>
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">チームⅠの選手</th>
              <th scope="col" className="px-6 py-3">固定ブロック</th>
            </tr>
          </thead>
          <tbody>
            {ALL_PLAYERS.map(player => {
              const currentBlock = preAssignments[player] || '';
              return (
                <tr key={player} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                    {player}
                  </th>
                  <td className="px-6 py-4">
                    <select
                      value={currentBlock}
                      onChange={(e) => handleBlockChange(player, e.target.value)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                    >
                      <option value="">なし</option>
                      {BLOCKS.map(b => {
                        const isSelected = selectedBlocks.includes(b);
                        return (
                          <option key={b} value={b} disabled={isSelected && currentBlock !== b}>
                            {b}
                          </option>
                        )
                      })}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const Controls: React.FC<ControlsProps> = ({
  team1Count,
  setTeam1Count,
  team2Count,
  onGenerate,
  onReset,
  onOpenManual,
  error,
  isSeedSkipMode,
  onModeChange,
  preAssignments,
  setPreAssignments,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      
      <div className="flex items-center justify-end mb-6">
        <label htmlFor="seed-skip-toggle" className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">シード飛ばしを利用する</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            id="seed-skip-toggle" 
            className="sr-only peer"
            checked={isSeedSkipMode}
            onChange={(e) => onModeChange(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>
        </label>
      </div>

      <div className="space-y-8 mb-8">
        {isSeedSkipMode ? (
           <SeedSkipControl 
             preAssignments={preAssignments}
             setPreAssignments={setPreAssignments}
           />
        ) : (
          <TeamCountsSelector 
            team1Count={team1Count} 
            onSelectTeam1Count={setTeam1Count} 
            team2Count={team2Count} 
          />
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onGenerate}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-sitemap"></i>
          <span>ブロック分けを作成</span>
        </button>
        <button
          onClick={onOpenManual}
          className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-book-open"></i>
          <span>マニュアル</span>
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
        >
          <i className="fa-solid fa-arrows-rotate"></i>
          <span>リセット</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;