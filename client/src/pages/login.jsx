import LoginCard from "../components/loginCard"

export default function Login(){

    return(
        <div className="flex w-full h-screen">
            <div className="w-full flex items-center justify-center lg:w-1/2 ">
                <LoginCard></LoginCard>
            </div>
            <div className="hidden lg:flex h-full w-1/2 items-center justify-center">
                <b>Sistema de Control Escolar</b>
            </div>
        </div>
    )
}
