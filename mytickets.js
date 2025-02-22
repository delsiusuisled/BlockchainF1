// Global Variables
let isTicketsLoaded = false;

// ✅ Initialize Web3 and Smart Contract
async function initializeWeb3() {
    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed.");
        return;
    }

    window.web3 = new Web3(window.ethereum);
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        sessionStorage.setItem("connectedWallet", window.currentAccount);
        safeUpdateNavbar(window.currentAccount);
    } catch (error) {
        console.error("❌ Wallet connection failed:", error);
    }
}

async function initializeContract() {
    if (!window.web3) await initializeWeb3();

    if (!window.contract) {
        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("🔹 Contract initialized.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔹 DOM fully loaded, initializing Web3...");

    await initializeWeb3();
    await initializeContract();

    const connectedWallet = sessionStorage.getItem("connectedWallet");
    if (connectedWallet) {
        safeUpdateNavbar(connectedWallet);
        updateNavbarWalletDisplay();
    }
});


// ✅ Load Tickets Owned by Connected Wallet
async function loadMyTickets() {
    await initializeWeb3();
    await initializeContract();
    const myTicketsTableBody = document.getElementById("myTicketsTableBody");
    myTicketsTableBody.innerHTML = "";

    try {
        const ticketCount = await window.contract.methods.ticketCount().call();
        if (ticketCount == 0) {
            myTicketsTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No tickets available</td></tr>`;
            return;
        }

        for (let i = 1; i <= ticketCount; i++) {
            const ticket = await window.contract.methods.tickets(i).call();
            const owner = ticket.currentOwner.toLowerCase();
            
            if (owner === window.currentAccount.toLowerCase()) {
                const priceETH = window.web3.utils.fromWei(ticket.price, "ether");

                // ✅ Define `row` correctly
                const actionButton = ticket.isForResale 
                    ? `<button class="btn btn-danger btn-sm" onclick="confirmUnsell(${ticket.ticketId})">Unsell</button>`
                    : `<button class="btn btn-warning btn-sm" onclick="confirmSell(
                        ${ticket.ticketId}, 
                        '${ticket.eventName}', 
                        '${ticket.eventDate}', 
                        '${ticket.eventLocation}', 
                        '${priceETH}'
                    )">Sell</button>`;

                const row = `
                    <tr>
                        <td>${ticket.ticketId}</td>
                        <td>${ticket.eventName}</td>
                        <td>${ticket.eventDate}</td>
                        <td>${ticket.eventLocation}</td>
                        <td>${priceETH} ETH</td>
                        <td>${actionButton}</td>
                    </tr>
                `;

                myTicketsTableBody.innerHTML += row; // ✅ Now `row` is defined
            }
        }
    } catch (error) {
        console.error("❌ Ticket loading error:", error);
    }
}



// ✅ Updated Confirm Sell (Trigger Contract Resell)
// ✅ Function to store ticket details in sessionStorage before redirecting to sell.html
function confirmSell(ticketID, eventName, eventDate, eventLocation, currentPriceETH) {
    if (!ticketID || !eventName || !eventDate || !eventLocation || !currentPriceETH) {
        alert("⚠️ Missing ticket data. Cannot proceed.");
        return;
    }

    // ✅ Store ticket data in sessionStorage
    const ticket = {
        ticketId: ticketID,
        eventName: eventName,
        eventDate: eventDate,
        eventLocation: eventLocation,
        price: currentPriceETH
    };

    sessionStorage.setItem("ticketToSell", JSON.stringify(ticket));

    console.log("🔹 Stored ticket data in sessionStorage:", ticket); // ✅ Debugging log

    // ✅ Redirect only after data is stored
    window.location.href = "sell.html";
}



