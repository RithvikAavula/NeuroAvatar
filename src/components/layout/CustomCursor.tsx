import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTechnical, setIsTechnical] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(animate);
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.closest('button, a, [role="button"], input, textarea, select, [data-interactive]');
      const isTech = el.closest('[data-technical]');
      setIsHovering(!!isInteractive);
      setIsTechnical(!!isTech);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ transition: 'width 0.2s, height 0.2s' }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isTechnical
              ? 'w-1 h-1 bg-[hsl(var(--neural-cyan))]'
              : isHovering
              ? 'w-2 h-2 bg-[hsl(var(--neural-cyan))]'
              : 'w-1.5 h-1.5 bg-[hsl(var(--neural-cyan))]'
          }`}
          style={{
            boxShadow: '0 0 6px hsl(191 100% 50% / 0.9), 0 0 12px hsl(191 100% 50% / 0.4)'
          }}
        />
      </div>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full border transition-all duration-300 ${
            isTechnical
              ? 'w-8 h-8 border-[hsl(var(--neural-cyan))/50]'
              : isHovering
              ? 'w-10 h-10 border-[hsl(var(--neural-cyan))]'
              : 'w-6 h-6 border-[hsl(var(--neural-cyan))/40]'
          }`}
          style={{
            borderColor: isHovering
              ? 'hsl(191 100% 50% / 0.8)'
              : isTechnical
              ? 'hsl(191 100% 50% / 0.5)'
              : 'hsl(191 100% 50% / 0.3)',
            boxShadow: isHovering
              ? '0 0 15px hsl(191 100% 50% / 0.3)'
              : 'none',
          }}
        />
        {isTechnical && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-[hsl(var(--neural-cyan))/30]" />
          </div>
        )}
      </div>
    </>
  );
}
