import React, { useState } from 'react';
import { AssignmentResult, SeedSkipResult, PlayerAssignment } from '../types';

// Type guard to check if the result is for Seed Skip mode
function isSeedSkipResult(result: any): result is SeedSkipResult {
  return result && result.team1Full && result.team2New;
}

// --- Sub-components for Seed Skip View ---
const Team1FullTable: React.FC<{ assignments: PlayerAssignment[], preAssignments: Record<string, string> }> = ({ assignments, preAssignments }) => {
  return (
    <div className="flex-1 min-w-[280px]">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        チームⅠ ブロック分け結果
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 border-collapse">
          <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-3 py-3 rounded-tl-lg">選手</th>
              <th scope="col" className="px-3 py-3 text-center rounded-tr-lg">ブロック</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(p => (
              <tr key={p.player} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{p.player}</td>
                <td className={`px-3 py-4 text-sky-500 font-bold text-base text-center transition-colors ${preAssignments[p.player] ? 'bg-sky-100 dark:bg-sky-900/50' : ''}`}>
                  {p.block}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Team2NewTable: React.FC<{ assignments: PlayerAssignment[] }> = ({ assignments }) => {
  return (
    <div className="flex-1 min-w-[280px]">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        チームⅡ ブロック分け結果
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 border-collapse">
          <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-3 py-3 rounded-tl-lg">選手</th>
              <th scope="col" className="px-3 py-3 text-center rounded-tr-lg">ブロック</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(p => (
              <tr key={p.player} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{p.player}</td>
                <td className="px-3 py-4 text-sky-500 font-bold text-base text-center">{p.block}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SeedSkipResultView: React.FC<{ result: SeedSkipResult, preAssignments: Record<string, string> }> = ({ result, preAssignments }) => {
  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-8">
      <Team1FullTable assignments={result.team1Full} preAssignments={preAssignments} />
      <Team2NewTable assignments={result.team2New} />
    </div>
  );
};

// --- Sub-components for Normal View ---
const NormalResultsTable: React.FC<{ assignments: AssignmentResult }> = ({ assignments }) => {
  const maxRows = Math.max(assignments.team1.length, assignments.team2.length);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 border-collapse">
        <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-3 py-3 rounded-tl-lg">チームⅠ選手</th>
            <th scope="col" className="px-3 py-3 text-center">ブロック</th>
            <th scope="col" className="px-3 py-3">チームⅡ選手</th>
            <th scope="col" className="px-3 py-3 text-center rounded-tr-lg">ブロック</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, index) => {
            const team1Player = assignments.team1[index];
            const team2Player = assignments.team2[index];
            
            return (
              <tr key={index} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                  {team1Player ? team1Player.player : ''}
                </td>
                <td className="px-3 py-4 text-sky-500 font-bold text-base text-center">
                  {team1Player ? team1Player.block : ''}
                </td>
                <td className="px-3 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                  {team2Player ? team2Player.player : ''}
                </td>
                <td className="px-3 py-4 text-sky-500 font-bold text-base text-center">
                  {team2Player ? team2Player.block : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ResultsCards: React.FC<{ assignments: AssignmentResult }> = ({ assignments }) => {
  const allPlayers = [
    ...assignments.team1.map(p => ({...p, team: 'I'})),
    ...assignments.team2.map(p => ({...p, team: 'II'})),
  ].sort((a,b) => a.block.localeCompare(b.block));
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {allPlayers.map((player) => (
        <div key={player.player} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-sky-500 mb-1">{player.block}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">{player.player}</div>
        </div>
      ))}
    </div>
  );
};

// --- Main Results Component ---
interface ResultsProps {
  assignments: AssignmentResult | SeedSkipResult | null;
  preAssignments?: Record<string, string>;
}

const Results: React.FC<ResultsProps> = ({ assignments, preAssignments }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  if (!assignments) return null;

  const isSkip = isSeedSkipResult(assignments);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">ブロック分け結果</h2>
        {!isSkip && (
          <div className="flex space-x-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
             <button onClick={() => setViewMode('table')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 shadow text-sky-600' : 'text-slate-600 dark:text-slate-300'}`}>
               <i className="fas fa-table-list mr-1"></i>
               <span className="hidden sm:inline">表</span>
             </button>
             <button onClick={() => setViewMode('cards')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${viewMode === 'cards' ? 'bg-white dark:bg-slate-800 shadow text-sky-600' : 'text-slate-600 dark:text-slate-300'}`}>
               <i className="fas fa-grip mr-1"></i>
               <span className="hidden sm:inline">カード</span>
             </button>
          </div>
        )}
      </div>
      
      {isSkip ? (
        <SeedSkipResultView result={assignments} preAssignments={preAssignments || {}} />
      ) : viewMode === 'table' ? (
        <NormalResultsTable assignments={assignments} />
      ) : (
        <ResultsCards assignments={assignments} />
      )}
    </div>
  );
};

export default Results;