import React from 'react';
import Skeleton from 'react-loading-skeleton';

const FullScreenChat = () => {
  return (
    <div className="chat-skeleton">
      <div className="date-indicator-skeleton">
        <Skeleton height={20} width={80} />
      </div>
      <div className="message-skeleton skeleton-received">
        <Skeleton height={15} width={'80%'} />
      </div>
      <div className="message-skeleton skeleton-sent">
        <Skeleton height={15} width={'80%'} />
      </div>
      <div className="message-skeleton skeleton-received">
        <Skeleton height={15} width={'80%'} />
      </div>
      <div className="message-skeleton skeleton-sent">
        <Skeleton height={15} width={'80%'} />
      </div>
      <div className="message-skeleton skeleton-received">
        <Skeleton height={15} width={'80%'} />
      </div>
      <div className="message-skeleton skeleton-sent">
        <Skeleton height={15} width={'80%'} />
      </div>
      {/* Add more message skeletons as needed */}
    </div>
  );
};

export default FullScreenChat;
