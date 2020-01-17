const sha256=require('sha256');
const uuid=require('uuid/v1');

const currentNodeUrl=process.argv[3];


function Blockchain(){
    this.chain=[];
    this.pendingTransactions=[];
    this.currentNodeUrl=currentNodeUrl;
    this.networkNodes=[];
    this.createNewBlock(100,"0","0");
}

Blockchain.prototype.createNewBlock=function(nonce,previousBlockHash,hash){
    const newBlock={
        index: this.chain.length+1,
        timestamp:Date.now(),
        transactions:this.pendingTransactions,
        nonce:nonce,
        hash:hash,
        previousBlockHash:previousBlockHash
    };
    this.pendingTransactions=[];
    this.chain.push(newBlock);
    return newBlock;
}

Blockchain.prototype.getLastBlock=function()
{
    return this.chain[this.chain.length-1];
}

Blockchain.prototype.createNewTransaction=function(amount,sender,recepient)
{
    const newTransaction={
    amount:amount,
    sender:sender,
    recepient:recepient,
    transactionId:sha256(JSON.stringify({amount:amount,
        sender:sender,
        recepient:recepient}))
    };
    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions=function(transactionObj)
{
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index']+1;
}

Blockchain.prototype.blockHash=function(prevBlockHash,currentBlockData,nonce){
    stringData=prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash=sha256(stringData);
    return hash;
}

Blockchain.prototype.proofOfWork=function(previousBlockHash,currentBlockData)
{
    let nonce=0;
    let hash=this.blockHash(previousBlockHash,currentBlockData,nonce);
    while(hash.substring(0,4)!=='0000')
    {
        nonce+=1;
        hash=this.blockHash(previousBlockHash,currentBlockData,nonce);
        console.log(hash);
    }
    return nonce;
}
Blockchain.prototype.chainIsValid=function(blockchain){
let validChain=true;
for(var i=1;i<blockchain.length;i++){
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];
    console.log("prevhash=>"+prevBlock['hash']);
    console.log("currenthash=>"+currentBlock['hash']);
    const blockHash = this.blockHash(prevBlock['hash'],{ transactions:currentBlock['transactions'],index:currentBlock['index']},currentBlock['nonce']);
    if(blockHash.substring(0,4) !== '0000'){
        validChain = false;
    }
    if(currentBlock['previousBlockHash'] !== prevBlock['hash']){
        validChain = false;
    }
};
const genesisBlock = blockchain[0];
const correctNonce = genesisBlock['nonce']===100;
const correctPreviousBlockHash = genesisBlock['previousBlockHash']==='0';
const correctHash = genesisBlock['hash']==='0';
correctTransactions = genesisBlock['transactions'].length===0;
if(!correctNonce || !correctHash || !correctPreviousBlockHash || !correctTransactions){
    validChain=false;
}
return validChain
};


Blockchain.prototype.getBlock=function(blockHash)
{
    let correctBlock=null;
    this.chain.forEach(block => {
        if(block.hash===blockHash) correctBlock=block;
    });
    return correctBlock;
};

Blockchain.prototype.getTransaction=function(transactionId)
{
    let correctTransaction=null;
    let correctBlock=null;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction=>{
            if(transaction.transactionId===transactionId){
                correctTransaction = transaction;
                correctBlock = block;
            };
        });  
    });
    return {
        transaction:correctTransaction,
        block:correctBlock
    };
};

Blockchain.prototype.getAddress=function(address)
{
    const addressTransactions=[];
    this.chain.forEach(block=>{
        block.transactions.forEach(transaction=>{
            if(transaction.sender==address || transaction.recepient==address)
            {
                addressTransactions.push(transaction);
            }
        });
    });
   let balance=0;
   addressTransactions.forEach(transaction=>{
       if(transaction.recepient === address) balance += transaction.amount;
       else if(transaction.sender === address) balance -= transaction.amount;
   });
   return {
       addressTransactions:addressTransactions,
       addressBalance:balance
   };
};
module.exports=Blockchain;