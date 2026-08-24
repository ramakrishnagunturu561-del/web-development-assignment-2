import React from 'react';
import type { SectionId } from '../../types/learning';
import { SECTIONS_METADATA } from '../../data/chapterData';
import {
  BookOpen, Compass, Activity, ArrowLeftRight, Layers,
  Flame, Scale, GitBranch, Orbit, Award, CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  currentSectionId: SectionId;
  completedSectionIds: SectionId[];
  onSelectSection: (id: SectionId) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen:      <BookOpen size={15} />,
  Compass:       <Compass size={15} />,
  Activity:      <Activity size={15} />,
  ArrowLeftRight:<ArrowLeftRight size={15} />,
  Layers:        <Layers size={15} />,
  Flame:         <Flame size={15} />,
  Scale:         <Scale size={15} />,
  GitBranch:     <GitBranch size={15} />,
  Orbit:         <Orbit size={15} />,
  Award:         <Award size={15} />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentSectionId,
  completedSectionIds,
  onSelectSection,
}) => {
  const completed = completedSectionIds.length;
  const total     = SECTIONS_METADATA.length;
  const pct       = Math.round((completed / total) * 100);

  return (
    <nav style={{
      height: '100%',
      background: 'linear-gradient(180deg, #080d1a 0%, #070b14 100%)',
      borderRight: '1px solid rgba(148,163,184,0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px 24px',
      overflowY: 'auto',
    }}>
      {/* ── Brand ─────────────────────────────────────────── */}
      <div style={{ padding: '0 4px 16px', borderBottom: '1px solid rgba(148,163,184,0.1)', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#07111f',
            flexShrink: 0,
          }}>⚛</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              Force<span style={{ color: '#06b6d4' }}>Lab</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>IB Diploma Physics</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
              Module Progress
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#06b6d4' }}>
              {completed}/{total} · {pct}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 999, background: '#1e293b', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #06b6d4, #10b981)',
              transition: 'width 0.4s ease',
              borderRadius: 999,
            }} />
          </div>
        </div>
      </div>

      {/* ── Nav items ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {SECTIONS_METADATA.map((section) => {
          const isActive    = currentSectionId === section.id;
          const isDone      = completedSectionIds.includes(section.id);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 10,
                border: `1px solid ${isActive ? 'rgba(6,182,212,0.45)' : 'transparent'}`,
                background: isActive
                  ? 'linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.04) 100%)'
                  : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {/* Icon badge */}
              <span style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone
                  ? 'rgba(16,185,129,0.18)'
                  : isActive
                  ? '#06b6d4'
                  : 'rgba(255,255,255,0.06)',
                color: isDone ? '#10b981' : isActive ? '#07111f' : '#94a3b8',
                border: `1px solid ${isDone ? 'rgba(16,185,129,0.35)' : isActive ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
              }}>
                {isDone ? <CheckCircle2 size={13} /> : (ICON_MAP[section.iconName] ?? <BookOpen size={13} />)}
              </span>

              {/* Text */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : isDone ? '#cbd5e1' : '#94a3b8',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {section.shortTitle}
                </div>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
                  {section.estimatedMinutes} min · {section.ibSyllabusRef.split('—')[0].trim()}
                </div>
              </div>

              {/* Active bar */}
              {isActive && (
                <span style={{
                  marginLeft: 'auto', width: 3, height: 16, borderRadius: 99,
                  background: '#06b6d4', flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(148,163,184,0.08)',
        paddingTop: 12, marginTop: 12,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: '#334155', fontFamily: 'monospace',
      }}>
        <span>ForceLab v1.0</span>
        <span style={{ color: '#06b6d4' }}>Interactive Engine</span>
      </div>
    </nav>
  );
};
