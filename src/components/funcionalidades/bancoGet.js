import fetchFunc from './fetchFunc.js'
//Usado para armazenar todas as rotas do BackEnd
export const ModeloPerguntas = ()=>fetchFunc.fetchGet('/ModeloPerguntas',{})

const db = {
    ModeloPerguntas,
}

export default db;


