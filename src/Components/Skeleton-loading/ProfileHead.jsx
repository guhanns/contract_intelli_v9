import React from 'react';
import { Row, Col } from 'reactstrap';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


function ProfileHead() {
  return (
    <div>
      <SkeletonTheme color="#efefef" highlightColor="#dedede">
        <p>
          <Skeleton count={3} width={"400px"} />
        </p>
      </SkeletonTheme>
    </div>
  );
}

export default ProfileHead
