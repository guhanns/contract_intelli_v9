import React from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import './Skeleton.css';

function TableData() {
  return (
    <div className="table-display-wrap">
      <div className="table-display">
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
      </div>
      <div className="table-display">
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
      </div>
      <div className="table-display">
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
      </div>
      <div className="table-display">
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
        <div className="table-item">
          <SkeletonTheme color="#efefef" highlightColor="#dedede">
            <Skeleton height={8} count={1} />
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
}

export default TableData;
