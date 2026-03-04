import React from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import './Skeleton.css';

function GridData() {
  return (
    <div className="card-view-loader-wrap">
      <Row>
        <Col sm="12" lg="4" md="4">
          <div className="card-view-list-item">
            <Row>
              <Col sm="12" lg="12" md="12">
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
        </Col>
        <Col sm="12" lg="4" md="4">
          <div className="card-view-list-item">
            <Row>
            <Col sm="12" lg="12" md="12">
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
        </Col>
        <Col sm="12" lg="4" md="4">
          <div className="card-view-list-item">
            <Row>
            <Col sm="12" lg="12" md="12">
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
        </Col>
      </Row>
    </div>
  );
}

export default GridData;
