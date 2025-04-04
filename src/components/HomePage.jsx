import '../assets/css/colors.css'
import '../assets/css/Principais.css'
import '../assets/css/fonts.css'
import '../assets/css/homePage.css'
import { useNavigate } from 'react-router-dom'

var windowHeight = window.screen.availHeight;
//logoAnimation
export default function HomePage({ativaResp}){

    const navigate = useNavigate();


    return <>
        <div className="containerPrincipal homePage" style={{minHeight: "100vh", maxHeight: windowHeight*1, backgroundColor: "#322E2E", display: 'flex',
    flexDirection: 'column'/*, overflowY: "hidden"*/}}>

        <div className="roudBackGradient"></div>

        {!ativaResp ? <div className="homeContent">
            <div className="topTMP"></div>
            <div className="top">
                <div className="topTitle">BH Tour Assistant</div>
                <div className="topLogo"></div>
                <div className="loginBtns">
                    <div className="login" onClick={()=>navigate('/ChatTour')}>Iniciar Chat</div>
                </div>
            </div>

            <div className="centerPage">
                <div className="textPage">
                    <span>BH na palma da mão</span><br />
                    Descubra lugares incríveis e <br /> 
                    viva experiências inesquecíveis!
                </div>
                <div className="imageCenter"></div>
            </div>
        </div> : 

            <div className="homeContent">
            <div className="topTMP"></div>
            <div className="top">
                <div className="topLogo"></div>
                <div className="topTitle">BH Tour Assistant</div>
            </div>

            <div className="centerPage">
                <div className="textPage">
                    <span>BH na palma da mão</span><br />
                    Descubra lugares incríveis e <br /> 
                    viva experiências inesquecíveis!
                </div>
            </div>

            <div className="loginBtns">
                    <div className="login" onClick={()=>navigate('/ChatTour')}>Iniciar Chat</div>
                </div>
        </div>}
        
        </div>

    </>
}