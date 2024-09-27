
// eslint-disable-next-line react/prop-types
function CardStats( { titleCard, numberCard, iconCard, iconColor} ) {
    
    return(
        <>
            <div className="bg-white p-6 rounded-lg shadow-md w-1/4 flex flex-col items-start">
                <div className="flex justify-between w-full">
                <div>
                    <h3 className="text-gray-600">{titleCard}</h3>
                    <h2 className="text-2xl font-medium text-black">{numberCard}</h2>
                </div>
                <div className={"text-red-600 rounded-full p-2 " + iconColor}>
                    <i className={iconCard}></i>
                </div>
                </div>
                <p className="text-green-500 mt-2 text-sm">
                <i className="pi pi-arrow-up"></i> 3.48% Since last month
                </p>
            </div>
        </>
    )


}

export default CardStats;