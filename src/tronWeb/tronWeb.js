
const TronWeb = require('tronweb')
const config = require('../config/config');


const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": config.tron.apiKey },
    privateKey: config.tron.secretKey
})

exports.createAccount = async () => {
    /*
    let result = await tronWeb.createAccount();
    delete result.privateKey;
    return result;
    */
    return await tronWeb.createAccount();
}

exports.createToken = async () => {
    const trc_options = {
        name : "qneToken",//Token name, default string
        abbreviation : "QNE",//Token name abbreviation, default string
        description : "QNE TOKEN TEST",//Token description, default string
        url : "qneworks.com",//Token official website url, default string
        totalSupply : 100000,//Token total supply
        trxRatio : 1, // Define the price by the ratio of trx_num/num
        tokenRatio : 1, // Define the price by the ratio of trx_num/num
        saleStart : 1660192362518,//ICO start time
        saleEnd : 1691814800022,//ICO end time
        freeBandwidth : 0, // The creator's "donated" bandwidth for use by token holders
        freeBandwidthLimit : 0, // Out of `totalFreeBandwidth`, the amount each token holder get
        frozenAmount : 0, //Token staked supply
        frozenDuration : 0, // for now there is no default for the following values
        precision : 6,//Precision of issued tokens
        permission_id : 1//Optional, for multi-signature use
    }
    return await tronWeb.createAccount();
}