// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import './Escrow.sol';

contract EscrowFactory {
	address[] private escrows;
	event Deployed(address indexed);

	function getEscrows() external view returns(address[] memory){
		return escrows;
	}

	function publish(address arbiter, address beneficiary) external payable {
		Escrow escrow = (new Escrow){value: msg.value}(arbiter, beneficiary);
		address addr = address(escrow);
		escrows.push(addr);
		emit Deployed(addr);
	}
}
