document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    setTimeout(async () => {
        await initializeContract();
        loadMarketplaceTickets();
    }, 1000); // Delay ensures contract is loaded
});


// ✅ Properly Initialize Web3
async function initializeWeb3() {
    if (window.ethereum) {
        try {
            // ✅ Set `window.web3` globally
            window.web3 = new Web3(window.ethereum);

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            window.currentAccount = accounts[0]; // ✅ Store account globally

            console.log("✅ MetaMask detected, Web3 initialized.");

            const connectedWallet = sessionStorage.getItem("connectedWallet");
            if (connectedWallet) {
                updateWalletDisplay(connectedWallet);
                await isAdminOrOrganizer(connectedWallet); // ✅ Ensure admin check happens only if web3 is ready
            }
        } catch (error) {
            console.error("❌ Error initializing Web3:", error);
        }
    } else {
        alert("⚠️ MetaMask is required to interact with the marketplace.");
        console.error("❌ MetaMask is not installed or not detected.");
    }
}


// ✅ Ensure admin/organizer check is called after contract loads
async function initializeContract() {
    try {
        if (!window.web3 || !window.web3.eth) {
            console.error("❌ Web3 is not initialized. Ensure MetaMask is installed and connected.");
            return;
        }

        if (!F1TicketContract || !F1TicketContract.abi || !CONTRACT_ADDRESS) {
            console.error("❌ Missing ABI or Contract Address. Check contracts.js.");
            return;
        }

        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS); 
        console.log("🔹 Contract initialized:", window.contract);

        if (!window.contract || !window.contract.methods) {
            console.error("❌ Contract is not properly initialized.");
            return;
        }

        // ✅ Ensure contract is available before checking admin/organizer status
        if (window.currentAccount) {
            await isAdminOrOrganizer(window.currentAccount);
        }
    } catch (error) {
        console.error("❌ Error initializing contract:", error);
    }
}



// ✅ Connect Wallet and Check Admin/Organizer Status
async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("⚠️ MetaMask is required to connect.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0]; // ✅ Ensure this is stored globally

        sessionStorage.setItem("connectedWallet", window.currentAccount);
        updateWalletDisplay(window.currentAccount);

        console.log("✅ Wallet connected:", window.currentAccount);

        // ✅ Immediately check if user is an Admin or Organizer
        await isAdminOrOrganizer(window.currentAccount);
    } catch (error) {
        console.error("❌ Error connecting wallet:", error);
    }
}

// ✅ Function to Show/Hide Staff Navigation Item
function toggleStaffNavItem(show) {
    const staffNavItem = document.getElementById("staffNavItem");
    if (!staffNavItem) {
        console.warn("⚠️ Staff button not found in the DOM.");
        return;
    }

    staffNavItem.style.display = show ? "inline-block" : "none"; // ✅ Ensures it remains visible in `inline-block`
    console.log(`📢 Staff Nav Item ${show ? "Visible" : "Hidden"}`);
}



// ✅ Check if the connected user is an Admin or Organizer
async function isAdminOrOrganizer(walletAddress) {
    try {
        if (!window.contract || !window.contract.methods) {
            console.warn("⚠️ Contract is not yet initialized. Retrying...");
            setTimeout(() => isAdminOrOrganizer(walletAddress), 1000); // Retry after 1 sec
            return;
        }

        const userAddress = walletAddress.toLowerCase();

        const isAdmin = await window.contract.methods.hasRole(
            window.web3.utils.keccak256("DEFAULT_ADMIN_ROLE"), 
            userAddress
        ).call();

        const isOrganizer = await window.contract.methods.hasRole(
            window.web3.utils.keccak256("ORGANIZER_ROLE"), 
            userAddress
        ).call();

        console.log(`📢 isAdmin: ${isAdmin}, isOrganizer: ${isOrganizer}`);

        toggleStaffNavItem(isAdmin || isOrganizer);
    } catch (error) {
        console.error("❌ Error checking admin/organizer status:", error);
    }
}


// ✅ Disconnect Wallet and Hide Staff Nav
function disconnectWallet() {
    sessionStorage.removeItem("connectedWallet");

    const walletDisplay = document.getElementById("walletAddressDisplay");
    const connectButton = document.getElementById("connectWalletButton");
    const disconnectButton = document.getElementById("disconnectWalletButton");

    if (walletDisplay) walletDisplay.textContent = "Wallet: Not Connected";
    if (connectButton) connectButton.style.display = "block";
    if (disconnectButton) disconnectButton.style.display = "none";

    // ✅ Hide Staff Nav Button
    toggleStaffNavItem(false);

    console.log("🔌 Wallet disconnected.");
}


