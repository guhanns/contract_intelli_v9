import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function FiltersSkeleton() {
  return (
    <div
      className="filters-skeleton"
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: 'var(--grid-card-bg)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
        {/* Search bar */}
        <Skeleton height={32} width="100%" borderRadius={6} />

        {/* Filter sections */}
        {Array(4)
          .fill()
          .map((_, i) => (
            <div key={i} style={{ marginTop: '8px' }}>
              {/* Section title */}
              <Skeleton height={14} width="60%" />
              {/* Filter items */}
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Skeleton height={12} width="80%" />
                <Skeleton height={12} width="70%" />
                <Skeleton height={12} width="60%" />
              </div>
            </div>
          ))}

        {/* Bottom buttons or actions */}
        <div style={{ marginTop: 'auto' }}>
          <Skeleton height={32} width="100%" borderRadius={6} />
        </div>
      </SkeletonTheme>
    </div>
  );
}







