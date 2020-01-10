const sha256=require('sha256');
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
    receipent:recepient
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
module.exports=Blockchain;