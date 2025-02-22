let isEventsLoaded = false;

// ✅ Ensure Web3 is Initialized Before Interacting with the Contract
async function initializeWeb3() {
    console.log("🔹 Initializing Web3...");

    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    if (typeof Web3 === "undefined") {
        console.error("❌ Web3 library is not loaded.");
        return;
    }

    try {
        if (!window.web3) {
            console.log("🔹 Creating new Web3 instance...");
            window.web3 = new Web3(window.ethereum);
        }

        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        currentAccount = accounts[0];

        sessionStorage.setItem("connectedWallet", currentAccount);
        console.log("✅ Wallet connected:", currentAccount);

        await initializeContract();
        safeUpdateNavbar(currentAccount);

        console.log("✅ Web3 Initialized Successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize Web3:", error);
    }
}

// ✅ Ensure Contract is Initialized Before Interacting
async function initializeContract() {
    if (!window.web3) await initializeWeb3();

    if (!window.contract) {
        window.contract = new web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("✅ Smart contract initialized:", window.contract);
    }
}


// ✅ Fetch Events Directly from Smart Contract
async function fetchAllEvents() {
    try {
        if (!window.contract) await initializeContract(); // Ensure contract is initialized

        const events = await window.contract.methods.getAllEvents().call();
        console.log("✅ Raw Events fetched from smart contract:", events);

        if (!Array.isArray(events)) {
            console.error("❌ Unexpected data format. Expected an array but got:", events);
            return [];
        }

        if (events.length === 0) {
            console.warn("⚠️ No events found.");
            return [];
        }

        return events;
    } catch (error) {
        console.error("❌ Failed to fetch events from contract:", error);
        return [];
    }
}



// ✅ Load Events and Display in the Table
async function loadEvents() {
    console.log("✅ Running loadEvents...");

    const eventTableBody = document.getElementById("eventsTableBody");
    if (!eventTableBody) {
        console.error("❌ Event table not found.");
        return;
    }

    eventTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading events, please wait...</td></tr>`;

    try {
        if (!window.web3) await initializeWeb3();
        if (!window.contract) await initializeContract();

        const events = await fetchAllEvents();
        console.log("✅ Processed Events:", events);

        if (!Array.isArray(events) || events.length === 0) {
            console.warn("⚠️ No valid events found.");
            eventTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No events available.</td></tr>`;
            return;
        }

        eventTableBody.innerHTML = ""; // Clear table

        events.forEach((event) => {
            try {
                let eventPrice = event.price ? `${window.web3.utils.fromWei(event.price, "ether")} ETH` : "N/A";
                const availability = event.availableTickets > 0 ? "Available" : "Sold Out";

                const row = `
                    <tr>
                        <td>${event.eventId}</td>
                        <td>${event.eventName}</td>
                        <td>${event.eventDate}</td>
                        <td>${event.eventLocation}</td>
                        <td>${eventPrice}</td>
                        <td>${availability}</td>
                        <td>
                            <button class="btn btn-primary" onclick="navigateToEventDetails(${event.eventId})">Details</button>
                        </td>
                    </tr>
                `;
                eventTableBody.innerHTML += row;
            } catch (error) {
                console.error("❌ Error processing event:", event, error);
            }
        });

        console.log("✅ Events displayed successfully.");
    } catch (error) {
        console.error("❌ Error loading events:", error);
        eventTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading events. Please try again.</td></tr>`;
    }
}


// ✅ Redirect to Event Details Page
function navigateToEventDetails(eventId) {
    window.location.href = `eventdetails.html?eventId=${eventId}`;
}


// ✅ Update Navbar Wallet Display
function updateNavbarWalletDisplay() {
    const walletDisplay = document.getElementById("walletDisplay");
    const disconnectButton = document.getElementById("disconnectWallet");

    if (!walletDisplay || !disconnectButton) {
        console.error("❌ Navbar elements not found.");
        return;
    }

    let connectedWallet = sessionStorage.getItem("connectedWallet");

    if (connectedWallet) {
        walletDisplay.textContent = `Connected: ${connectedWallet}`;
        disconnectButton.style.display = "block";
    } else {
        walletDisplay.textContent = "Not Connected";
        disconnectButton.style.display = "none";
    }
}

// ✅ Safe Update Navbar
async function safeUpdateNavbar(walletAddress) {
    const walletDisplay = document.getElementById("walletDisplay");
    const navConnectButton = document.getElementById("navConnectWalletButton");

    if (!walletDisplay || !navConnectButton) {
        console.error("❌ Navbar elements not found.");
        return;
    }

    if (!walletAddress) {
        console.log("🔹 Wallet disconnected. Resetting navbar...");
        walletDisplay.textContent = "Not Connected";
        navConnectButton.textContent = "Connect Wallet";
        return;
    }

    console.log("🔹 Updating Navbar for Wallet:", walletAddress);
    walletDisplay.textContent = `Connected: ${walletAddress}`;
}

// ✅ Disconnect Wallet and Reset UI
function disconnectWallet() {
    console.log("🔌 Disconnecting wallet...");

    sessionStorage.removeItem("connectedWallet");
    currentAccount = null;

    // ✅ Reset UI Elements
    const walletDisplay = document.getElementById("walletAddressDisplay");
    const connectButton = document.getElementById("navConnectWalletButton");
    const disconnectButton = document.getElementById("disconnectWalletButton");
    const staffNavItem = document.getElementById("staffNavItem");

    if (walletDisplay) {
        walletDisplay.textContent = "Wallet: Not Connected";
        walletDisplay.style.display = "none";
    }
    if (staffNavItem) {
        staffNavItem.style.display = "none";
    }

    if (connectButton) {
        connectButton.style.display = "block";
        connectButton.textContent = "Connect Wallet";
        connectButton.classList.add("btn-danger");
        connectButton.classList.remove("btn-secondary");
        connectButton.onclick = connectWallet;
    }

    if (disconnectButton) {
        disconnectButton.style.display = "none";
        disconnectButton.disabled = false;
    }

    console.log("✅ Wallet disconnected successfully.");
}

// ✅ Attach event listener for disconnect button
document.addEventListener("DOMContentLoaded", () => {
    const disconnectButton = document.getElementById("disconnectWalletButton");
    
    if (disconnectButton) {
        disconnectButton.addEventListener("click", disconnectWallet);
        console.log("✅ Disconnect button event listener attached.");
    } else {
        console.warn("⚠️ disconnectWalletButton not found in DOM.");
    }
});

window.onload = async () => {
    console.log("🔹 Window fully loaded...");
    await initializeWeb3();
    await initializeContract();
    await loadEvents();
};


// ✅ Ensure UI Updates on Page Load
window.addEventListener("load", async () => {
    console.log("🔹 Window fully loaded...");
    await initializeWeb3();
    updateNavbarWalletDisplay();

    const connectedWallet = sessionStorage.getItem("connectedWallet");
    if (connectedWallet) {
        safeUpdateNavbar(connectedWallet);
        updateNavbarWalletDisplay();
        if (!isEventsLoaded) { 
            isEventsLoaded = true;
            await loadEvents();
        }
    }
});
