// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Race.sol";

contract RaceTest is Test {
    Race public race;
    address public immutable playerA = vm.addr(0xa);
    address public immutable playerB = vm.addr(0xb);

    function setUp() public {
        vm.deal(playerA, 1 ether);
        race = new Race{value: 1 ether}();
    }

    function testDeploy() public {
        assertEq(race.gameOverDeadline(), block.timestamp + 60 days);
        assertEq(race.highScore(), 0);
        assertEq(race.blockClaimed(block.number), false);
    }

    function testClaimBlock() public {
        vm.prank(playerA);
        race.claimBlock();

        assertEq(race.highScore(), 1);
        assertEq(race.claims(playerA), 1);
        assertEq(race.blockClaimed(block.number), true);
    }

    function testClaimBlock_revertGameOver() public {
        vm.warp(block.timestamp + race.gameOverDeadline());
        vm.expectRevert();
        vm.prank(playerA);
        race.claimBlock();
    }

    function testClaimBlock_noHighScore() public {
        vm.prank(playerA);
        vm.roll(100);
        race.claimBlock();

        vm.prank(playerA);
        vm.roll(101);
        race.claimBlock();

        vm.prank(playerB);
        vm.roll(102);
        race.claimBlock();

        assertEq(race.highScore(), 2);
        assertEq(race.claims(playerA), 2);
        assertEq(race.claims(playerB), 1);
    }

    function testClaimBlock_alreadyClaimed() public {
        vm.prank(playerA);
        vm.roll(100);
        race.claimBlock();

        vm.prank(playerB);
        vm.roll(100);
        race.claimBlock();

        assertEq(race.highScore(), 1);
        assertEq(race.claims(playerA), 1);
        assertEq(race.claims(playerB), 0);
    }

    function testClaimReward() public {
        vm.prank(playerA);
        race.claimBlock();

        vm.warp(block.timestamp + race.gameOverDeadline());
        vm.prank(playerA);
        race.claimReward();

        assertEq(playerA.balance, 2 ether);
    }

    function claimReward_revertGameNotOver() public {
        vm.prank(playerA);
        race.claimBlock();

        vm.prank(playerB);
        vm.expectRevert();
        race.claimReward();
    }

    function claimReward_revertNotHighScore() public {
        vm.prank(playerA);
        race.claimBlock();

        vm.warp(block.timestamp + race.gameOverDeadline());
        vm.prank(playerB);
        vm.expectRevert();
        race.claimReward();
    }
}
