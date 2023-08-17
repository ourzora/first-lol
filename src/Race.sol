// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Race {
    mapping(uint256 => bool) public blockClaimed;
    mapping(address => uint256) public claims;
    uint256 public immutable gameOverDeadline;
    uint256 public highScore;

    event Claimed(address indexed claimer, uint256 claims);

    constructor() payable {
        gameOverDeadline = block.timestamp + 60 days;
    }

    function claimBlock() public {
        require(block.timestamp < gameOverDeadline, "Game over");

        if (!blockClaimed[block.number]) {
            blockClaimed[block.number] = true;
            claims[msg.sender] += 1;

            emit Claimed(msg.sender, claims[msg.sender]);
        }

        if (claims[msg.sender] > highScore) {
            highScore = claims[msg.sender];
        }
    }

    function claimReward() public {
        require(block.timestamp >= gameOverDeadline, "Game not over");
        require(claims[msg.sender] == highScore, "Not highest score");

        payable(msg.sender).transfer(address(this).balance);
    }
}
