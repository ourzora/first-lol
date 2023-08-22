// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {First} from "../src/First.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PK");
        vm.startBroadcast(deployerPrivateKey);

        First game = new First{value: 9990000000000000000}();
        console.log("Deployed First to %s", address(game));
        vm.stopBroadcast();
    }
}
