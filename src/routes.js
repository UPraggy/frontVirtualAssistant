import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes as Router, Route} from 'react-router-dom';
import HomePage from "./components/HomePage.jsx";
import ChatTour from './components/ChatTour.jsx';
function Routes(){

    const [ativaResp, setAtivaResp] = useState(null)

    useEffect(()=>{
        if (ativaResp == null){
            if (window.matchMedia("(max-width: 767px)").matches){
            setAtivaResp(true)
            }else{
                setAtivaResp(false)
            }
        }
    },[ativaResp])

    return(
        <BrowserRouter>
            <Router>
                <Route path="/" element={<HomePage ativaResp={ativaResp} />}/>
                <Route path="/ChatTour" element={<ChatTour ativaResp={ativaResp} />}/>

            </Router>
        </BrowserRouter>
    );
 };
export default Routes;

