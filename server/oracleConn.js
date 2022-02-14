var oracle = require('oracledb');

oracle.initOracleClient({libDir: "C:/Program Files/instantclient_21_3"});
var connOracle = async function(){
    return await oracle.getConnection({
    user : 'treinamento07',
    password: 'treinamento07',
    connectString: '192.168.20.239:1521/DESENVV4.kunden.local'
})
console.log('conexão estabelecida');
}

module.exports = async function(){
    console.log('Módulo de conexão com o db foi carregado')
    return await connOracle();
}