import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ContractCard = () => {
  return (
    <div
      className="contract-card"
      style={{
        width:'100%',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: 'var(--grid-card-bg)',
        color: 'var(--text)',
      }}
    >
      <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
        {/* Header with icon and title */}
        <div className="d-flex align-items-start gap-2 mb-2">
          <Skeleton width={30} height={40} /> {/* Icon placeholder */}
          <div style={{ flex: 1 }}>
            <Skeleton height={16} width="80%" />
            <Skeleton height={12} width="60%" style={{ marginTop: 6 }} />
          </div>
        </div>

        {/* Version and status */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Skeleton height={14} width="30%" />
          <Skeleton height={20} width={60} borderRadius={12} />
        </div>

        {/* Type */}
        <div className="mb-2">
          <Skeleton width="30%" height={12} />
          <Skeleton width="50%" height={12} style={{ marginTop: 4 }} />
        </div>

        {/* Customer */}
        <div className="mb-2">
          <Skeleton width="30%" height={12} />
          <Skeleton width="50%" height={12} style={{ marginTop: 4 }} />
        </div>

        {/* Dates */}
        <div className="d-flex justify-content-between">
          <div>
            <Skeleton width={50} height={10} />
            <Skeleton width={90} height={14} style={{ marginTop: 4 }} />
          </div>
          <div>
            <Skeleton width={50} height={10} />
            <Skeleton width={90} height={14} style={{ marginTop: 4 }} />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default ContractCard;
