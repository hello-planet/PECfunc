pragma solidity ^0.5.0;

import "./utils.sol";

/**
 * @title CommodityPool
 * @dev Data storage(pool) for tx(commodity) and pool settings.
 */
contract CommodityPool {
    
    using Utils for uint64;
    
    // admin address
    address payable adminAddr;
    
    // tx & pool related consts
    uint constant txIdDigits = 256;
    string[] txStatus = [ 'succeeded', 'waiting' ];
    enum TxType { solar, water, wind }
    string defaultInput = 'placeholder';
    
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
    struct Trans {
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
    // tx pool storage
    mapping(bytes32 => Trans) txPool;
    
    /*
     * events
     */
    event UpdatePool (uint maxPower, uint maxValue, uint maxAmount, uint powerUnit, uint txTTL, uint chargeFee);
    
    event WithdrawIncome (uint addminBalance);
    
    /*
     * modifiers
     */
    modifier verifyAuth () {
        require(msg.sender == adminAddr,'No authority');
        _;
    }
    
    /*
     * functions
     */
    constructor() payable public {
        adminAddr = msg.sender;
        totalNum = 0;
        poolNum = 0;
        finishNum = 0;
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
    
    // withdraw money from this admin contract
    function withdrawIncome() public verifyAuth {
        adminAddr.transfer(address(this).balance);
        emit WithdrawIncome(adminAddr.balance);
    }
}