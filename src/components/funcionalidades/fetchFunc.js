import GlobalVars from '../subComponents/GlobalVar.jsx'

function fetchGet (url){
    return new Promise((resolve, reject)=>{
        resolve(fetch(`${GlobalVars.serverIp}${GlobalVars.serverPort}${url}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }})
            .then(resp =>  resp.json())
            .catch(resp => {return {"ERROR SERVER": resp}})
            )
    })
}

function fetchPost (url, body){
    return new Promise((resolve, reject)=>{
        resolve(fetch(`${GlobalVars.serverIp}${GlobalVars.serverPort}${url}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(body)
            })
            .then(resp => resp.json())
            .catch(resp => {return {"ERROR SERVER": resp}})
            )
    })
}

const fetchFunc = {
    fetchPost,
    fetchGet
}

export default fetchFunc;