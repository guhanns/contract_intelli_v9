import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function TopPart() {
  return (
    <div className="top-part">
      <div>
        <div>
          <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
            <Skeleton width={250} height={10} count={1} />
          </SkeletonTheme>
        </div>
        <div className="mt-2">
          <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
            <Skeleton width={200} height={10} count={1} />
          </SkeletonTheme>
        </div>
      </div>
      <div>
        <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
          <Skeleton width={100} height={10} count={1} />
        </SkeletonTheme>
      </div>
    </div>
  );
}

export default TopPart;
