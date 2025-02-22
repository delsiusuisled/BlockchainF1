//this file is to store the address, abi, and endpoint
//const CONTRACT_ADDRESS = "0x4c0f1c23ca3c268a53eef987de76a2b69c034ae2";
//const CONTRACT_ADDRESS = "0xe2c0e183e1b5fb997fe444894d52b5db4200f4fc";
//const CONTRACT_ADDRESS = "0xea39d36f6511edfafb58859fe75d7374d71c5292";
//const CONTRACT_ADDRESS = "0x505582afdba6b1ebd1a68dd6a54fe6568d96f699";
//const CONTRACT_ADDRESS = "0x3ed6b8951fdb3704c9069cca6b271ade65abd042";
//const CONTRACT_ADDRESS = "0x4f5f3d5c1837254058edabc379bb318e1a3ba3aa";
//const CONTRACT_ADDRESS = "0x6b9dbfc54d83018eedb5a41254f8c46165bd626f";
//const CONTRACT_ADDRESS = "0x35551dab9d0382b0beb1c952ee58f622024fc933";
//const CONTRACT_ADDRESS = "0xe46dce624493cf4852ba7e37e0dcc8be2fce8996";
//const CONTRACT_ADDRESS = "0x6ae3ae770128fa390431a02a6e722f3eeac1d203";
//const CONTRACT_ADDRESS = "0x333d25efc7d13234d6d598f8b4f5a119bd2d43e0";
//const CONTRACT_ADDRESS = "0x93eb3b6b22ddef1d619987663e93ab4b0002dfb6";
//const CONTRACT_ADDRESS = "0xbee869f5ffc6a598eea25d2971f932bb8c972f76";
//const CONTRACT_ADDRESS = "0xf9931b629f2745088c524bce20c45057735665e6";
//const CONTRACT_ADDRESS = "0xb6f5bf4fdfce9f5c85b1c46fd32d0e06954603c5";
//const CONTRACT_ADDRESS = "0x247b5d9b30d97e66141ddd161949d1e7a68edfc1";
//const CONTRACT_ADDRESS = "0xa3965bbf6cf316919eb35aeb1fcb0c04a3d83d37";
//const CONTRACT_ADDRESS = "0x75d9d7bd8988f6f59d78b0b6a0aa8d17e1e92e2b";
//const CONTRACT_ADDRESS = "0x46c7dc5ae4ff26519bdfb0556dc7ec88d7956966";
//const CONTRACT_ADDRESS = "0x83b82fe9dbdd16dbc794c55b389193ee86e61964";
//const CONTRACT_ADDRESS = "0x1d90c46222492ba9183d12893b8fd51d9ee21633";
//const CONTRACT_ADDRESS = "0x0584a180c5fbbe9d77a137083f4c062811dfd6a1";
//const CONTRACT_ADDRESS = "0xcdc4a218e4a3e2076a7c9476da2e978b81d31367";
//const CONTRACT_ADDRESS = "0x2ea690717b1a5c0a839bb9a4c4d2813b9697d2d6";
//const CONTRACT_ADDRESS = "0x5e212649ebec867f7a6cf9d097774f5be793844b";
//const CONTRACT_ADDRESS = "0x9d739fd9359ea84a007c947aea27cdbf6b642064";
//const CONTRACT_ADDRESS = "0xb0366c0dcDFD5B7a539041f113DC2c1ccd6CAC46";
//const CONTRACT_ADDRESS = "0xF12a9E78c799eeAf43D8bc0E904618608853e857"; //YF ADDRESS
//const CONTRACT_ADDRESS = "0xc2b4e7793264712ff094a6b3618afb38db44ee0e"; 
//const CONTRACT_ADDRESS = "0xc90a5e15a1972e94dc91646cccc872cbd4541739"; 
//const CONTRACT_ADDRESS = "0xdbe2e2b38140424135451346e52322d93f576ff6"; 
//const CONTRACT_ADDRESS = "0x09df51b8b84f2d6b6fcd01c684c209e1056b160d"; 
const CONTRACT_ADDRESS = "0xc2d21ce96ca1f59190459f60184e485d6fa6f6f0"; 
//contract url: https://sepolia.etherscan.io/tx/0x5057b2c184bdae07b0accc9c627fcc22e077fe9653b8c507c0e7ce6a78220e9c
const CONTRACT_ENDPOINT = "https://sepolia.infura.io/v3/";
const F1TicketContract = {
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "fullName",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "organizer",
                        "type": "address"
                    }
                ],
                "name": "addOrganizer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "cancelResale",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_date",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_location",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_availableTickets",
                        "type": "uint256"
                    }
                ],
                "name": "createEvent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_eventId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_eventName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_eventDate",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_eventLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    }
                ],
                "name": "createTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "grantRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
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
                        "internalType": "uint256",
                        "name": "eventId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "date",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "location",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "availableTickets",
                        "type": "uint256"
                    }
                ],
                "name": "EventUpdated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "expireTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "organizer",
                        "type": "address"
                    }
                ],
                "name": "OrganizerAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "organizer",
                        "type": "address"
                    }
                ],
                "name": "OrganizerRemoved",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "purchaseResaleTicket",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_eventId",
                        "type": "uint256"
                    }
                ],
                "name": "purchaseTicket",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Received",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "refundAmount",
                        "type": "uint256"
                    }
                ],
                "name": "RefundIssued",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "refundTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "organizer",
                        "type": "address"
                    }
                ],
                "name": "removeOrganizer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "renounceRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "ResaleCancelled",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_newPrice",
                        "type": "uint256"
                    }
                ],
                "name": "resellTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "revokeRole",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "previousAdminRole",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "newAdminRole",
                        "type": "bytes32"
                    }
                ],
                "name": "RoleAdminChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleGranted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    }
                ],
                "name": "RoleRevoked",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "eventName",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "TicketCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "newPrice",
                        "type": "uint256"
                    }
                ],
                "name": "TicketResold",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    }
                ],
                "name": "TicketTransferred",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferTicket",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_eventId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_date",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_location",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_availableTickets",
                        "type": "uint256"
                    }
                ],
                "name": "updateEvent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [],
                "name": "DEFAULT_ADMIN_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "eventCount",
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
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "events",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "eventId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "eventName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "eventDate",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "eventLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "availableTickets",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "status",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getAllEvents",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "eventId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "eventName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventDate",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventLocation",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "price",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "availableTickets",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "ticketIds",
                                "type": "uint256[]"
                            },
                            {
                                "internalType": "bool",
                                "name": "status",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct F1PaddockClub.Event[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "admin",
                        "type": "address"
                    }
                ],
                "name": "getOrganizerByAdmin",
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
                        "internalType": "address",
                        "name": "organizer",
                        "type": "address"
                    }
                ],
                "name": "getOrganizerFullName",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_ticketId",
                        "type": "uint256"
                    }
                ],
                "name": "getResaleHistory",
                "outputs": [
                    {
                        "internalType": "address[]",
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getResaleTickets",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "ticketId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "eventName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventDate",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventLocation",
                                "type": "string"
                            },
                            {
                                "internalType": "address",
                                "name": "currentOwner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "price",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "isForSale",
                                "type": "bool"
                            },
                            {
                                "internalType": "bool",
                                "name": "isForResale",
                                "type": "bool"
                            },
                            {
                                "internalType": "bool",
                                "name": "isExpired",
                                "type": "bool"
                            },
                            {
                                "internalType": "address[]",
                                "name": "resaleHistory",
                                "type": "address[]"
                            }
                        ],
                        "internalType": "struct F1PaddockClub.Ticket[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    }
                ],
                "name": "getRoleAdmin",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getRoleMember",
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
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    }
                ],
                "name": "getRoleMemberCount",
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
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_eventId",
                        "type": "uint256"
                    }
                ],
                "name": "getTicketsForEvent",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "ticketId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "eventName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventDate",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "eventLocation",
                                "type": "string"
                            },
                            {
                                "internalType": "address",
                                "name": "currentOwner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "price",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "isForSale",
                                "type": "bool"
                            },
                            {
                                "internalType": "bool",
                                "name": "isForResale",
                                "type": "bool"
                            },
                            {
                                "internalType": "bool",
                                "name": "isExpired",
                                "type": "bool"
                            },
                            {
                                "internalType": "address[]",
                                "name": "resaleHistory",
                                "type": "address[]"
                            }
                        ],
                        "internalType": "struct F1PaddockClub.Ticket[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "role",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "hasRole",
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
                "name": "maxResalePrice",
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
                "inputs": [],
                "name": "minResalePrice",
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
                "inputs": [],
                "name": "ORGANIZER_ROLE",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
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
                "name": "organizerList",
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
                "name": "refundedTickets",
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
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "interfaceId",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
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
                "name": "ticketCount",
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
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "tickets",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "ticketId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "eventName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "eventDate",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "eventLocation",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "currentOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isForSale",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isForResale",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isExpired",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "transactionFeePercent",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }
let web3, contract;
let currentAccount = null; // Declare globally to be accessed in other scripts
let currentPage = 1; // Current page number
const eventsPerPage = 10; // Number of events per page
const ticketsPerPage = 10;


const ADMIN_WALLET = "0x39022f2935339ff128e2917aff08867098fffc4e"
const ADMIN_ADDRESS = "0x39022f2935339ff128e2917aff08867098fffc4e"


// ✅ Initialize presetTickets AFTER web3 is initialized
async function initializeWeb3() {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            currentAccount = accounts[0];
            contract = new web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);

            console.log("✅ Web3 Initialized");
            console.log("Wallet connected:", currentAccount);
            sessionStorage.setItem("connectedWallet", currentAccount);
            if (!web3) {
                console.error("❌ Web3 is not initialized.");
                return;
            }

        } catch (error) {
            console.error("❌ Failed to connect wallet:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this application.");
    }
}

window.onload = async () => {
    await initializeWeb3();
};

async function safeGasEstimate(methodCall, fallbackGas = 300000) {
    try {
        return await methodCall.estimateGas();
    } catch (error) {
        console.warn("⚠️ Gas estimation failed, using fallback value");
        return fallbackGas;
    }
}
//AN EXAMPLE OF HOW TO USE THIS GAS
// const gasEstimate = await safeGasEstimate(
//     contract.methods.purchaseResaleTicket(ticketID), 
//     300000 // Fallback gas limit
// );