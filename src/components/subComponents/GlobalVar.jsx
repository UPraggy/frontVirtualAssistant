import CryptoJS from 'crypto-js'; // encriptacao de dado

export default class GlobalVar{ //Variaveis Globais
  static serverIp = 'http://192.168.15.78'
  static serverPort = ':3005' 

  static getLocalStorage(chave){
    let valor = sessionStorage.getItem(chave)
    return valor !== "undefined" && valor ? JSON.parse(valor) : null
  }

  static setLocalStorage(chave, valor){
    return sessionStorage.setItem(chave,JSON.stringify(valor));
  }

  static converterDataISOParaFormatoBR(dataISO) {
    const meses = [
      'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
      'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];
    const data = new Date(dataISO);
    const dia = data.getUTCDate();
    const mes = meses[data.getUTCMonth()];
    const ano = data.getUTCFullYear();
    return `${dia.toString().padStart(2, '0')} ${mes} ${ano}`;
  }

  static converterDataDMA(dataISO) {
    let data = new Date(dataISO);
    let dia = data.getUTCDate();
    let mes = data.getUTCMonth() + 1; // Os meses começam do 0, então adicionamos 1.
    let ano = data.getUTCFullYear();

    // Adiciona um zero à esquerda se o dia ou o mês for menor que 10.
    if(dia < 10) dia = '0' + dia;
    if(mes < 10) mes = '0' + mes;

    return `${dia}/${mes}/${ano}`;
  }

  static converterDataAMD(dataISO) {
    let data = new Date(dataISO);
    data = data.toISOString().split('T')[0];
    return data;
  }

  static formatarHora(data) {
    function adicionarZero(numero) {
        return numero < 10 ? '0' + numero : numero;
    }

    var horas = adicionarZero(data.getHours());
    var minutos = adicionarZero(data.getMinutes());
    var segundos = adicionarZero(data.getSeconds());

    return horas + ':' + minutos + ':' + segundos;
  }


  static converteFloat = (valor) => {
    return parseFloat(valor).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  static desconverterFloat = (valor) => {
    var valorSemFormatacao = valor.replace('.', '').replace(',', '.');
    return parseFloat(valorSemFormatacao);
  }

  static decriptaDado(dado){
    return CryptoJS.AES.decrypt(dado, 'T_cB@b0918Revend').toString(CryptoJS.enc.Utf8)
  }

  static capitalize(str) {
    return str.split(' ').map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  static primeiroDiaMes(){
    let hoje = new Date(); // Obtém a data atual
    let primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Formata a data para o formato 'YYYY-MM-DD'
    let primeiroDiaFormatado = primeiroDiaDoMes.toISOString().split('T')[0];
    return primeiroDiaFormatado;
  }
}

