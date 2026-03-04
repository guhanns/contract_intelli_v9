import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Circle({ width = 100, height = 100 }) {
  return (
    <div>
      <SkeletonTheme color="#efefef" highlightColor="#dedede">
        <Skeleton circle={true} width={width} height={height} count={1} />
      </SkeletonTheme>
    </div>
  );
}

export default Circle;
