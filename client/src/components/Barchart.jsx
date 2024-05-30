import React from "react";
import Chart from "react-apexcharts";

const BarChart = () => {
    
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "01/01/2013 ",
        "02/02/2013 ",
        "03/03/2013 ",
        "04/04/2013 ",
        "05/05/2013 ",
        "06/06/2013 ",
        "07/07/2013 ",
      ],
    },
    colors: ["#64CCC5"],
  };

  const series = [
    {
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    },

    
  ];

  return (
    <div id="barChart">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
