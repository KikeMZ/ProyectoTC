// import React from "react";
import { Pie } from "react-chartjs-2"

// eslint-disable-next-line react/prop-types
function PieChart( { chartDataChild } ) {
    console.log(chartDataChild);
    
    
    return(
        <>
            <h1>PieChart</h1>

            <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
            <Pie
                data={chartDataChild}
                options={{
                plugins: {
                    title: {
                    display: true,
                    text: "Users Gained between 2016-2020"
                    }
                }
                }}
            />
            </div>
        </>
    )


}

export default PieChart;