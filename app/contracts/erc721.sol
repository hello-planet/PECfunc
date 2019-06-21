pragma solidity ^0.5.0;

contract ERC721 {
    
  event Transfer(address indexed _from, address indexed _to, uint _tokenId);
  
  event Approval(address indexed _owner, address indexed _approved, uint _tokenId);

  function balanceOf(address _owner) public view returns (uint _balance);

  function ownerOf(bytes32 _tokenId) public view returns (address _owner);

  function transfer(bytes32 _tokenId) public;

  function approve(address payable _to, bytes32 _tokenId) public;

  function takeOwnership(bytes32 _tokenId) public;
}