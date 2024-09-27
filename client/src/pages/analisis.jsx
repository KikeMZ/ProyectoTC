// import React from "react";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import PieChart from "../components/pieChart";
import { Button } from "@nextui-org/react";
import { BarChart } from "../components/barChart";
import LineChart from "../components/lineChart";


export const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];
  

Chart.register(CategoryScale);

function Analisis() {

    const data = {
        labels: ['Red', 'Orange', 'Blue'],
        // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
        datasets: [
            {
              label: 'Popularity of colours',
              data: [55, 23, 96],
              // you can set indiviual colors for each bar
              backgroundColor: [
                'rgba(255, 255, 255, 0.6)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(255, 255, 255, 0.6)'
              ],
              borderWidth: 1,
            }
        ]
    }

    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year),
        // labels: ("2020", "2021", "2022", "2023"),
        datasets: [
            {
              label: "Users Gained ",
              data: Data.map((data) => data.userGain),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "&quot;#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "white",
              borderWidth: 1
            }
          ]
    });
    



    return (
        <>
        <div className="flex justify-between">
            <h2 className="text-3xl font-semibold ml-6 mt-1 mb-4">Analisis De La Materia</h2>
            <Button onPress={()=> console.log("hi")} className=" text-base">
                <i className="pi pi-pencil"></i>
                Editar
            </Button>
        </div>
        <div className="flex">
            <PieChart chartDataChild={chartData}  />
            <BarChart chartDataChild={chartData} />
            <LineChart chartDataChild={chartData} />
        </div>

        </>
    )
}

export default Analisis;