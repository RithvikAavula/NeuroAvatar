import { useState, useCallback } from 'react';
import './Folder.css';

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  const num = parseInt(color.slice(0, 6), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

const Folder = ({
  color = '#5227FF',
  size = 1,
  items = [],
  className = '',
  open: propOpen,
  onToggle
}: FolderProps) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) papers.push(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = propOpen !== undefined;
  const isOpen = isControlled ? propOpen : internalOpen;

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor('#ffffff', 0.1);
  const paper2 = darkenColor('#ffffff', 0.05);
  const paper3 = '#ffffff';

  const handleClick = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    const next = !isOpen;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  }, [isOpen, isControlled, onToggle]);

  return (
    <div
      style={{
        transform: `scale(${size})`,
        transformOrigin: "center center",
        display: "inline-block",
        willChange: "transform"
      }}
      className={className}
    >
      <div
        className={`folder ${isOpen ? 'open' : ''}`.trim()}
        style={{
          '--folder-color': color,
          '--folder-back-color': folderBackColor,
          '--paper-1': paper1,
          '--paper-2': paper2,
          '--paper-3': paper3,
        } as React.CSSProperties}
        onClick={handleClick}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); } }}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close folder' : 'Open folder'}
      >
        <div className="folder__back">
          {papers.map((item, i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
        </div>
      </div>
    </div>
  );
};

export default Folder;
