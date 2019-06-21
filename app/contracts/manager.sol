pragma solidity ^0.5.0;

/**
 * @title AccountManager
 * @dev Control usr accounts
 */
contract AccountManager {
    
    address payable adminAddr;
    
    uint maxBalance;
    
    struct Account {
        uint balance;
        bool broke;
        uint overdraw;
        uint commodity;
    }
    mapping(address => Account) usrAccounts;
    
    constructor() public {
        adminAddr = msg.sender;
    }
    /*
     * events
     */
    event NewUser(address usrAcc);
    event Deposit(address usrAcc, uint amount);
    event Withdraw(address usrAcc, uint amount);
    event Broke(address usrAcc, uint amount);
    event Load(address usrAcc, uint amount);
    event Unload(address usrAcc, uint amount);
    // event OutofStack(address usrAcc);
     
    /*
     * modifiers
     */
    modifier verifyAuth () {
        require(msg.sender == adminAddr,'No authority');
        _;
    }
    
    modifier notBroke (address _usrAcc, uint _amount) {
        require(usrAccounts[_usrAcc].broke);
        _;
    }
    
    /*
     * functions
     */
    function newUser(address _usrAcc) public verifyAuth {
        Account storage usr = usrAccounts[_usrAcc];
        usr.balance = 0;
        usr.broke = false;
        emit NewUser(_usrAcc);
    }
    
    function deposit(address _usrAcc, uint _amount) public verifyAuth {
        usrAccounts[_usrAcc].balance += _amount;
        emit Deposit(_usrAcc, _amount);
    }
     
    function withdraw(address _usrAcc, uint _amount) public verifyAuth notBroke(_usrAcc, _amount) {
        if(usrAccounts[_usrAcc].balance > _amount){
            usrAccounts[_usrAcc].balance -= _amount;
            emit Withdraw(_usrAcc, _amount);
        }else{
            usrAccounts[_usrAcc].balance = _amount - usrAccounts[_usrAcc].balance;
            usrAccounts[_usrAcc].broke = true;
            emit Broke(_usrAcc, usrAccounts[_usrAcc].balance);
        }
    }
    
    function load(address _usrAcc, uint _amount) public verifyAuth {
        usrAccounts[_usrAcc].commodity += _amount;
        emit Load(_usrAcc, _amount);
    }
    
    function unload(address _usrAcc, uint _amount) public verifyAuth {
        require(usrAccounts[_usrAcc].commodity > _amount);
        usrAccounts[_usrAcc].commodity -= _amount;
        emit Unload(_usrAcc, _amount);
    }
}