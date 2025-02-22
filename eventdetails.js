// Initialize Web3 and Contract
async function initializeWeb3() {
    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    window.web3 = new Web3(window.ethereum);

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        console.log("✅ Wallet connected:", window.currentAccount);
    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}

async function initializeContract() {
    if (!window.web3) await initializeWeb3();

    if (!window.contract) {
        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("🔹 Contract initialized.");
    }
}

// Ensure Web3 and Contract Initialization
async function ensureWeb3AndContractInitialized() {
    if (!window.web3) {
        console.warn("⚠️ Web3 not initialized. Initializing...");
        await initializeWeb3();
    }

    if (!window.contract) {
        console.warn("⚠️ Contract not initialized. Initializing...");
        await initializeContract();
    }
}



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
async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");

    if (!eventId) {
        console.error("❌ Event ID not found in URL.");
        alert("Event ID is missing in the URL. Unable to load details.");
        return;
    }

    await ensureWeb3AndContractInitialized();

    try {
        const allEvents = await window.contract.methods.getAllEvents().call();
        const eventDetails = allEvents.find(event => event.eventId === eventId);

        if (!eventDetails) {
            alert("Event not found.");
            return;
        }

        const priceInWei = eventDetails.price;
        document.getElementById("eventName").textContent = eventDetails.eventName;
        document.getElementById("eventDate").textContent = eventDetails.eventDate;
        document.getElementById("eventLocation").textContent = eventDetails.eventLocation;
        document.getElementById("eventPrice").textContent = `${window.web3.utils.fromWei(priceInWei, "ether")} ETH`;
        document.getElementById("availableTickets").textContent = eventDetails.availableTickets;

        const purchaseButton = document.getElementById("purchaseTicketButton");
        const eventDate = new Date(eventDetails.eventDate);
        const currentDate = new Date();

        if (eventDate < currentDate || eventDetails.availableTickets === "0") {
            purchaseButton.textContent = eventDetails.availableTickets === "0" ? "Fully Bought" : "Event Ended";
            purchaseButton.disabled = true;
        } else {
            purchaseButton.onclick = () => purchaseTicket(eventId, priceInWei);
            purchaseButton.disabled = false;
        }
    } catch (error) {
        console.error("❌ Error loading event details:", error);
        alert("Failed to load event details.");
    }
}

// Purchase Ticket
async function purchaseTicket(eventId, priceInWei) {
    await ensureWeb3AndContractInitialized();

    try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (!accounts.length) {
            alert("⚠ Please connect your wallet first.");
            return;
        }

        const gasEstimate = await window.contract.methods.purchaseTicket(eventId).estimateGas({
            from: window.currentAccount,
            value: priceInWei
        });

        await window.contract.methods.purchaseTicket(eventId).send({
            from: window.currentAccount,
            value: priceInWei, // Send the correct ticket price
            gas: gasEstimate
        });

        alert("🎟 Ticket purchased successfully!");
        await loadEventDetails(); // Refresh event details
    } catch (error) {
        console.error("❌ Purchase failed:", error);
        alert("⚠ Failed to purchase: ${error.message}");
    }
}



// Initialize when page loads
document.addEventListener("DOMContentLoaded", loadEventDetails);



// Update `presetTickets` on page load
document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    await initializeContract();

    // Load `presetTickets` from localStorage or initialize
    window.presetTickets = JSON.parse(localStorage.getItem("presetTickets")) || [];
    if (!window.presetTickets.length) {
        console.warn("No tickets found. Initializing with an empty array.");
        window.presetTickets = [];
        localStorage.setItem("presetTickets", JSON.stringify(window.presetTickets));
    }

    await loadEventDetails();
});
