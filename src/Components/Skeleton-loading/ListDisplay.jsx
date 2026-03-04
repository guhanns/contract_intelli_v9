import React from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function ListDisplay(props) {
  return (
    <div>
      <Row>
        <Col sm="12" lg="3" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede">
              <Skeleton width={150} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="3" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede">
              <Skeleton width={150} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="3" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede">
              <Skeleton width={150} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="3" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede">
              <Skeleton width={150} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ListDisplay;
