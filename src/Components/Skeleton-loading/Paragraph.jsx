import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Paragraph() {
  return (
    <div>
      <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
        <Skeleton width={'90%'} height={10} count={2} />
        <Skeleton width={'80%'} height={10} count={1} />
      </SkeletonTheme>
    </div>
  );
}

export default Paragraph;
