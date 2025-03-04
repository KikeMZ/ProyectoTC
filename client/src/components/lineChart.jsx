// components/LineChart.js

import { Line } from "react-chartjs-2";

function LineChart({ chartDataChild, titleChart}) {
    console.log(chartDataChild);
    
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}> {titleChart} </h2>
      <Line
        data={chartDataChild}
        // options={{
        //   plugins: {
        //     title: {
        //       display: true,
        //       text: "Users Gained between 2016-2020"
        //     },
        //     legend: {
        //       display: false
        //     }
        //   }
        // }}
      />
    </div>
  );
}
export default LineChart;