import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Links() {
  return (
    <div className="links-skel">
      <SkeletonTheme color="#efefef" highlightColor="#dedede">
        <Skeleton width={200} height={10} count={1} className="mb-4" />
      </SkeletonTheme>
      <SkeletonTheme color="#efefef" highlightColor="#dedede">
        <Skeleton width={200} height={10} count={1} />
      </SkeletonTheme>
    </div>
  );
}

export default Links;
