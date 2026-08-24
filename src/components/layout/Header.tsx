import React from 'react';
import type { SectionId, SectionMeta } from '../../types/learning';
import { Menu, X, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentSection: SectionMeta;
  completedCount: number;
  totalCount: number;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onResetProgress: () => void;
  onSelectSection: (id: SectionId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  completedCount,
  totalCount,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onResetProgress,
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(7, 11, 20, 0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      padding: '0 20px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      {/* Left: mobile hamburger + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {/* Hamburger — only renders on mobile via CSS */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="mobile-menu-btn"
          style={{
            padding: '6px 8px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            display: 'none', // shown via @media in global style below
          }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Active topic pill */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 1 }}>
            CURRENT TOPIC
          </div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#e2e8f0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {currentSection.shortTitle}
            <span style={{
              marginLeft: 8, fontSize: 10, fontFamily: 'monospace',
              color: '#06b6d4', opacity: 0.8,
            }}>
              {currentSection.ibSyllabusRef.split('—')[0].trim()}
            </span>
          </div>
        </div>
      </div>

      {/* Right: progress + reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Progress chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 999,
          background: 'rgba(6,182,212,0.08)',
          border: '1px solid rgba(6,182,212,0.25)',
          fontSize: 12, fontFamily: 'monospace',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#06b6d4' }}>{completedCount}</strong>/{totalCount} done
          </span>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all progress and quiz answers?')) onResetProgress();
          }}
          title="Reset progress"
          style={{
            padding: '6px 8px', borderRadius: 8,
            background: 'transparent',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#64748b',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f43f5e'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.15)'; }}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Make hamburger visible on small screens */}
      <style>{`
        @media (max-width: 1023px) {
          .mobile-menu-btn { display: flex !important; align-items: center; }
        }
      `}</style>
    </header>
  );
};
