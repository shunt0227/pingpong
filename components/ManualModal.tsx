import React from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            <i className="fa-solid fa-book-open mr-2 text-sky-500"></i>
            使い方マニュアル
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="閉じる"
          >
            <i className="fa-solid fa-xmark fa-lg"></i>
          </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-sky-600 dark:text-sky-400">通常モード</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              チームⅠとチームⅡの人数比率を決めて、自動でブロック分けを生成する基本的なモードです。
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>チームⅠの人数を選択:</strong> 1から8までのボタンで、チームⅠに所属する選手の人数を選びます。（例: 4人）</li>
              <li><strong>チームⅡの人数:</strong> チームⅡの人数は、8人からチームⅠの人数を引いた数で自動的に決まります。（例: 4人）</li>
              <li><strong>作成ボタン:</strong>「ブロック分けを作成」ボタンを押すと、トーナメントのルールに基づいた割り当てが生成されます。</li>
            </ol>
          </section>

          <div className="border-t border-slate-200 dark:border-slate-700"></div>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-sky-600 dark:text-sky-400">シード飛ばしモード</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              大会ですでに一部のシード選手（I-1からI-8）のブロックが確定している場合に使用する、高度なモードです。
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>モード切替:</strong>「シード飛ばし」を選択します。</li>
              <li><strong>固定ブロックの指定:</strong> 表示された表で、ブロックを固定したい選手（例: I-1）の行にあるプルダウンから、ブロック（例: A）を選択します。複数の選手を固定できます。</li>
              <li><strong>作成ボタン:</strong>「ブロック分けを作成」ボタンを押すと、結果が左右2つのパネルに表示されます。</li>
            </ol>

            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">結果の見方（シード飛ばし）</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <strong>左パネル (チームⅠ ブロック分け結果):</strong><br/>
                8人全員の最終的なトーナメント表です。あなたが固定した選手のブロックは背景色がハイライトされます。固定されなかった他の選手は、全体のルールが成立するように自動で割り当てられます。
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                <strong>右パネル (チームⅡ ブロック分け結果):</strong><br/>
                あなたが指定したブロック（例: A, E）だけを使って、新しいチームⅡ（II-1, II-2...）を組んだ場合のシミュレーション結果です。これは参考情報となります。
              </p>
            </div>
          </section>

          <div className="border-t border-slate-200 dark:border-slate-700"></div>
          
          <section>
            <h3 className="text-lg font-semibold mb-2 text-sky-600 dark:text-sky-400">人数計算モード</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              トーナメント参加者の総人数を各ブロック（A～H）に、特定の順序で均等に振り分けるシミュレーション機能です。
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>モード切替:</strong>「人数計算」を選択します。</li>
              <li><strong>参加者総人数の入力:</strong> トーナメントに参加する全員の人数を入力します。（例: 50）</li>
              <li><strong>計算ボタン:</strong>「人数を計算」ボタンを押すと、各ブロックに何人ずつ割り振られるかを表形式で表示します。</li>
            </ol>
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
              <p><strong>振り分け順序:</strong> 人数は <code>AHEDCFGBBGFCDEHA</code> という決まった順序で1人ずつ繰り返し割り振られます。</p>
            </div>
          </section>
        </main>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md"
          >
            閉じる
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ManualModal;