//my address: 0x39022f2935339Ff128e2917AFF08867098Fffc4e
//to: 0xd504c998af2b2571b68d3fd4632d99746e75a2db
var Contracts = {
    HouseRegistrationContract: {
        abi: [
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balances",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_houseNo",
                        "type": "uint256"
                    }
                ],
                "name": "getOwner",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "houseNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "ownerName",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "walletAddress",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "houseCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "mintCoins",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_owner",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "registerNewHouse",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "sendCoins",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_houseNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_owner",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferHouse",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    }
};

function HouseRegistrationApp(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}

HouseRegistrationApp.prototype.onReady = function () {
    this.init(function () {
        $('#message').append("DApp loaded successfully.");
    });
    this.bindButtons();
    this.loadHouseRegistration();
}

HouseRegistrationApp.prototype.init = function (cb) {
    if (window.ethereum) {
        this.web3 = new Web3(ethereum);
        try {
            ethereum.enable();
        } catch (error) {
            console.error("Error enabling Ethereum:", error);
        }
    }

    var contract_interface = this.web3.eth.contract(this.Contract.abi);
    
    this.instance = contract_interface.at(this.Contract.address);
    cb();
};

if (typeof (Contracts) === "undefined") {
    var Contracts = {
        HouseRegistrationContract: { abi: [] }
    };
}

var houseRegistrationApp = new HouseRegistrationApp(Contracts['HouseRegistrationContract']);

$(document).ready(function () {
    houseRegistrationApp.onReady();
});

HouseRegistrationApp.prototype.getHouseCount = function (cb) {
    this.instance.houseCount(function (error, houseCount) {
        cb(error, houseCount);
    });
};

HouseRegistrationApp.prototype.getOwner = function (houseNo, cb) {
    this.instance.getOwner(houseNo, function (error, house) {
        cb(error, house);
    });
};

HouseRegistrationApp.prototype.loadHouseRegistration = function () {
    var that = this;
    this.getHouseCount(function (error, houseCount) {
        if (error) {
            console.log(error);
        }
        $("#message").text("House Count: " + houseCount);
        $("#houseListResults").empty();
        for (let i = 1; i <= houseCount; i++) {
            var houseNo = i;
            that.getOwner(houseNo, function (error, house) {
                if (error) {
                    console.log(error);
                }
                var number = house[0];
                var owner = house[1];
                var wallet = house[2];
                var houseTemplate = `<tr>
                    <td>${number}</td>
                    <td>${owner}</td>
                    <td>${wallet}</td>
                </tr>`;
                $("#houseListResults").append(houseTemplate);
            });
        }
        var nextHouseCount = houseCount.toNumber() + 1;
        $("#newHouseNo").val(nextHouseCount);
        $("#newHouseNo").attr('disabled', true);
    });
};

HouseRegistrationApp.prototype.bindButtons = function () {
    var that = this;

    $(document).on("click", "#button-register", function () {
        that.registerNewHouse();
    });

    $(document).on("click", "#button-transfer-house", function () {
        that.transferHouse();
    });

    $(document).on("click", "#button-check-balance", function () {
        that.showAddressBalance();
    });
};

HouseRegistrationApp.prototype.registerNewHouse = function () {
    var newHouseNo = $("#newHouseNo").val();
    var newOwner = $("#newOwner").val();
    var newAddress = $("#newAddress").val();
    var newAmount = $("#newAmount").val(); 
    $("#message").text("Registering " + newHouseNo + " to " + newOwner);

    var that = this;

    this.instance.registerNewHouse(
        newOwner, newAddress, newAmount,
        { from: this.web3.eth.accounts[0], gas: 1000000},
        function (error, receipt) {
            if (error) {
                console.log(error);
                $("#message").text("Error occurred during registration: " + error.message);
            } else {
                if (receipt.status) {
                    $("#newHouseNo").val("");
                    $("#newOwner").val("");
                    $("#newAddress").val("");
                    $("#newAmount").val("");
                    that.loadHouseRegistration(); 
                    $("#message").text("House registered successfully!");
                } else {
                    $("#message").text("Registration failed.");
                }
            }
        }
    );
};

HouseRegistrationApp.prototype.transferHouse = function () {
    var txfHouseNo = parseInt($("#txfHouseNo").val()); 
    var txfOwner = $("#txfOwner").val().trim(); 
    var txfAddress = $("#txfAddress").val(); 
    var txfAmount = $("#txfAmount").val();

    if (isNaN(txfHouseNo) || txfHouseNo <= 0) {
        $("#message").text("Invalid house number. Please enter a valid number.");
        return;
    }
    if (txfOwner === "") {
        $("#message").text("Owner name cannot be empty.");
        return;
    }

    $("#message").text("Transferring " + txfHouseNo + " to " + txfOwner);

    var that = this; 

    this.instance.transferHouse(
        txfHouseNo,
        txfOwner,
        txfAddress, 
        txfAmount,
        {
            from: this.web3.eth.accounts[0],
            gas: 1000000,
            gasPrice: 1000000000,
        },
        function (error, receipt) {
            if (error) {
                console.log(error);
                $("#message").text("Error occurred during transfer: " + error.message);
            } else {
                if (receipt.status == 1) {
                    $("#txfHouseNo").val("");
                    $("#txfOwner").val("");
                    $("#txfAddress").val(""); 
                    $("txfAmount").val("");
                    that.loadHouseRegistration();
                    $("#message").text("House transferred successfully!");
                } else { 
                    $("#message").text("Transfer failed.");
                }
            }
        }
    );
};

HouseRegistrationApp.prototype.getBalance = function (address, cb) {
    this.instance.balances(address, function (error, result) {
        if (error) {
            cb(error, null);
        } else {
            cb(null, result); // Pass BigNumber result to the callback
        }
    });
};

HouseRegistrationApp.prototype.showAddressBalance = function () {
    var address = $("#balanceAddress").val().trim();

    var isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!isValidAddress) {
        $("#showbalance").text("Invalid wallet address. Please enter a valid address.");
        return;
    }
    this.getBalance(address, function (error, balance) {
        if (error) {
            console.log(error);
            $("#showbalance").text("Error fetching balance: " + error.message);
        } else {
            $("#showbalance").text("Wallet Balance: " + balance.toString());
        }
    });
};





