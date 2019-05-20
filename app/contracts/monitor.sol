pragma solidity ^0.5.0;

import "./pool.sol";

/**
 * @title PoolMonitor
 * @dev Operate analysis beyond commodity pool
 */
contract PoolMonitor is CommodityPool {
    
    // admin address
    address adminAddr;
    
    // TBA
    uint currentHeight;
    bytes32 lastestTx;
    uint numOf10;
    uint numOf30;
    
    constructor() public {
        adminAddr = msg.sender;
    }
    
    function update() public {
        // update variables
    }
    
    function throughout() public returns (uint256) {
        // calculate throughout
    }
    
    
    function getLastest() public returns (address lastestTx) {
        
    }
}