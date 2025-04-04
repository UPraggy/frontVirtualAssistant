import '../assets/css/colors.css'
import '../assets/css/Principais.css'
import '../assets/css/fonts.css'
import '../assets/css/chatTour.css'
import '../assets/css/chatTourCard.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import QuestChatTour from './QuestChatTour'
import { ModeloPerguntas } from './funcionalidades/bancoGet'

const socket = new WebSocket('ws://localhost:3005'); // Substitua pela URL do seu backend

socket.onopen = () => {
  console.log('Conectado ao servidor WebSocket');
};


const AssistantMessage = ({message, ativaResp, setCardExamples}) => {

    const [showSpaceInfo, setShowSpaceInfo] = useState(false)

    //console.log(JSON.parse(message).listaFilteredSpaces)
    let listaDeSpaces = JSON.parse(message)
    console.log(listaDeSpaces)
    if(listaDeSpaces.listaFilteredSpaces){

        if(listaDeSpaces.listaFilteredSpaces.length === 0) {
            Swal.fire({
                title: "Nada Encontrado",
                icon: "warning", // Alerta (não "alert", que não é um ícone válido)
                confirmButtonText: "Prosseguir",
                cancelButtonText: "Ver dicas de perguntas.",
                showCancelButton: true,
                showCloseButton: true
              }).then((result) => {
                if (result.isDismissed) {
                  // O usuário clicou no botão Cancelar (ou fechou a caixa)
                  setCardExamples(true);
                } else if (result.isConfirmed) {
                  // O usuário clicou no botão Confirmar (Prosseguir)
                  console.log("Prosseguir clicado");
                }
              });
            return;
        }

        return listaDeSpaces.listaFilteredSpaces.map((space, index) => {
            let horario = space[1].horario
            

            return <div className={`chatPopUp assistantMessage cardSpaceLista ${showSpaceInfo === index ?'cardSpaceListaAtivo':''}`} 
            onClick={()=>{showSpaceInfo === index ?  setShowSpaceInfo(false) : setShowSpaceInfo(index)}}
            key={Math.floor(Math.random() * 90000) + 10000}>

                {showSpaceInfo === index ? 
                <div className="cardSpace">
                    <div className="cardSpaceImg" 
                        style={{background: `url('${require('../assets/imgs/museus/'+space[1].img)}') no-repeat center/cover`}}> </div>
                    <div className="cardSpaceInfo">
                        <div className="cardSpaceNome">{space[0]}</div>
                        <div className="cardSpaceEndereco">{space[1].endereco}</div>
                        <div className="cardSpaceHorario">{horario.length === 0 ? "Informação não disponível" : horario.map((item, _) => {

                                if(item.diaInicio === item.diaFinal){
                                    return <>
                                    {`${item.diaInicio},`}&nbsp;
                                    {`${item.inicio.split('h')[1] == '' ? item.inicio : item.inicio+"h00"} até 
                                    ${item.fim.split('h')[1] ? item.fim : item.fim}`} <br />
                                    </>
                                }else{
                                    return <>
                                    {`De ${item.diaInicio} a ${item.diaFinal},`}&nbsp;
                                    {`de ${item.inicio.split('h')[1] == '' ? item.inicio : item.inicio+"h00"} até 
                                    ${item.fim.split('h')[1] ? item.fim : item.fim}`} <br />
                                    </>
                                }
                                })}</div>

                        {space[1].endereco.moreInfo ? <div className="cardSpaceMoreInfo">
                            <div className="iconMoreInfo"></div>
                            <div className="text">Mais Informações</div>
                            </div> : <></>}

                        <div className="infoPrice">
                            <div className="cardSpaceTel">{space[1].telefone}</div>
                            <div className="cardSpacePreco">{space[1].preco}</div>
                        </div>
                    </div>
                </div> : <div className="cardSpaceNome">{space[0]}</div>}
            </div>
            
        })
    }else{
        return <div className="chatPopUp assistantMessage">{message}</div>
    }
}

// Função para enviar mensagens com diferentes tipos de ação
function sendMessageWebSocket(tipo, dados) {
  const mensagem = {
    action: tipo,  // Define o tipo de ação (ex: 'resposta', 'novo_conhecimento', etc.)
    data: dados    // Dados necessários para a ação
  };

  socket.send(JSON.stringify(mensagem));
}

async function sendMessage({conversation, setConversation, message, type}){
    await setConversation([...conversation, {message, type}])
    if(type === 'user'){
        await sendMessageWebSocket('question', message)
    }
}

