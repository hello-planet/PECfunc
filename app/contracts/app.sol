pragma solidity ^0.5.0;

import "./monitor.sol";
import "./manager.sol";
import "./erc721.sol";

/**
 * @title CommodityApp
 * @dev The whole platform of digital commodity application
 */
contract CommodityApp is PoolMonitor, AccountManager, ERC721 {
    
    mapping (bytes32 => address) txApprovals;
    
    // check the ownership of the tx
    modifier checkBuyer (bytes32 _txId) {
        require(msg.sender == txApprovals[_txId], 'Not aimed user for this specific tx');
        _;
    }
    
    function balanceOf(address _usrAcc) public view returns (uint _balance) {
        _balance = usrAccounts[_usrAcc].balance;
    }
    
    function ownerOf(bytes32 _txId) public view returns (address _owner) {
        _owner = txPool[_txId].buyer;
    }
    
    function transfer(address payable _buyer, bytes32 _txId) public {
        // Not used here.
    }
    
    function approve(address payable _buyer, bytes32 _txId) public checkSeller(_txId) {
        txApprovals[_txId] = _buyer;
    }
    
    function takeOwnership(bytes32 _txId) public checkBuyer(_txId){
        purchaseTx(_txId);
    }
}