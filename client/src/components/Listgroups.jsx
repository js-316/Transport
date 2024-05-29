import React from "react";

const Listgroups = ({ title, items }) => {
  return (
    <>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <ul className="list-group">
          {items.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.text}
              <span className="badge bg-secondary rounded-pill">
                {item.badge}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Listgroups;
