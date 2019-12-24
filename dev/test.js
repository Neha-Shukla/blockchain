const Blockchain=require('./blockchain');
const bitcoin = new Blockchain();
// bitcoin.createNewBlock(100,'asdfsdggd','sfsdgdsf');
// bitcoin.createNewTransaction(1000,'NEHAJFHSGJIJFH','MOSHDFGDJHKJFKH');
// bitcoin.createNewBlock(101,'asdfsdggd','sfsdgdsf');
// bitcoin.createNewTransaction(100,'NEHAJFHSGJIJFH','MOSHDFGDJHKJFKH');
// bitcoin.createNewTransaction(130,'NEHAJFHSGJIJFH','MOSHDFGDJHKJFKH');
// bitcoin.createNewTransaction(500,'NEHAJFHSGJIJFH','MOSHDFGDJHKJFKH');

bitcoin.createNewBlock(107,'asdfsdggd','sfsdgdsf');
const lastHash='FGDKHJKFNHFH';
const currentBlockData=[
    {
        amount:100,
        sender:'HKFHGIEUWDR',
        receipent:'MUSHJGFHJSAGF'
    },
    {
        amount:1023,
        sender:'NEHAHKFHGIEUWDR',
        receipent:'MUSUHJGFHJSAGF'
    }
];
// console.log(bitcoin.blockHash(lastHash,currentBlockData,1));
// console.log(bitcoin.blockHash(lastHash,currentBlockData,2));
// console.log(bitcoin.createNewBlock(3,'ifiahfjnajfqioawh','fsikusdauikbeaf'));
// console.log(bitcoin.proofOfWork(lastHash,currentBlockData));
console.log(bitcoin);
console.log(bitcoin.getLastBlock.index);