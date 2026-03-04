
// import React from "react";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// const TierStructureSkeloton = () => {
//   return (
//     <>
//       <SkeletonTheme
//         classname="tierskeloton"
//         color="var(--text)"
//         highlightColor="var(--grid-hover)"
//       >
//         <div
//           style={{
//             backgroundColor: "var(--grid-card-bg)",
//             borderRadius: "6px",
//             padding: "20px",
//             width: "auto",
//             height: "50%",
//             marginBottom: "20px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginBottom: "20px",
//             }}
//           >
//             <Skeleton height={30} width={200} borderRadius={6} />
//             <Skeleton height={30} width={30} borderRadius="50%" />
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(9, 1fr)",
//               gap: "15px 20px",
//             }}
//           >
//             {[...Array(9)].map((i) => (
//               <Skeleton key={i} height={25} width={120} borderRadius={6} />
//             ))}
//           </div>

//           <div
//             style={{
//               display: "grid",
//               marginTop: "24px",
//               gap: "15px 20px",
//             }}
//           >
//             {[...Array(15)].map((i) => (
//               <Skeleton key={i} height={25} width={170} borderRadius={6} />
//             ))}
//           </div>
//         </div>
//       </SkeletonTheme>
//     </>
//   );
// };

// export default TierStructureSkeloton;

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TierStructureSkeleton = () => {
  return (
    <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)"
    >
      <div
        style={{
          backgroundColor: "var(--grid-card-bg)",
          borderRadius: 6,
          padding: 20,
          width: "auto",
            height: "370px",
          marginBottom: 20,
        }}
      >
        {/* Top bar: Title and circle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Skeleton height={30} width={200} borderRadius={6} />
          <Skeleton height={30} width={30} circle />
        </div>

        {/* Header row with 9 items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "15px 20px",
            marginBottom: 20,
          }}
        >
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} height={25} borderRadius={6} />
          ))}
        </div>

        {/* 5 rows each with 9 items (total 45 items) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "15px 20px",
          }}
        >
          {[...Array(30)].map((_, idx) => (
            <Skeleton key={idx} height={25} borderRadius={6} />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TierStructureSkeleton;
