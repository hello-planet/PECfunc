pragma solidity ^0.5.0;

import "./pool.sol";

/**
 * @title CommodityOperator
 * @dev Operations beyond tx
 */
contract CommodityOperator is CommodityPool {
    
    // tx to seller storage 
    mapping(bytes32 => address) txToSeller;
    
    /*
     * events
     */
    event NewTx (bytes32 txId);
    event TxSold (bytes32 txId);
    event TxRevoked (bytes32 txId);
    event TxDeleted (bytes32[] txIds);
    event TxExpired (bytes32 txId);
    
    /*
     * modifiers
     */
    // check seller's charge fee
    modifier checkCharge() {
        require(msg.value >= chargeFee, "Insufficient charge fee");
        _;
    }
    
    // check the variable legality of tx
    modifier validTx (uint _timestampExpire, uint _power, uint _value, uint _amount) {
        require(_power < maxPower && _value < maxValue && _amount < maxAmount, 'Invalid tx parameters');
        _;
    }
    
    // check buyer's balance sufficiency
    modifier checkBalance (bytes32 _txId) {
        require(msg.sender.balance > txPool[_txId].value, 'Insufficient balance');
        require(msg.value == txPool[_txId].value * 10 ** 18, 'Illegal transaction fee.');
        _;
    }
    
    // check the ownership of the tx
    modifier checkSeller (bytes32 _txId) {
        require(msg.sender == txToSeller[_txId], 'No authority to manage specific tx');
        _;
    }
    
    /*
     * functions
     */
     constructor() payable public {
         
    }
     
    // to deliver a new tx
    function deliverTx(string memory _account,uint64 _timestampGen, uint64 _timestampExpire, uint8 _power, uint8 _value, uint8 _amount, string memory _powerType, string memory _inputData) payable public checkCharge validTx(_timestampExpire, _power, _value, _amount) returns(bytes32 txId) {
        txId= sha256(abi.encodePacked(_account,_timestampGen.uintToAscii()));
        Trans storage tx = txPool[txId];
        tx.status = 1;
        tx.timestampSell = uint64(now);
        tx.timestampExpire = _timestampExpire;
        tx.power = _power;
        tx.value = _value;
        tx.amount = _amount;
        tx.powerType = _powerType;
        tx.seller = msg.sender;
        tx.inputData = _inputData;
        txToSeller[txId] = msg.sender;
        totalNum ++;
        poolNum ++;
        emit NewTx(txId);
    }
    
    function demandTx() public {
        
    }
    
    function addTx() private {
        
    }
    
    // to purchase an existing tx
    function purchaseTx(bytes32 _txId) public payable checkBalance(_txId){
        Trans storage tx = txPool[_txId];
        tx.status = 0;
        tx.timestampBuy = uint64(now);     
        tx.buyer = msg.sender;
        tx.seller.transfer(msg.value);
        poolNum --;
        finishNum ++;
        emit TxSold(_txId);
    }
    
    function sellTx() public {
        
    }
    
    function confirmTx() private {
        
    }
    
    // to revoke a delivered tx
    function revokeTx(bytes32 _txId) payable public checkSeller(_txId){
        if ( txPool[_txId].status == 1) {
            delete txPool[_txId];
            delete txToSeller[_txId];
            poolNum --;
            emit TxRevoked(_txId);
        }
    }
    
    function expireTx(bytes32 _txId) public verifyAuth{
        poolNum -= txPool[_txId].status;
        delete txPool[_txId];
        delete txToSeller[_txId];
        emit TxExpired(_txId);
    }
    
    // remove txs from the pool
    function removeTx(bytes32[] memory _txIds) public verifyAuth{
        for (uint i=0; i < _txIds.length; i ++){
            poolNum -= txPool[_txIds[i]].status;
            delete txPool[_txIds[i]];
            delete txToSeller[_txIds[i]];
        }
        emit TxDeleted(_txIds);
    }
    
    // fetch an exising tx info from pool
    function getTx(bytes32 _txId) public view returns (
        string memory _status,
        uint _timestampSell,
        uint _timestampBuy,
        uint _timestampExpire,
        uint _power,
        uint _value,
        uint _amount,
        string memory _powerType,
        address _seller,
        address _buyer,
        string memory _inputData
    ){
        Trans memory tx = txPool[_txId];
        require(tx.seller != address(0),'No such tx.');
        _status = txStatus[tx.status];
        _timestampSell = tx.timestampSell;
        _timestampBuy = tx.timestampBuy;
        _timestampExpire = tx.timestampExpire;
        _power = tx.power;
        _value = tx.value;
        _amount = tx.amount;
        _powerType = tx.powerType;
        _seller = tx.seller;
        _buyer = tx.buyer;
        _inputData = tx.inputData;
    }
}