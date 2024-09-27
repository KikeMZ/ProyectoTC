// components/BarChart.js
import { Bar } from "react-chartjs-2";

// eslint-disable-next-line react/prop-types
export const BarChart = ({ chartDataChild }) => {
    console.log(chartDataChild);
    
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar
        data={chartDataChild}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};