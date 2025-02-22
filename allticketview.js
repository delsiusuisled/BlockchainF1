document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    await initializeContract();
    await loadAllTickets();
});

// Pagination Variables
let totalPages = 1;
let allTickets = [];
let filteredTickets = [];


// Initialize Web3
async function initializeWeb3() {
    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    try {
        window.web3 = new Web3(window.ethereum);
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        console.log("✅ Wallet connected:", window.currentAccount);
    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}

// Initialize Contract
async function initializeContract() {
    try {
        if (!window.web3) {
            console.error("❌ Web3 not initialized. Retrying...");
            await initializeWeb3();
        }

        if (!window.web3 || !window.web3.eth) {
            console.error("❌ Web3 initialization failed. Ensure MetaMask is connected.");
            return;
        }

        if (!window.contract) {
            window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
            console.log("🔹 Contract initialized.");
        }
    } catch (error) {
        console.error("❌ Error initializing contract:", error);
    }
}

// Load All Tickets and Implement Pagination
async function loadAllTickets() {
    const tableBody = document.getElementById("allTicketsTable");
    const pageInfo = document.getElementById("pageInfo");

    if (!tableBody || !pageInfo) {
        console.error("❌ Ticket table or pagination elements not found.");
        return;
    }

    try {
        // Fetch all events from contract
        const events = await window.contract.methods.getAllEvents().call();

        // Fetch all tickets for each event
        allTickets = [];
        for (const event of events) {
            const tickets = await window.contract.methods.getTicketsForEvent(event.eventId).call();
            allTickets = [...allTickets, ...tickets];
        }

        // ✅ Sort tickets by Ticket ID (ascending order)
        allTickets.sort((a, b) => a.ticketId - b.ticketId);
        filteredTickets = allTickets; // Initially, filteredTickets contains all tickets

        // ✅ Calculate Total Pages
        totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
        if (totalPages < 1) totalPages = 1;

        // ✅ Render First Page
        renderTickets();

        console.log("📢 Retrieved and sorted tickets:", allTickets);
    } catch (error) {
        console.error("❌ Error loading tickets:", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Error loading tickets. Please try again</td></tr>`;
    }
}

// Render Paginated Tickets
function renderTickets() {
    const tableBody = document.getElementById("allTicketsTable");
    const pageInfo = document.getElementById("pageInfo");

    tableBody.innerHTML = "";

    if (filteredTickets.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">No tickets found</td></tr>`;
        return;
    }

    // ✅ Calculate Indexes for Pagination
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = Math.min(startIndex + ticketsPerPage, filteredTickets.length);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    // ✅ Populate Table with Current Page Data
    paginatedTickets.forEach(ticket => {
        const owner = ticket.currentOwner === "0x0000000000000000000000000000000000000000" ? "Available" : ticket.currentOwner;
        const status = ticket.isForSale ? "For Sale" : (ticket.isForResale ? "Resale" : "Owned");
        const priceETH = window.web3.utils.fromWei(ticket.price, "ether");

        const row = `
            <tr>
                <td>${ticket.ticketId}</td>
                <td>${ticket.eventName}</td>
                <td>${ticket.eventDate}</td>
                <td>${ticket.eventLocation}</td>
                <td>${owner}</td>
                <td>${priceETH} ETH</td>
                <td>${status}</td>
            </tr>`;
        tableBody.innerHTML += row;
    });

    // ✅ Update Page Info
    pageInfo.innerHTML = `Page ${currentPage} of ${totalPages}`;
}

// **Search Functionality**
function searchTickets() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    filteredTickets = allTickets.filter(ticket =>
        ticket.ticketId.toString().includes(query) ||
        ticket.eventName.toLowerCase().includes(query) ||
        ticket.eventDate.toLowerCase().includes(query) ||
        ticket.eventLocation.toLowerCase().includes(query) ||
        ticket.currentOwner.toLowerCase().includes(query) ||
        window.web3.utils.fromWei(ticket.price, "ether").includes(query) ||
        (ticket.isForSale ? "for sale" : ticket.isForResale ? "resale" : "owned").includes(query)
    );

    // ✅ Reset Pagination
    currentPage = 1;
    totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    if (totalPages < 1) totalPages = 1;

    // ✅ Render Filtered Results
    renderTickets();
}

// **Pagination Controls**
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTickets();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderTickets();
    }
});

// **Search Button Event Listener**
document.getElementById("searchButton").addEventListener("click", searchTickets);
