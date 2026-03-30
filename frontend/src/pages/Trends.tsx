import { useEffect, useRef } from 'react';
import { MOCK_TRENDS } from '../data/mockData';

export default function Trends() {
  const gridRef = useRef<HTMLDivElement>(null);

  // Animate bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (gridRef.current) {
        gridRef.current.querySelectorAll<HTMLElement>('.trend-bar-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          if (w) bar.style.width = w;
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Domain Trends</div>
        <div className="page-desc">Vote momentum and submission volume across all idea domains</div>
      </div>

      <div className="trends-grid" ref={gridRef}>
        {MOCK_TRENDS.map(t => {
          const pct = t.growth.replace('+', '').replace('%', '');
          return (
            <div key={t.domain} className="trend-card">
              <div className="trend-domain">{t.domain}</div>
              <div className="trend-bar-wrap">
                <div className="trend-bar-label">
                  <span>Momentum</span>
                  <span>{t.growth}</span>
                </div>
                <div className="trend-bar-track">
                  <div className="trend-bar-fill" data-width={`${pct}%`} style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="trend-nums">
                <div className="trend-num">
                  <div className="trend-num-val">{t.ideasCount}</div>
                  <div className="trend-num-lbl">IDEAS</div>
                </div>
                <div className="trend-num">
                  <div className="trend-num-val">{t.voteWeight}</div>
                  <div className="trend-num-lbl">VOTES</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
