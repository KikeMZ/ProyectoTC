// import React from "react";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useContext, useEffect, useState } from "react";
import PieChart from "../components/pieChart";
import { Button } from "@nextui-org/react";
import { BarChart } from "../components/barChart";
import LineChart from "../components/lineChart";
import { claseContext, NavContext } from "../layouts/layoutProfesor";
import CardStats from "../components/cardStats";


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

  const { dataClase } = useContext(claseContext);
  const { showNav } = useContext(NavContext);

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

  useEffect(() => {
    showNav();
    fetchAnalisis();
  }, [showNav, dataClase]);

  const fetchAnalisis = async () => {
    console.log("dataClase: ", dataClase);
    
    const nrc_clase = dataClase.nrc;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/entregas/tipos/${nrc_clase}/`);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        
        // Actualizamos el estado con las asistencias mensuales
        const asistenciasMensuales = result.asistencias_mensuales;

        const meses = asistenciasMensuales.map((item) => Object.keys(item)[0]);
        const valores = asistenciasMensuales.map((item) => Object.values(item)[0]);

        console.log("mesesAistencias: ", meses);
        console.log("valoresAistencias: ", valores);

        setChartData({
          labels: meses, // Labels son los meses
          datasets: [
            {
              label: "Asistencias Mensuales",
              data: valores, // Valores de asistencias
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "white",
              borderWidth: 1
            }
          ]
        });
        
      } else {
        console.error('Error al obtener la data:', response.statusText);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

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

    return (
        <>
        <div className="flex justify-between">
            <h2 className="text-3xl font-semibold ml-6 mt-1 mb-4">Analisis De La Materia</h2>
            <Button onPress={()=> console.log("hi")} className=" text-base">
                <i className="pi pi-pencil"></i>
                Editar
            </Button>
        </div>

    <div className="flex justify-between gap-4 p-4">
      {/* Card 1: Traffic */}
      <CardStats titleCard={"Test"} numberCard={250} iconCard={"pi pi-chart-bar"} iconColor={"bg-red-200"}/>
      {/* <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <div>
            <h3 className="text-gray-600">TRAFFIC</h3>
            <h2 className="text-2xl font-medium text-black">350,897</h2>
          </div>
          <div className="bg-red-200 text-red-600 rounded-full p-2">
            <i className="pi pi-chart-bar"></i>
          </div>
        </div>
        <p className="text-green-500 mt-2 text-sm">
          <i className="pi pi-arrow-up"></i> 3.48% Since last month
        </p>
      </div> */}

      {/* Card 2: New Users */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <div>
            <h3 className="text-gray-600">NEW USERS</h3>
            <h2 className="text-2xl font-bold text-black">2,356</h2>
          </div>
          <div className="bg-orange-200 text-orange-600 rounded-full p-2">
            <i className="pi pi-chart-pie"></i>
          </div>
        </div>
        <p className="text-red-500 mt-2 text-sm">
          <i className="pi pi-arrow-down"></i> 3.48% Since last week
        </p>
      </div>

      {/* Card 3: Sales */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <div>
            <h3 className="text-gray-600">SALES</h3>
            <h2 className="text-2xl font-bold text-black">924</h2>
          </div>
          <div className="bg-pink-200 text-pink-600 rounded-full p-2">
            <i className="pi pi-users"></i>
          </div>
        </div>
        <p className="text-red-500 mt-2 text-sm">
          <i className="pi pi-arrow-down"></i> 1.10% Since yesterday
        </p>
      </div>

      {/* Card 4: Performance */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <div>
            <h3 className="text-gray-600">PERFORMANCE</h3>
            <h2 className="text-2xl font-bold text-black">49.65%</h2>
          </div>
          <div className="bg-blue-200 text-blue-600 rounded-full p-2">
            <i className="pi pi-percent"></i>
          </div>
        </div>
        <p className="text-green-500 mt-2 text-sm">
          <i className="pi pi-arrow-up"></i> 12% Since last month
        </p>
      </div>
    </div>

        <div className="grid grid-cols-3 gap-3">
            <PieChart chartDataChild={chartData} titleChart={"Asistencias Mensuales"} />
            <BarChart chartDataChild={chartData} />
            <LineChart chartDataChild={chartData} />
        </div>

        </>
    )
}

export default Analisis;