export default function ChatTour({ativaResp}){

    const navigate = useNavigate();

    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')
    const [modeloPerguntas, setModeloPerguntas] = useState([])
    const [cardExamples, setCardExamples] = useState(false)
    
    function scrollToBottom (){
        let messageContainer = document.getElementsByClassName('chatbox')[0];
        if (messageContainer) {
        // Rola para o fundo do contêiner
        messageContainer.scrollTo(0, messageContainer.scrollHeight);
        }
      };
    
      useEffect(() => {
        scrollToBottom();
      }, [conversation]);

      useEffect(()=>{
        ModeloPerguntas()
            .then((resp)=>{
                //console.log(resp)
                setModeloPerguntas(resp)
            })
      },[])
      

    socket.onmessage = async (event) => {
        const data = await JSON.parse(event.data);
        await console.log('Mensagem recebida:', data);

        if( JSON.parse(data.data)["NADAENCONTRADO"]){
            Swal.fire({
                title: "Nada Encontrado 😢, tente outra pergunta ou reveja nossas opções 😊.",
                icon: "warning", // Alerta (não "alert", que não é um ícone válido)
                confirmButtonText: "Prosseguir",
                cancelButtonText: "Ver dicas de perguntas.",
                showCancelButton: true,
                showCloseButton: true
              }).then((result) => {
                if (result.isDismissed) {
                  // O usuário clicou no botão Cancelar (ou fechou a caixa)
                  setCardExamples(true);
                } else if (result.isConfirmed) {
                  // O usuário clicou no botão Confirmar (Prosseguir)
                  console.log("Prosseguir clicado");
                }
              });
              return ;
        }
        
          
        switch (data.action) {
          case await 'responseQuestion':
            //await console.log('Resposta do backend:', data.data);
            await sendMessage({conversation, setConversation, message: data.data, type: 'assitant'})
        }
    };
      


    return <>
        <div className="containerPrincipal chatTour" style={{/*minHeight: "100vh", maxHeight: windowHeight*1,*/ backgroundColor: "#322E2E", display: 'flex',
    flexDirection: 'column'/*, overflowY: "hidden"*/}}>

        <div className="chatContent">
            <div className="questBtn" onClick={()=>setCardExamples(!cardExamples)}></div>

            <div className="top">
                <div className="topLogo"></div>
                <div className="topTitle">BH Tour Assistant</div>
            </div>

            <div className="centerPage">
                {cardExamples ? <QuestChatTour modeloPerguntas={modeloPerguntas}  
                setMessage={async (val)=>{
                    await setCardExamples(false)
                    await sendMessage({conversation, setConversation, message: val, type: 'user'})
                    await setMessage('');
                    }}/> : <></>}

                <div className="chatbox">
                    {conversation.map((item, index) => {
                        if(item.type === 'user'){
                            return <div className="chatPopUp userMessage" key={index}>{item.message}</div>
                        }else{
                            return <AssistantMessage key={index} message={item.message} 
                                            ativaResp={ativaResp} setCardExamples={val => setCardExamples(val)}/>                            
                        } //Branca de Neve
                    })}
                </div>
                    
                <div className="sendBox">
                    <input type="text" className="userInput" placeholder="Digite sua pergunta..." 
                    onChange={(event) => setMessage(event.target.value)} 
                    onKeyPress={async (event) => {
                        if (event.key === 'Enter') {
                            await sendMessage({ conversation, setConversation, message, type: 'user' });
                            await setMessage('');
                            await event.target.blur();
                        }
                    }}
                    value={message}/>

                    <div className="arrow-component" onClick={async ()=>{
                        await sendMessage({conversation, setConversation, message, type: 'user'})
                        await setMessage('');
                        }}>
                        <svg width="24" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                            <path d="M15 4H4V1" stroke="white"/>
                            <path d="M14.5 4H3.5H0" stroke="white"/>
                            <path d="M15.8536 4.35355C16.0488 4.15829 16.0488 3.84171 15.8536 3.64645L12.6716 0.464466C12.4763 0.269204 12.1597 0.269204 11.9645 0.464466C11.7692 0.659728 11.7692 0.976311 11.9645 1.17157L14.7929 4L11.9645 6.82843C11.7692 7.02369 11.7692 7.34027 11.9645 7.53553C12.1597 7.7308 12.4763 7.7308 12.6716 7.53553L15.8536 4.35355ZM15 4.5L15.5 4.5L15.5 3.5L15 3.5L15 4.5Z" fill="white"/>
                        </svg>
                        </div>

                </div>

            </div>
        </div>
        
        </div>

    </>
}