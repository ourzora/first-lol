// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/First.sol";

contract FirstTest is Test {
    First public game;
    address public immutable playerA = vm.addr(0xa);
    address public immutable playerB = vm.addr(0xb);

    function setUp() public {
        vm.deal(playerA, 1 ether);
        game = new First{value: 1 ether}();
    }

    function testDeploy() public {
        assertEq(game.gameOverDeadline(), block.timestamp + 60 days);
        assertEq(game.highScore(), 0);
        assertEq(game.blockClaimed(block.number), false);
    }

    function testClaimBlock() public {
        vm.prank(playerA);
        game.claimBlock();

        assertEq(game.highScore(), 1);
        assertEq(game.claims(playerA), 1);
        assertEq(game.blockClaimed(block.number), true);
    }

    function testClaimBlock_revertGameOver() public {
        vm.warp(block.timestamp + game.gameOverDeadline());
        vm.expectRevert();
        vm.prank(playerA);
        game.claimBlock();
    }

    function testClaimBlock_noHighScore() public {
        vm.prank(playerA);
        vm.roll(100);
        game.claimBlock();

        vm.prank(playerA);
        vm.roll(101);
        game.claimBlock();

        vm.prank(playerB);
        vm.roll(102);
        game.claimBlock();

        assertEq(game.highScore(), 2);
        assertEq(game.claims(playerA), 2);
        assertEq(game.claims(playerB), 1);
    }

    function testClaimBlock_alreadyClaimed() public {
        vm.prank(playerA);
        vm.roll(100);
        game.claimBlock();

        vm.prank(playerB);
        vm.roll(100);
        game.claimBlock();

        assertEq(game.highScore(), 1);
        assertEq(game.claims(playerA), 1);
        assertEq(game.claims(playerB), 0);
    }

    function testClaimReward() public {
        vm.prank(playerA);
        game.claimBlock();

        vm.warp(block.timestamp + game.gameOverDeadline());
        vm.prank(playerA);
        game.claimReward();

        assertEq(playerA.balance, 2 ether);
    }

    function testclaimReward_revertGameNotOver() public {
        vm.prank(playerA);
        game.claimBlock();

        vm.prank(playerB);
        vm.expectRevert();
        game.claimReward();
    }

    function testclaimReward_revertNotHighScore() public {
        vm.prank(playerA);
        game.claimBlock();

        vm.warp(block.timestamp + game.gameOverDeadline());
        vm.prank(playerB);
        vm.expectRevert();
        game.claimReward();
    }

    function testReceive() public {
        payable(address(game)).transfer(1 ether);

        // 2 eth because we send 1 eth in constructor
        assertEq(address(game).balance, 2 ether);
    }

    function testReceive_gameOver() public {
        vm.warp(block.timestamp + game.gameOverDeadline());
        vm.expectRevert();
        payable(address(game)).transfer(1 ether);
    }
}
