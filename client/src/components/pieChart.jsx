// import React from "react";
import { Pie } from "react-chartjs-2"

// eslint-disable-next-line react/prop-types
function PieChart( { chartDataChild, titleChart } ) {
    console.log(chartDataChild);
    
    
    return(
        <>
            <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>{titleChart}</h2>
            <Pie
                data={chartDataChild}
                options={{
                // plugins: {
                //     title: {
                //     display: true,
                //     text: "Users Gained between 2016-2020"
                //     }
                // }
                }}
            />
            </div>
        </>
    )


}

export default PieChart;