import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const TotalContracts = () => {
  return (
    <div>
      <div
        className="total-contracts-skeleton"
        style={{
          height: "50px",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "var(--grid-card-bg)",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
          {/* Left Icon Circle */}
          <Skeleton circle width={20} height={20} borderRadius={6} />

          {/* Text + Number */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "nowrap",
            }}
          >
            {/* Label skeleton */}
            <Skeleton height={20} width={103} borderRadius={6} />
            {/* Count skeleton */}
            <Skeleton height={24} width={19} borderRadius={6} />
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default TotalContracts;