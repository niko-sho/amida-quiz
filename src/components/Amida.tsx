import { motion } from 'framer-motion';
import { useEffect } from 'react';

export interface HorizontalLine {
  row: number; // 0〜100 (% 表示に利用)
  col: number; // 左から 0,1,2,3
}

interface Props {
  columns: number;
  activeCol: number | null;
  onComplete: (endCol: number) => void;
}

// シンプルな固定横線 (必要なら編集可)
const HLINES: HorizontalLine[] = [
  { row: 25, col: 0 },
  { row: 50, col: 2 },
  { row: 75, col: 1 },
];

/**
 * あみだくじ描画 (SVG)
 * - 速度重視の簡易版。縦線固定、横線固定。
 * - activeCol が指定されたタイミングで 1 秒後に onComplete に最終列を返す。
 */
const Amida = ({ columns, activeCol, onComplete }: Props) => {
  // パス計算ロジック
  useEffect(() => {
    if (activeCol === null) return;
    let col = activeCol;
    // traverse
    HLINES.sort((a, b) => a.row - b.row).forEach((h) => {
      if (h.col === col) col = col + 1;
      else if (h.col + 1 === col) col = col - 1;
    });
    const timer = setTimeout(() => onComplete(col), 1000);
    return () => clearTimeout(timer);
  }, [activeCol, onComplete]);

  const colWidth = 100 / (columns - 1);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-64 max-w-xl">
      {/* 縦線 */}
      {Array.from({ length: columns }).map((_, i) => (
        <line
          key={i}
          x1={i * colWidth}
          y1={0}
          x2={i * colWidth}
          y2={100}
          stroke="black"
          strokeWidth={1}
        />
      ))}
      {/* 横線 */}
      {HLINES.map((h, idx) => (
        <line
          key={idx}
          x1={h.col * colWidth}
          y1={h.row}
          x2={(h.col + 1) * colWidth}
          y2={h.row}
          stroke="black"
          strokeWidth={1}
        />
      ))}
      {/* アニメーション用の丸 (active) */}
      {activeCol !== null && (
        <motion.circle
          cx={activeCol * colWidth}
          cy={0}
          r={2}
          fill="red"
          animate={{ cy: 100 }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      )}
    </svg>
  );
};

export default Amida; 