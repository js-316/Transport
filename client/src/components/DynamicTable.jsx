import React, { useState } from "react";

function DynamicTable() {
  const [rows, setRows] = useState([]);

  const addRow = () => {
    const newRow = {
      id: rows.length > 0 ? rows[rows.length - 1].id + 1 : 1,
      equipment: "",
      quantity: 0,
    };
    setRows([...rows, newRow]);
  };

  const handleEquipmentChange = (id, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, equipment: value } : row
    );
    setRows(updatedRows);
  };

  const handleQuantityChange = (id, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, quantity: value } : row
    );
    setRows(updatedRows);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div>
      <table border="1" className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Equipment</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <input
                  type="text"
                  value={row.equipment}
                  onChange={(e) =>
                    handleEquipmentChange(row.id, e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) =>
                    handleQuantityChange(row.id, parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                <button className=" btn btn-danger btn-sm"  onClick={() => deleteRow(row.id)}>DEL</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={addRow}>Add Part</button>
    </div>
  );
}

export default DynamicTable;
