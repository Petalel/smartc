import web3 from './web3';  //0xc69333432F292DAbD0B0E572625bAe5A734EbE9b
    
const address = '0x92F91D7A60cD7426AC7452E217DB19453D325B50'; 
const abi = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "proposalIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
          }
      ],
      "name": "VoteCasted",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "string",
              "name": "winnerName",
              "type": "string"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "votingNumber",
              "type": "uint256"
          }
      ],
      "name": "WinnerDeclared",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [],
      "name": "VotingReset",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "FundsWithdrawn",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "oldOwner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "OwnerChanged",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [],
      "name": "ContractDeactivated",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "declareWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "deactivateContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getHistory",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "string",
                      "name": "winnerName",
                      "type": "string"
                  },
                  {
                      "internalType": "uint256",
                      "name": "votes",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct ScrumVoting.VotingHistory[]",
              "name": "",
              "type": "tuple[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "resetVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "proposalIndex",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
          }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "scrumMaster",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "secondaryOwner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "proposals",
      "outputs": [
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "voters",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "remainingVotes",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "votingEnded",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "votingNumber",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "stateMutability": "payable",
      "type": "receive"
  }
]


  
  const votingContract = new web3.eth.Contract(abi, address);
  
  export default votingContract;
