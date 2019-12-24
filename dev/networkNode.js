const express = require('express')
const app = express();
const bodyparser=require('body-parser');
const Blockchain=require('./blockchain');
const uuid=require('uuid/v1');
const rp=require('request-promise');
const nodeAddress=uuid;
const bitcoin=new Blockchain();
const port=process.argv[2];

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));

// blockchain 
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

// create new transaction
app.post('/transaction', function (req, res) {
 const index=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.receipent);
 res.json({note:`this transaction will be added in block ${index}`});
});

// mine a new block
app.get('/mine', function (req, res) {
  const prevBlock=bitcoin.getLastBlock();
  const prevhash=prevBlock['hash'];
  const currentBlockData={
    transactions:bitcoin.pendingTransactions,
    index:prevBlock['index']+1
  };
  const nonce=bitcoin.proofOfWork(prevhash,currentBlockData);
  const currentHash=bitcoin.blockHash(prevhash,currentBlockData,nonce);
  bitcoin.createNewTransaction(12.5,"00",nodeAddress);
  const newBlock=bitcoin.createNewBlock(nonce,prevhash,currentHash);
  res.json({
    note:"new block mined successfully",
    block:newBlock
  });
});

// register and broadcast node on a network
app.post('/register-and-broadcast',function(req,res){
   const newNodeUrl=req.body.newNodeUrl;

   //check if new node to be added is already present or not, if not then add to network nodes
   if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1)
   bitcoin.networkNodes.push(newNodeUrl);

   const regNodesPromises=[];

   // traverse through each node url in network node 
   bitcoin.networkNodes.forEach(networkNodeUrl=>{

     // register new node with each node by sending request to each node and register new node
     const requestoptions={
      uri:networkNodeUrl+'/register-node',
      method:'POST',
      body:{ newNodeUrl:newNodeUrl},
      json:true
     };
     regNodesPromises.push(rp(requestoptions));
   });

   // if all the nodes register new node then register all nodes to the new node
  Promise.all(regNodesPromises)
  .then(data=>{
    const bulkRegisterOptions={
      uri:newNodeUrl+'/register-nodes-bulk',
      method:'POST',
      body:{allNetworkNodes:[...bitcoin.networkNodes,bitcoin.currentNodeUrl]},
      json:true
    };
    return rp(bulkRegisterOptions);
})
.then(data=>{
  res.json({note: `new node registered to network successfully`});
});
});

// register node on network
app.post('/register-node',function(req,res)
{
  const newNodeUrl=req.body.newNodeUrl;
  const nodeNotAlreadyPresent=bitcoin.networkNodes.indexOf(newNodeUrl)==-1;
  const notCurrentNode=bitcoin.currentNodeUrl!==newNodeUrl;
  if(nodeNotAlreadyPresent && notCurrentNode){
    bitcoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: 'new node registered successfully'});
});

// register nodes in bulk
app.post('/register-nodes-bulk',function(req,res)
{
  const allNetworkNodes=req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl=>
    {
      const nodeNotAlreadyPresent=bitcoin.networkNodes.indexOf(networkNodeUrl)==-1;
      const notCurrentNode=networkNodeUrl!==bitcoin.currentNodeUrl;
      if(nodeNotAlreadyPresent && notCurrentNode){
        bitcoin.networkNodes.push(networkNodeUrl);
      }
    });
  
  res.json({ note: "registration successful"});
});

app.listen(port,function()
{
    console.log(`running on port ${port}...`);
});