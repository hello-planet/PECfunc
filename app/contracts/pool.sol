pragma solidity ^0.5.0;

import "./utils.sol";

/**
 * @title CommodityPool
 * @dev Data storage(pool) for tx(commodity)
 */
contract CommodityPool {
    using Utils for uint;
    
    // admin address
    address payable adminAddr;
    
    // tx & pool related consts
    uint constant txIdDigits = 256;
    string[] txStatus = [ 'succeeded', 'waiting' ];
    enum TxType { solar, water, wind }
    string defaultInput = 'placehold';
    
    // tx & pool related vars with defaults
    uint maxPower = 100;
    uint maxValue = 100;
    uint maxAmount = 100;
    uint powerUnit = 1;
    uint txTTL = 1 weeks;
    // 10^15 wei
    uint chargeFee = 0.001 ether;
    uint totalNum;
    uint poolNum;
    uint finishNum;
    
    // tx and pool
    struct Trans{
        uint8 status;
        uint64 timestampSell;
        uint64 timestampBuy;
        uint64 timestampExpire;
        uint8 power;
        uint8 value;
        uint8 amount;
        string powerType;
        address payable seller;
        address payable buyer;
        string inputData;
    }
    mapping(bytes32 => Trans) txPool;
    mapping(bytes32 => address) txToSeller;
    
    /*
     * events
     */
    event NewTx (bytes32 txId);
    event BuyTx (bytes32 txId);
    event RevokeTx (bytes32 txId);
    event DelTx (bytes32[] txIds);
    event ExpireTx (bytes32 txId);
    event UpdatePool (uint maxPower, uint maxValue, uint maxAmount, uint powerUnit, uint txTTL, uint chargeFee);
    
    /*
     * modifiers
     */
    modifier verifyAuth () {
        require(msg.sender == adminAddr,'No authority');
        _;
    }
    
    // check seller's charge fee
    modifier checkCharge() {
        require(msg.value == chargeFee);
        _;
    }
    
    // check the variable legality of tx
    modifier validTx (uint _timestampExpire, uint _power, uint _value, uint _amount) {
        require( (now + 1 weeks) > _timestampExpire && _power < maxPower && _value < maxValue && _amount < maxAmount, 'Invalid tx parameters');
        _;
    }
    
    // check buyer's balance sufficiency
    modifier checkBalance (bytes32 _txId) {
        require(msg.sender.balance > txPool[_txId].value, 'Insufficient balance');
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
    constructor(uint _powerUnit) public {
        adminAddr = msg.sender;
        totalNum = 0;
        poolNum = 0;
        finishNum = 0;
        powerUnit = _powerUnit;
    }
    
    // to deliver a new tx
    function deliverTx(string memory _account, uint64 _timestampExpire, uint8 _power, uint8 _value, uint8 _amount, string memory _powerType, string memory _inputData) payable public checkCharge validTx(_timestampExpire, _power, _value, _amount) {
        uint time = now;
        bytes32 txId= sha256(abi.encodePacked(_account,time.uintToAscii()));
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
    
    // to purchase an existing tx
    function purchaseTx(bytes32 _txId) public checkBalance(_txId){
        Trans storage tx = txPool[_txId];
        tx.status = 0;
        tx.timestampBuy = uint64(now);     
        tx.buyer = msg.sender;
        tx.seller.transfer(tx.amount);
        poolNum --;
        finishNum ++;
        emit BuyTx(_txId);
    }
    
    // to revoke a delivered tx
    function revokeTx(bytes32 _txId) payable public checkSeller(_txId){
        if ( txPool[_txId].status == 1) {
            delete txPool[_txId];
            delete txToSeller[_txId];
            poolNum --;
            emit RevokeTx(_txId);
        }
    }
    
    function expireTx(bytes32 _txId) public verifyAuth{
        poolNum -= txPool[_txId].status;
        delete txPool[_txId];
        delete txToSeller[_txId];
        emit ExpireTx(_txId);
    }
    
    // remove txs from the pool
    function removeTx(bytes32[] memory _txIds) public verifyAuth{
        for (uint i=0; i < _txIds.length; i ++){
            poolNum -= txPool[_txIds[i]].status;
            delete txPool[_txIds[i]];
            delete txToSeller[_txIds[i]];
        }
        emit DelTx(_txIds);
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
        Trans storage tx = txPool[_txId];
        require(tx.seller != address(0));
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
    
    // to update the values of pool settings
    function updatePoolSetting(uint _maxPower, uint _maxValue, uint _maxAmount, uint _powerUnit, uint _txTTL, uint _chargeFee) public verifyAuth{
        maxPower = _maxPower;
        maxValue= _maxValue;
        maxAmount = _maxAmount;
        powerUnit = _powerUnit;
        txTTL = _txTTL;
        chargeFee = _chargeFee;
        emit UpdatePool (maxPower, maxValue, maxAmount, powerUnit, txTTL, chargeFee);
    }
    
    // withdraw money from this contract
    function withdrawIncome() public verifyAuth {
        adminAddr.transfer(address(this).balance);
    }
}