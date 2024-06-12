import React, { useState } from "react";

const StatusTable = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: false },
    { id: 3, name: "Task 3", completed: false },
  ]);

  const handleCheckboxChange = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (

  
    
      <div>
        <h2>Table with Status Checkboxes</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: item.completed ? "#d4edda" : "",
                }}
              >
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <style jsx>{`
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
        `}</style>
      </div>
   
  );
};

export default StatusTable;
