import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ProductPricingDetails = () => {
  return (
    <>
     
          <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
            <div
              style={{
                width: "auto",
                height: "390px",
                backgroundColor: "var(--grid-card-bg)",
                borderRadius: "10px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton width={230} height={20} borderRadius={6} />
                <Skeleton width={140} height={18} borderRadius={6} />
              </div>

              {/* Main Table Rows */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "30px",
                  marginTop: "20px",
                }}
              >
                {[...Array(5)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {[...Array(8)].map((_, rowIndex) => (
                      <Skeleton
                        key={rowIndex}
                        width="180px"
                        height={14}
                        borderRadius={6}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Footer Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
           
              </div>
            </div>
          </SkeletonTheme>
     
    </>
  );
};

export default ProductPricingDetails;