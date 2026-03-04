import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Restatementtable = () => {
  return (
    <>
       <SkeletonTheme baseColor="var(--text)" highlightColor="var(--grid-hover)">
      <div
        style={{
          backgroundColor: "var(--grid-card-bg)",
          borderRadius: "8px",
          padding: "20px",
          width: "100%",
          minHeight: "425px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Top bar skeletons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton height={20} width={120} borderRadius={6} />
          <Skeleton height={20} width={220} borderRadius={6} />
        </div>

        {/* Table-like skeleton layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "16px",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              {[...Array(6)].map((_, j) => (
                <Skeleton
                  key={`${i}-${j}`}
                  height={16}
                  borderRadius={4}
                  style={{ marginBottom: "10px" }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </SkeletonTheme>
    </>
  )
}

export default Restatementtable