import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton = () => {
  const rows = 17;
  const columns = 9; 

  return (
    <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
      <div
        style={{
          padding: "20px",
          backgroundColor: "var(--grid-card-bg)",
          borderRadius: "10px",
        }}
      >
        {/* Header skeleton */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Skeleton height={20} width={240} borderRadius={6} />
          <div style={{ display: "flex", gap: "12px" }}>
            <Skeleton height={30} width={190} borderRadius={6} />
            <Skeleton height={30} width={190} borderRadius={6} />
            <Skeleton height={30} width={190} borderRadius={6} />
          </div>
        </div>

        {/* Table skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "14px",
            marginTop: "25px",
          }}
        >
          {[...Array(rows)].map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  height={18}
                  borderRadius={6}
                  style={{ marginBottom: "12px" }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TableSkeleton;
