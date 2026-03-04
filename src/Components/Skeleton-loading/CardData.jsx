import React from 'react';
import { Row, Col } from 'reactstrap';

import './Skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function CardData() {
  return (
    <div className="card-view-loader-wrap">
      <div className="card-view-list-item">
        <Row>
          <Col sm="12" lg="8" md="8">
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
          </Col>
          <Col sm="12" lg="4" md="4">
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
            <div className="card-view-item">
              <SkeletonTheme color="#efefef" highlightColor="#dedede">
                <Skeleton height={8} count={1} />
              </SkeletonTheme>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CardData;
