const costsExportToPDF = (vehichleId) => {
  const doc = new jsPDF();
  const vehichleMaintenances = filteredData.filter((maintenance) => maintenance.id === vehicleId);
  const totalCost = vehichleMaintenances.reduce((acc, maintenance) => acc + maintenance.cost, 0);

  doc.text(`Vehichle Maintenance Report - ${vehichleMaintenances[0].fleet.number_plate}`, 10, 10);
  doc.text(`Total Cost: ${totalCost}`, 10, 20);

  const tableData = [];
  vehichleMaintenances.forEach((record) => {
    tableData.push([
      record.description,
      record.cost,
      record.date,
    ]);
  });
  doc.autoTable({
    head: [["Description", "Cost", "Date"]],
    body: tableData,
  });
  doc.save("vehichle_maintenance_report.pdf");
};
<div className="col-lg-2 col-md-3 col-6">
              <select
                id="vehicle-select" 
                onChange={(e) => costsExportToPDF(e.target.value)}
                placeholder= "Select Vehicle"
                className="form-select"
              >
                {vehichles.map((vehichle) => (
                <option value={vehichle.id}>
                  {vehichle.number_plate}
                  </option>
                ))}
                
              </select>
            </div>