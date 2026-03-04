import React from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function ContentData() {
  return (
    <div style={{ width: '70%' }}>
      <Row>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={150} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={150} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#333333"  highlightColor="#555555" id="pkg-page-loading">
              <Skeleton width={150} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={'100%'} height={10} count={1} />
            </SkeletonTheme>
          </div>
        </Col>
        <Col sm="12" lg="12" md="6">
          <div className="mb-2">
            <SkeletonTheme color="#efefef" highlightColor="#dedede" id="pkg-page-loading">
              <Skeleton width={150} height={10} count={3} />
            </SkeletonTheme>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ContentData;
