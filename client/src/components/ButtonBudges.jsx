import React from "react";

const ButtonBudges = () => {
  return (
    <div className="card">
      <div className="card-body d-flex justify-content-between">
        <h5 className="card-title mb-6">Status</h5>
        <button type="button" className="btn btn-primary mb-2 ">
          <span style={{ marginRight: "10px" }}>Upcoming</span>
          <span className="badge bg-white text-primary">4</span>
        </button>
        <button type="button" className="btn btn-secondary mb-2">
          <span style={{ marginRight: "10px" }}>Pending</span>
          <span className="badge bg-white text-secondary">4</span>
        </button>
        <button type="button" className="btn btn-success mb-2">
          <span style={{ marginRight: "10px" }}>Done</span>
          <span className="badge bg-white text-success">4</span>
        </button>
        <button type="button" className="btn btn-danger mb-2">
          <span style={{ marginRight: "10px" }}>OverDue</span>
          <span className="badge bg-white text-danger">4</span>
        </button>
      </div>
    </div>
  );
};

export default ButtonBudges;
