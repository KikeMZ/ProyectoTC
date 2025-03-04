
// eslint-disable-next-line react/prop-types
function CardStats( { titleCard, numberCard, iconCard, iconColor} ) {
    
    return(
        <>
            <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
                <div className="flex justify-between w-full">
                <div>
                    <h3 className="text-gray-600">{titleCard}</h3>
                    <h2 className="text-2xl font-medium text-black">{numberCard} {(numberCard <= 1) ? "Entrega" : "Entregas" }</h2>
                </div>
                <div className={"text-red-600 rounded-full p-2 " + iconColor} style={{height: "min-content"}}>
                    <i className={iconCard}></i>
                </div>
                </div>
                {/* <p className="text-green-500 mt-2 text-sm">
                <i className="pi pi-arrow-up"></i> 3.48% Since last month
                </p> */}
            </div>

            {/* Card 2: New Users */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
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
            </div> */}
            
            {/* Card 3: Sales */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
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
            </div> */}

            {/* Card 4: Performance */}
            {/* <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
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
            </div> */}
        </>
    )


}

export default CardStats;