import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function ContractDocuments() {
  return (
    <div
      style={{
        width: "23%",
        backgroundColor: "var(--grid-card-bg)",
        padding: "12px",
        height: "95vh",
        borderRadius: "8px",
        marginLeft: "20px",
      }}
    >
      <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[...Array(14)].map((_, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {/* Dot */}
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--skeleton-highlight)",
                  flexShrink: 0,
                }}
              ></span>

              {/* Two stacked bars */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                }}
              >
                <Skeleton height={14} width="85%" borderRadius={6} />
                <Skeleton height={10} width="60%" borderRadius={6} />
              </div>
            </li>
          ))}
        </ul>
      </SkeletonTheme>
    </div>
  );
}
