import React from "react";

const UserNotification = ({data}) => {
    const {title, numbers, text} = data;
  return (
    <div className="card card-body mb-4">
      <article className="icontext">
        <div className="text">
          <h6 className="mb-1 card-title">{title}</h6>
          <span>{numbers}</span>
          <span className="text-sm">{text}</span>
        </div>
      </article>
    </div>
  );
};

export default UserNotification;
