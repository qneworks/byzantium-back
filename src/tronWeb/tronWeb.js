
const TronWeb = require('tronweb')
const config = require('../config/config');
const utils = require('../utils/utils');


const tronWeb = new TronWeb({
    //fullHost: 'https://api.trongrid.io',
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": config.tron.apiKey },
    privateKey: config.tron.secretKey
})
tronWeb.setDefaultBlock('latest');

exports.tronTest = async () => {
    // 지갑 생성
    //let wallet = await tronWeb.createAccount();

    // 지갑 조회
    //let wallet = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);

    // 토큰 생성
    /*
    const trc_options = {
        name : "qneToken",                  //Token name, default string
        abbreviation : "QNE",               //Token name abbreviation, default string
        description : "QNE TOKEN TEST",     //Token description, default string
        url : "qneworks.com",               //Token official website url, default string
        totalSupply : 100,                  //Token total supply
        trxRatio : 1,                       // Define the price by the ratio of trx_num/num
        tokenRatio : 1,                     // Define the price by the ratio of trx_num/num
        saleStart : "1660291567233",          //ICO start time
        saleEnd : "1662876367234",            //ICO end time
        freeBandwidth : 0,                  // The creator's "donated" bandwidth for use by token holders
        freeBandwidthLimit : 0,             // Out of `totalFreeBandwidth`, the amount each token holder get
        frozenAmount : 0,                   //Token staked supply
        frozenDuration : 0,                 // for now there is no default for the following values
        precision : 6,                      //Precision of issued tokens
        permission_id : 1                   //Optional, for multi-signature use
    }
    return await tronWeb.transactionBuilder.createToken(trc_options, config.tron.adminAddr);
    */

}