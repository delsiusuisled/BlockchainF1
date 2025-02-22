async function initializeWeb3() {
    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    window.web3 = new Web3(window.ethereum);

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = (await window.web3.eth.getAccounts())[0];

        sessionStorage.setItem("connectedWallet", window.currentAccount);
        console.log("✅ Wallet connected:", window.currentAccount);
    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}

// Ensure Web3 is available before contract initialization
async function initializeContract() {
    if (!window.web3) await initializeWeb3();

    if (!window.contract) {
        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("🔹 Contract initialized.");
    }
}



// Update Wallet Address in Navbar
async function updateWalletDisplay() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            currentAccount = accounts[0]; // Update the current account variable
            const walletDisplayElement = document.getElementById("walletAddressDisplay");
            if (walletDisplayElement) {
                walletDisplayElement.textContent = `Connected Wallet: ${accounts[0]}`;
            } else {
                console.error("walletAddressDisplay element not found in the DOM.");
            }
        } else {
            console.warn("No wallet connected.");
        }
    } catch (error) {
        console.error("Error updating wallet display:", error);
    }
}

// ✅ Fetch Events from Smart Contract
// ✅ Fetch Events from Smart Contract
async function fetchAllEvents() {
    try {
        if (!window.contract) await initializeContract();

        const events = await window.contract.methods.getAllEvents().call();
        console.log("✅ Events fetched from contract:", events);

        if (!Array.isArray(events) || events.length === 0) {
            console.warn("⚠️ No events found.");
            return [];
        }

        return events.map(event => ({
            eventId: event[0],
            eventName: event[1],
            eventDate: event[2],
            eventLocation: event[3],
            price: event[4],
            availableTickets: event[5],
            ticketIds: event[6],
            status: event[7]
        }));
    } catch (error) {
        console.error("❌ Failed to fetch events from contract:", error);
        return [];
    }
}


// ✅ Load Events into Table
// ✅ Load Events into Table
async function loadTickets() {
    console.log("✅ Running loadTickets...");

    const ticketTableBody = document.getElementById("ticketTableBody");
    if (!ticketTableBody) {
        console.error("❌ Ticket table not found.");
        return;
    }

    ticketTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading events, please wait...</td></tr>`;

    try {
        const events = await fetchAllEvents();

        if (!events.length) {
            ticketTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No events available</td></tr>`;
            return;
        }

        ticketTableBody.innerHTML = ""; // Clear previous entries

        events.forEach((event, index) => {
            try {
                console.log(`🔍 Processing Event ${index}:`, event);

                // ✅ Correct property access
                const eventId = event.eventId; 
                const eventName = event.eventName;
                const eventDate = event.eventDate;
                const eventLocation = event.eventLocation;
                const availableTickets = event.availableTickets;
                const isActive = event.status;

                // ✅ Ensure price is a string before conversion
                const priceInEther = window.web3.utils.fromWei(String(event.price), "ether");

                const availability = availableTickets > 0 ? "Available" : "Sold Out";

                // ✅ Construct event row in HTML
                const row = `
                    <tr>
                        <td>${eventId}</td>
                        <td>${eventName}</td>
                        <td>${eventDate}</td>
                        <td>${eventLocation}</td>
                        <td>${priceInEther} ETH</td>
                        <td>${availability}</td>
                        <td>
                            <button class="btn btn-primary" onclick="navigateToEvent(${eventId})">View Details</button>
                        </td>
                    </tr>
                `;
                ticketTableBody.innerHTML += row;
            } catch (error) {
                console.error(`❌ Error processing event ${index}:`, event, error);
            }
        });

        console.log("✅ Events displayed successfully.");
    } catch (error) {
        console.error("❌ Error loading events:", error);
        ticketTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading events. Please try again.</td></tr>`;
    }
}


// **Navigate to Ticket Details**
function navigateToEvent(ticketId) {
    window.location.href = `ticketdataview.html?eventId=${ticketId}`;
}

// **Ensure Tickets Load Properly on Page Load with Delay**
window.onload = async () => {
    console.log("🔹 Window fully loaded, initializing Web3...");
    await initializeWeb3();

    setTimeout(async () => {
        await initializeContract();
        await loadTickets();
    }, 500); // Short delay to ensure initialization
};



// Create Ticket
async function createTicket() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const price = web3.utils.toWei(document.getElementById("price").value, "ether");
    const metadataURI = document.getElementById("metadataURI").value;

    try {
        await contract.methods
            .createTicket(eventName, eventDate, eventLocation, price, metadataURI)
            .send({ from: currentAccount });

        alert("Ticket created successfully!");
        window.location.href = "ticketview.html";
    } catch (error) {
        console.error("Error creating ticket:", error);
    }
}

// On Page Load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await initializeWeb3();
        await initializeContract();
        await updateWalletDisplay(); // Update wallet display on page load
        await loadTickets(); // Load all tickets
    } catch (error) {
        console.error("❌ Error initializing page:", error);
    }
});
