import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function Heading(props) {
  return (
    <div>
      <SkeletonTheme color="#efefef" highlightColor="#dedede">
        <Skeleton width={props.width} height={10} count={1} />
      </SkeletonTheme>
    </div>
  );
}

export default Heading;
