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

  const [cardStatsData, setCardStatsData] = useState([]);

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
        const entregas_tipo = result.entregas_por_tipo;

        setCardStatsData(Object.entries(entregas_tipo).map(([tipo, cantidad]) => ({
          title: tipo,
          number: cantidad,
          // icon: iconMapping[tipo]?.icon || "pi pi-chart-bar", // Valor por defecto
          color: "bg-pink-200", // Valor por defecto
        })));
        

        console.log("mesesAistencias: ", meses);
        console.log("valoresAistencias: ", valores);
        console.log("valoresCardStats: ", cardStatsData);

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

    <div className="flex justify-between gap-4 p-4 overflow-x-scroll">
      
      {cardStatsData.length > 0 ? (
          cardStatsData.map((data, index) => (
            <CardStats
              key={index}
              titleCard={data.title}
              numberCard={data.number}
              iconCard={"pi pi-list-check"}
              iconColor={data.color}
            />
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
      {/* Card 1: Traffic */}
      {/* <CardStats titleCard={"Test"} numberCard={250} iconCard={"pi pi-chart-bar"} iconColor={"bg-red-200"}/> */}
      {/* Colores de ionos bg-red-200,  bg-orange-200, bg-pink-200 bg-blue-200*/}
      {/* <CardStats titleCard={"Test"} numberCard={250} iconCard={"pi pi-chart-pie"} iconColor={"bg-orange-200"} />      
      <CardStats titleCard={"Test3"} numberCard={250} iconCard={"pi pi-users"} iconColor={"bg-pink-200"} />      
      <CardStats titleCard={"Test3"} numberCard={250} iconCard={"pi pi-percent"} iconColor={"bg-blue-200"} />       */}
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