// Update Wallet Display
function updateWalletDisplay(walletAddress) {
    document.getElementById("walletAddressDisplay").textContent = `Wallet: ${walletAddress}`;
    document.getElementById("connectWalletButton").style.display = "none";
    document.getElementById("disconnectWalletButton").style.display = "block";
}

// ✅ Load Marketplace Tickets from Contract (Updated)
async function loadMarketplaceTickets() {
    console.log("🔍 Fetching resale tickets...");
    const ticketsForSale = await window.contract.methods.getResaleTickets().call();
    console.log("📢 Tickets for sale:", ticketsForSale); // ✅ Debugging output
    

    const marketplaceTableBody = document.getElementById("marketplaceTableBody");
    marketplaceTableBody.innerHTML = "Loading...";

    try {
        if (!window.contract) {
            console.error("❌ Contract not initialized.");
            marketplaceTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Marketplace not available</td></tr>`;
            return;
        }

        console.log("🔹 Fetching resale tickets...");
        const ticketsForSale = await window.contract.methods.getResaleTickets().call();

        marketplaceTableBody.innerHTML = "";

        if (ticketsForSale.length === 0) {
            marketplaceTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No tickets for sale yet!</td></tr>`;
            return;
        }

        ticketsForSale.forEach(ticket => {
            const priceETH = window.web3.utils.fromWei(ticket.price, "ether");
            const row = `
                <tr>
                    <td>${ticket.ticketId}</td>
                    <td>${ticket.eventName}</td>
                    <td>${ticket.eventDate}</td>
                    <td>${ticket.eventLocation}</td>
                    <td>${ticket.currentOwner}</td>
                    <td>${priceETH} ETH</td>
                    <td>
                        <button class="btn btn-primary btn-sm buyButton" 
                                data-ticket-id="${ticket.ticketId}"
                                data-price="${ticket.price}">
                            Buy
                        </button>
                    </td>
                </tr>`;
            marketplaceTableBody.innerHTML += row;
        });

        attachBuyButtonListeners();
    } catch (error) {
        console.error("❌ Marketplace error:", error);
        marketplaceTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Error loading tickets</td></tr>`;
    }
}




document.getElementById("connectWalletButton").addEventListener("click", connectWallet);
document.getElementById("disconnectWalletButton").addEventListener("click", disconnectWallet);


function attachBuyButtonListeners() {
    const buyButtons = document.querySelectorAll(".buyButton");
    buyButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const ticketId = event.target.getAttribute("data-ticket-id");
            const price = event.target.getAttribute("data-price");
            await buyTicket(ticketId, price);
        });
    });
}

async function buyTicket(ticketID, price) {
    try {
        if (!window.contract) {
            console.error("❌ Contract is not initialized.");
            alert("⚠️ Contract not ready. Try again.");
            return;
        }

        // ✅ Ensure currentAccount is set (fallback to sessionStorage)
        if (!window.currentAccount) {
            const storedAccount = sessionStorage.getItem("connectedWallet");
            if (storedAccount) {
                window.currentAccount = storedAccount;
            } else {
                console.error("❌ Wallet not connected.");
                alert("⚠️ Please connect your wallet before making a purchase.");
                return;
            }
        }

        const ticket = await window.contract.methods.tickets(ticketID).call();
        if (!ticket.isForResale) {
            alert("⚠️ Ticket is no longer available.");
            return;
        }

        const confirmation = confirm(`Buy ticket ${ticketID} for ${window.web3.utils.fromWei(price, 'ether')} ETH?`);
        if (!confirmation) return;

        await window.contract.methods.purchaseResaleTicket(ticketID)
            .send({ 
                from: window.currentAccount,  // ✅ Now correctly references currentAccount
                value: price,
                gas: 300000 
            });

        alert("✅ Purchase successful!");
        loadMarketplaceTickets();
    } catch (error) {
        console.error("❌ Purchase failed:", error);
        alert("⚠️ Purchase failed: " + error.message);
    }
}


document.getElementById("connectWalletButton").addEventListener("click", connectWallet);
document.getElementById("disconnectWalletButton").addEventListener("click", disconnectWallet);