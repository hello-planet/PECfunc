pragma solidity ^0.5.0;
/*
 * compiler 0.5.2+commit.1df8f40c.Emscripten.clang
 */

import "./operator.sol";
import "./manager.sol";
import "./erc721.sol";

/**
 * @title CommodityApp
 * @dev The whole platform of digital commodity application
 */
contract CommodityApp is CommodityOperator, AccountManager, ERC721 {
    
    // bid address. here same as admin address temprorily
    address payable bidaddress;
    
    // for each buyer's proposal
    struct oneBid {
        address payable bidder;
        uint8 competePrice;
    }
    // for certain tx's proposals
    struct Bid {
        mapping (uint8 => oneBid) indexToBid;
        address payable winner;
        uint8 highestPrice;
        bool terminated;
        uint8 bidlength;
    }
    // for all tx in the auction
    mapping (bytes32 => Bid) txToBid;
    
    // for all the sellers' proposals
    mapping (bytes32 => address) txApprovals;
    
    /*
     * events
     */
    event NewBid (bytes32 _txId, address payable _bidder, uint8 _competePrice);
    event Terminate (bytes32 _txId);
    event Approve(bytes32 _txId);
    
    // check the ownership of the tx
    modifier checkBuyer (bytes32 _txId) {
        require(msg.sender == txApprovals[_txId], 'Not aimed user for this specific tx');
        _;
    }
    
    /*
     * functions
     */
    constructor() payable public {
        bidaddress = msg.sender;
    }
    
    // fetch certain user's balance
    function balanceOf(address _usrAcc) public view returns (uint _balance) {
        _balance = usrAccounts[_usrAcc].balance;
    }
    
    // fetch certain tx's buyer
    function ownerOf(bytes32 _txId) public view returns (address _owner) {
        _owner = txPool[_txId].buyer;
    }
    
    /*
     * stage I:   buyers bid for certain unpurchased tx
     * stage II:  seller terminate the auction
     * stage III: admin assist transfering the tx and refund
     */
    // for buyers to bid for tx
    function bid(bytes32 _txId, uint8 _competePrice ) public payable checkBalance(_txId) {
        if( txPool[_txId].buyer == address(0) ){
            Bid storage bid = txToBid[_txId];
            if ( !bid.terminated && _competePrice > bid.highestPrice ) {
                bid.winner = msg.sender;
                bid.highestPrice = _competePrice;
                uint8 index = ++bid.bidlength;
                bid.indexToBid[index].bidder = msg.sender;
                bid.indexToBid[index].competePrice = _competePrice;
                bidaddress.transfer(_competePrice);
                emit NewBid(_txId, msg.sender, _competePrice); 
            }
        }
    }
    
    // for seller to authorize the bid
    function terminateBid(bytes32 _txId) public checkSeller(_txId) {
        txToBid[_txId].terminated = true;
        emit Terminate(_txId);
    }
    
    // inherited from erc721
    // for admin to enforce the bid
    function transfer(bytes32 _txId) public verifyAuth {
        Bid storage bid = txToBid[_txId];
        // iterate the mapping and return money
        for(uint8 i =1; i < ( bid.bidlength -1 ); i++) {
            bid.indexToBid[i].bidder.transfer(bid.indexToBid[i].competePrice); 
        }
        Trans storage tx = txPool[_txId];
        tx.status = 0;
        tx.timestampBuy = uint64(now);
        tx.buyer = bid.winner;
        tx.seller.transfer(tx.amount);
        delete txToBid[_txId];
        poolNum --;
        finishNum ++;
        emit TxSold(_txId);
    } 
    
    /*
     * stage I:  seller approve certain tx to buyer
     * stage II: buyer purchase the specific tx
     */
    // for seller to approve certain buyer's privilige beyond aimed tx
    function approve(address payable _buyer, bytes32 _txId) public checkSeller(_txId) {
        txApprovals[_txId] = _buyer;
        emit Approve(_txId);
    }
    
    // for buyer to purchased the corresponding tx
    function takeOwnership(bytes32 _txId) public checkBuyer(_txId){
        purchaseTx(_txId);
    }
}