// ✅ Updated Confirm Unsell (Trigger Contract Cancel)
function confirmUnsell(ticketID) {
    if (!confirm("Remove from marketplace?")) return;
    window.contract.methods.cancelResale(ticketID)
        .send({ from: window.currentAccount })
        .then(() => {
            alert("✅ Removed from marketplace!");
            loadMyTickets();
        })
        .catch(error => {
            console.error("Unsell failed:", error);
            alert("❌ Cancel failed: " + error.message);
        });
}

// Connect Wallet
async function connectWallet() {
    try {
        if (typeof window.ethereum === "undefined") {
            alert("⚠️ MetaMask is not installed. Please install it.");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];

        console.log("✅ Wallet Connected:", walletAddress);
        sessionStorage.setItem("connectedWallet", walletAddress);

        // Update navbar dynamically
        updateNavbarWalletDisplay(walletAddress);
    } catch (error) {
        console.error("❌ Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    }
}


// Function to update Navbar Wallet Display & Staff Nav Item
async function updateNavbarWalletDisplay(walletAddress) {
    const walletDisplay = document.getElementById("walletDisplay");
    const navConnectButton = document.getElementById("navConnectWalletButton");
    const staffNavItem = document.getElementById("staffNavItem");

    if (!walletDisplay || !navConnectButton || !staffNavItem) {
        console.error("❌ Navbar elements not found.");
        return;
    }

    if (walletAddress) {
        walletDisplay.textContent = `Connected: ${walletAddress}`;
        walletDisplay.style.display = "block";
        navConnectButton.textContent = "Disconnect Wallet";
        navConnectButton.classList.remove("btn-danger");
        navConnectButton.classList.add("btn-secondary");
        navConnectButton.onclick = disconnectWallet;

        // Check if the user is an Admin or Organizer
        const isAdminOrOrganizer = await isOrganizerOrAdmin(walletAddress);
        staffNavItem.style.display = isAdminOrOrganizer ? "block" : "none"; // Show staff tab if admin/organizer

    } else {
        walletDisplay.textContent = "Connected: Not Connected";
        walletDisplay.style.display = "none";
        navConnectButton.textContent = "Connect Wallet";
        navConnectButton.classList.add("btn-danger");
        navConnectButton.classList.remove("btn-secondary");
        navConnectButton.onclick = connectWallet;
        staffNavItem.style.display = "none"; // Hide staff tab if no wallet connected
    }
}


// Safe Navbar Update
async function safeUpdateNavbar(walletAddress) {
    const walletDisplay = document.getElementById("walletDisplay");
    const navConnectButton = document.getElementById("navConnectWalletButton");
    const staffNavItem = document.getElementById("staffNavItem");

    if (!walletDisplay || !navConnectButton || !staffNavItem) {
        console.error("❌ Navbar elements not found. Ensure HTML includes #walletDisplay and #navConnectWalletButton.");
        return;
    }

    if (!walletAddress) {
        console.log("🔹 Wallet disconnected. Resetting navbar...");
        walletDisplay.textContent = "Not Connected";
        navConnectButton.textContent = "Connect Wallet";
        navConnectButton.classList.add("btn-danger");
        navConnectButton.classList.remove("btn-secondary");
        navConnectButton.onclick = connectWallet;
        staffNavItem.style.display = "none";
        return;
    }

    console.log("🔹 Updating Navbar for Wallet:", walletAddress);

    walletDisplay.textContent = `Connected: ${walletAddress}`;
    navConnectButton.textContent = "Disconnect Wallet";
    navConnectButton.classList.remove("btn-danger");
    navConnectButton.classList.add("btn-secondary");
    navConnectButton.onclick = disconnectWallet;

    // Show Staff Tab if Admin or Organizer
    const isAdminOrOrganizer = await isOrganizerOrAdmin(walletAddress);
    staffNavItem.style.display = isAdminOrOrganizer ? "block" : "none";
}


// Check if the connected wallet is an Admin or Organizer
async function isOrganizerOrAdmin(walletAddress) {
    if (!window.web3) {
        console.error("❌ Web3 is not initialized. Initializing...");
        await initializeWeb3();
    }
    if (!window.contract) {
        console.error("❌ Contract is not initialized. Initializing...");
        await initializeContract();
    }

    try {
        // Fetch Admin and Organizer status using contract methods
        const isAdmin = await checkIsAdmin(walletAddress);
        const isOrganizer = await checkIsOrganizer(walletAddress);

        console.log(`🔹 Checking Admin/Organizer Role for ${walletAddress}: isAdmin = ${isAdmin}, isOrganizer = ${isOrganizer}`);
        return isAdmin || isOrganizer;
    } catch (error) {
        console.error("❌ Error checking admin/organizer role:", error);
        return false;
    }
}


async function checkIsAdmin(walletAddress) {
    try {
        if (!window.web3) {
            console.error("❌ Web3 is not initialized. Initializing...");
            await initializeWeb3();
        }
        if (!window.contract) {
            console.error("❌ Contract not initialized. Initializing...");
            await initializeContract();
        }

        // Ensure Web3 is available before calling utils
        const ADMIN_ROLE = window.web3.utils.keccak256("ADMIN_ROLE");
        const isAdmin = await window.contract.methods.hasRole(ADMIN_ROLE, walletAddress).call();

        console.log(`🔹 Admin Check for ${walletAddress}: ${isAdmin}`);
        return isAdmin;
    } catch (error) {
        console.error("❌ Error checking Admin status:", error);
        return false;
    }
}

async function checkIsOrganizer(walletAddress) {
    try {
        if (!window.web3) {
            console.error("❌ Web3 is not initialized. Initializing...");
            await initializeWeb3();
        }
        if (!window.contract) {
            console.error("❌ Contract not initialized. Initializing...");
            await initializeContract();
        }

        // Ensure Web3 is available before calling utils
        const ORGANIZER_ROLE = window.web3.utils.keccak256("ORGANIZER_ROLE");
        const isOrganizer = await window.contract.methods.hasRole(ORGANIZER_ROLE, walletAddress).call();

        console.log(`🔹 Organizer Check for ${walletAddress}: ${isOrganizer}`);
        return isOrganizer;
    } catch (error) {
        console.error("❌ Error checking Organizer status:", error);
        return false;
    }
}

// Function to disconnect wallet
function disconnectWallet() {
    console.log("🔹 Disconnecting Wallet...");

    // Clear session storage
    sessionStorage.removeItem("connectedWallet");
    sessionStorage.removeItem("userRole");

    // Reset UI elements safely
    safeUpdateNavbar(null);
    document.getElementById("myTicketsTableBody").innerHTML = "";
    isTicketsLoaded = false;
}


// Ensure UI Updates on Page Load
window.addEventListener("load", async () => {
    console.log("🔹 Window fully loaded...");
    await initializeWeb3();
    updateNavbarWalletDisplay();

    const connectedWallet = sessionStorage.getItem("connectedWallet");
    if (connectedWallet) {
        safeUpdateNavbar(connectedWallet);
        updateNavbarWalletDisplay(connectedWallet);
        if (!isTicketsLoaded) {
            isTicketsLoaded = true;
            await loadMyTickets();
        }
    }
});

// Event Listeners for Connection & Disconnection
document.getElementById("connectWallet")?.addEventListener("click", async () => {
    await initializeWeb3();
});

document.getElementById("disconnectWallet")?.addEventListener("click", disconnectWallet);

// Debugging: Log Navbar State
function logNavbarState() {
    const walletDisplay = document.getElementById("walletDisplay");
    const navConnectButton = document.getElementById("navConnectWalletButton");

    console.log("🔍 Wallet Display Text:", walletDisplay?.textContent || "Not Found");
    console.log("🔍 Button Text:", navConnectButton?.textContent || "Not Found");
}

setInterval(logNavbarState, 2000);