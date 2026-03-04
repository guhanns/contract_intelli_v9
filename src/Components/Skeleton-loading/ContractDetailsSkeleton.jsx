import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ContractDetailsSkeleton = () => {
  return (
    <>
        <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
      <div
        style={{
          backgroundColor: "var(--grid-card-bg)",
          color: "var(--text)",
          borderRadius: "6px",
          padding: "20px",
          width: "auto",
          height: "370px",
          marginBottom: "20px",
        }}
      >
        {/* Heading Skeleton */}
        <Skeleton height={25} width={150} style={{ marginBottom: 20 }} />
        <Skeleton height={25} width={310} style={{ marginBottom: 20 }} />

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Column (Labels) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={20} width="100%" borderRadius={6} />
            ))}
          </div>

          {/* Right Column (Values) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={20} width="100%" borderRadius={6} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
    </>
  )
}

export default ContractDetailsSkeleton