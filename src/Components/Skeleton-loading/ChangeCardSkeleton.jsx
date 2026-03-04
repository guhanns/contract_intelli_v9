import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChangeCardSkeleton = () => {
  return (
    <SkeletonTheme color="var(--text)" highlightColor="var(--grid-hover)">
      <div className="space-y-4 max-w-md ">
        {/* REPLACED card */}
      <div className=" rounded-xl p-4  shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-16 bg-red-100 rounded-full text-xs font-semibold flex items-center justify-center text-red-700">
              <Skeleton width={45} height={16} />
            </div>
          </div>
          <Skeleton count={2} height={18} style={{ marginBottom: "4px" }} />
        </div>

        {/* REMOVED card */}
        <div className=" rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-16 bg-red-100 rounded-full text-xs font-semibold flex items-center justify-center text-red-700">
              <Skeleton width={45} height={16} />
            </div>
          </div>
          <Skeleton count={2} height={18} style={{ marginBottom: "4px" }} />
        </div>

        {/* ADDED card */}
        <div className=" rounded-xl p-4  shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-14 bg-green-100 rounded-full text-xs font-semibold flex items-center justify-center text-green-700">
              <Skeleton width={35} height={16} />
            </div>
          </div>
          <Skeleton count={2} height={18} style={{ marginBottom: "4px" }} />
        </div>
        <div className=" rounded-xl p-4  shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-14 bg-green-100 rounded-full text-xs font-semibold flex items-center justify-center text-green-700">
              <Skeleton width={35} height={16} />
            </div>
          </div>
          <Skeleton count={2} height={18} style={{ marginBottom: "4px" }} />
        </div>
        <div className=" rounded-xl p-4  shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-14 bg-green-100 rounded-full text-xs font-semibold flex items-center justify-center text-green-700">
              <Skeleton width={35} height={16} />
            </div>
          </div>
          <Skeleton count={2} height={18} style={{ marginBottom: "4px" }} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ChangeCardSkeleton;
