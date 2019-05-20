pragma solidity ^0.5.0;

/**
 * @title Utils
 * @dev Utils for essential data operation
 */
library Utils {
    
    function uintToAscii(uint _self) public pure returns (string memory) {
        bytes memory b = new bytes(32);
        uint i;
        for(i = 0; _self > 0; i++) {
            b[i] = bytes1(uint8((_self % 10) + 0x30));
            _self /= 10;
        }
        bytes memory r = new bytes(i--);
        for(uint j = 0; j < r.length; j++) {
            r[j] = b[i--];
        }
        return string(r);
    }
    
}
