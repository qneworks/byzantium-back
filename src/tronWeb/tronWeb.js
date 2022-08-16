
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


exports.isConnect = async () => {
    /*
    console.log(await tronWeb.isConnected());

    const isAccount = tronWeb.isAddress(config.tron.adminAddr);
    console.log('isAccount = ' + isAccount)
    
    
    const balance = await tronWeb.trx.getBalance(config.tron.adminAddr);
    console.log(balance)



    
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
    const asset = await tronWeb.transactionBuilder.createAsset(trc_options, config.tron.adminAddr);
    
    console.dir(asset);
    */

    //const sendTransaction = await tronWeb.transactionBuilder.sendTrx('TTCn7Brdc41eGEPxUAN9NvmymRad5tTeR5', 1, 'TXiqxciyLf4jAJuEVjZ5n2scHo2PzoCudD');
    //console.log(sendTransaction);
    return null
}

exports.createAccount = async () => {
    /*
    let result = await tronWeb.createAccount();
    delete result.privateKey;
    return result;
    return await tronWeb.createAccount();
    */
    return await tronWeb.createAccount();
}

exports.createToken = async () => {
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
    return null
}

exports.getAccount = async () => {
    /*
    tronWeb.setAddress(config.tron.adminAddr);

    console.log(tronWeb.defaultAddress.base58);

    console.log(tronWeb.isAddress(tronWeb.defaultAddress.base58))
    let account = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);
    console.log(account)
    return account;
    */
   return null
}