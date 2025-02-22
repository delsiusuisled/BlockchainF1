// Initialize Web3
async function initializeWeb3() {
    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    web3 = new Web3(window.ethereum);

    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        console.log("✅ Wallet connected:", window.currentAccount);
    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}

// Initialize Contract
async function initializeContract() {
    if (!web3) await initializeWeb3();
    if (!window.contract) {
        window.contract = new web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("🔹 Contract initialized.");
    }
}

// Load Ownership Records for a Ticket
async function loadOwnershipRecords() {
    const ownerRecordTable = document.getElementById("ownerRecordTable");
    if (!ownerRecordTable) {
        console.error("❌ Owner record table not found.");
        return;
    }

    try {
        // Get eventId and ticketId from URL
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("eventId");
        const ticketId = urlParams.get("ticketId");

        if (!eventId || !ticketId) {
            alert("⚠️ Missing eventId or ticketId in URL.");
            //window.location.href = "ticketview.html";
            return;
        }

        // Fetch ticket details from blockchain
        const ticket = await window.contract.methods.tickets(ticketId).call();
        const resaleHistory = await window.contract.methods.getResaleHistory(ticketId).call();

        // Clear existing table content
        ownerRecordTable.innerHTML = "";

        // Handle no resale history case
        if (resaleHistory.length < 2) {
            ownerRecordTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No transaction history available for this ticket
                    </td>
                </tr>
            `;
            return;
        }

        // Display all ownership transfers
        for (let i = 0; i < resaleHistory.length - 1; i++) {
            const previousOwner = resaleHistory[i];
            const currentOwner = resaleHistory[i + 1];

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${ticketId}</td>
                <td>${ticket.eventName}</td>
                <td>${ticket.eventDate}</td>
                <td>${ticket.eventLocation}</td>
                <td>${previousOwner}</td>
                <td>${currentOwner}</td>
            `;
            ownerRecordTable.appendChild(row);
        }

        console.log(`✅ Displayed ${resaleHistory.length - 1} transfers for ticket ${ticketId}`);

    } catch (error) {
        console.error("❌ Error loading ownership records:", error);
        ownerRecordTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    Error loading ownership records. Please try again
                </td>
            </tr>
        `;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    await initializeContract();
    await loadOwnershipRecords();
});
