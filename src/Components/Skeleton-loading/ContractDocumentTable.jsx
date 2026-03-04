import React from 'react'

const ContractDocumentTable = () => {
  return (
    <>
      <SkeletonTheme
        baseColor="var(--skeleton-base)"
        highlightColor="var(--skeleton-highlight)"
      >
        <div className="tier-skeleton">
          {/* Header */}
          <div className="tier-skeleton-header">
            <Skeleton height={28} width={220} borderRadius={6} />
            <Skeleton circle height={30} width={30} />
          </div>

          {/* Grid section */}
          <div className="tier-skeleton-grid">
            {[...Array(60)].map((_, i) => (
              <Skeleton key={i} height={18} borderRadius={6} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
}

export default ContractDocumentTable