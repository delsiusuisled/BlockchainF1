const ADMIN_ACCOUNT = "0x39022f2935339Ff128e2917AFF08867098Fffc4e"; // Admin account for privileged actions
let isEventsLoaded = false;

// Initialize Web3
async function initializeWeb3() {
    console.log("🔹 Initializing Web3...");

    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        return;
    }

    window.web3 = new Web3(window.ethereum); // Ensure Web3 is globally assigned

    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        sessionStorage.setItem("connectedWallet", window.currentAccount);
        console.log("✅ Wallet connected:", window.currentAccount);

        // ✅ Ensure Web3 is properly initialized before continuing
        if (!window.web3 || !window.web3.utils) {
            console.error("❌ Web3 is not properly initialized.");
            alert("⚠️ Web3 initialization failed. Refresh the page and try again.");
            return;
        }

        await initializeContract();
        await updateWalletDisplay();
    } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
    }
}




// ✅ Initialize Smart Contract
async function initializeContract() {
    if (!window.web3) await initializeWeb3();

    if (!window.contract) {
        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("🔹 Contract initialized.");
    }
}

async function fetchAllEvents() {
    try {
        // Ensure Web3 and contract are initialized before making calls
        if (!window.web3) await initializeWeb3();
        if (!window.contract) await initializeContract();

        if (!window.contract) {
            console.error("❌ Contract is still not initialized. Aborting fetch.");
            return [];
        }

        // Fetch events from the contract
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



// ✅ Admin Check Using Constant
function isAdmin() {
    return window.currentAccount && window.currentAccount.toLowerCase() === ADMIN_ACCOUNT.toLowerCase();
}

// ✅ Enforce Admin Privileges Before Performing Actions
async function enforceAdminPrivileges() {
    if (!isAdmin()) {
        alert("⚠️ Only the admin can perform this action.");
        throw new Error("Unauthorized action: Admin privileges required.");
    }
}

// Update Wallet Address in Navbar
async function updateWalletDisplay() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            const walletDisplayElement = document.getElementById("walletAddressDisplay");
            walletDisplayElement.textContent = `Connected Wallet: ${accounts[0]}`;
        } else {
            console.warn("No wallet connected.");
        }
    } catch (error) {
        console.error("Error updating wallet display:", error);
    }
}

function redirectToUpdatePage(eventId) {
    window.location.href = `eventupdate.html?eventId=${eventId}`;
}

// ✅ Load Events into Table
async function loadEvents() {
    console.log("✅ Running loadEvents...");

    const eventTableBody = document.getElementById("eventTableBody");
    if (!eventTableBody) {
        console.error("❌ Event table not found.");
        return;
    }

    eventTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Loading events, please wait...</td></tr>`;

    try {
        if (!window.web3) await initializeWeb3();
        if (!window.contract) await initializeContract();

        if (!window.contract) {
            console.error("❌ Contract not initialized. Cannot load events.");
            eventTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading events.</td></tr>`;
            return;
        }

        const events = await fetchAllEvents();
        console.log("✅ Raw Events Data:", events);

        if (!Array.isArray(events) || events.length === 0) {
            console.warn("⚠️ No valid events found.");
            eventTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No events available.</td></tr>`;
            return;
        }

        eventTableBody.innerHTML = ""; // Clear table

        events.forEach((event, index) => {
            try {
                console.log(`🔍 Processing Event ${index}:`, event);

                let eventPrice = event.price; 
                if (typeof eventPrice !== "undefined" && window.web3 && window.web3.utils) {
                    eventPrice = `${window.web3.utils.fromWei(eventPrice, "ether")} ETH`;
                } else {
                    console.warn(`⚠️ Event ${index} has an invalid price value:`, eventPrice);
                    eventPrice = "N/A";
                }

                const availability = event.availableTickets > 0 ? "Available" : "Sold Out";

                const row = `
                <tr>
                    <td>${event.eventId}</td>
                    <td>${event.eventName}</td>
                    <td>${event.eventDate}</td>
                    <td>${event.eventLocation}</td>
                    <td>${eventPrice}</td>
                    <td>${availability}</td>
                    <td>${event.availableTickets}</td>
                </tr>
                `;
                eventTableBody.innerHTML += row;
            } catch (error) {
                console.error(`❌ Error processing event ${index}:`, event, error);
            }
        });

        console.log("✅ Events displayed successfully.");
    } catch (error) {
        console.error("❌ Error loading events:", error);
        eventTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading events. Please try again.</td></tr>`;
    }
}

window.onload = async () => {
    console.log("🔹 Window fully loaded, initializing Web3...");
    await initializeWeb3();

    setTimeout(async () => {
        await initializeContract();
        await loadEvents();
    }, 500); // Delay to ensure elements are ready
};



function updatePaginationDisplay(currentPage, totalPages) {
    const currentPageDisplay = document.getElementById("currentPageDisplay");
    currentPageDisplay.textContent = `Page ${currentPage} of ${totalPages}`;
}



// Function to change pages
window.changePage = function (direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1; // Ensure the page number doesn't go below 1
    loadEvents(); // Reload events with the updated page
};

// ✅ Create Event
async function createEvent() {
    try {
        await initializeWeb3(); // Ensure Web3 is initialized
        await initializeContract(); // Ensure contract is initialized

        enforceAdminPrivileges();

        // ✅ Ensure Web3 is initialized before using it
        if (!window.web3 || !window.web3.utils) {
            console.error("❌ Web3 is not properly initialized.");
            alert("⚠️ Web3 is not initialized. Please ensure MetaMask is connected.");
            return;
        }

        // ✅ Retrieve values from form
        const eventName = document.getElementById("eventName").value.trim();
        const eventDate = document.getElementById("eventDate").value.trim();
        const eventLocation = document.getElementById("eventLocation").value.trim();
        const price = document.getElementById("price").value.trim();
        const availableTickets = document.getElementById("availableTickets").value.trim();

        // ✅ Validate inputs
        if (!eventName || !eventDate || !eventLocation || !price || !availableTickets) {
            alert("⚠️ All fields must be filled.");
            return;
        }

        if (isNaN(price) || Number(price) <= 0) {
            alert("⚠️ Price must be a valid positive number.");
            return;
        }

        if (isNaN(availableTickets) || availableTickets <= 0) {
            alert("⚠️ Available tickets must be a valid number.");
            return;
        }

        // ✅ Convert price to Wei safely
        let priceInWei;
        try {
            priceInWei = window.web3.utils.toWei(price.toString(), "ether");
        } catch (conversionError) {
            console.error("❌ Failed to convert price to Wei:", conversionError);
            alert("⚠️ Invalid price format.");
            return;
        }

        // ✅ Send transaction to the smart contract
        console.log("🔹 Sending transaction to create event:", {
            eventName,
            eventDate,
            eventLocation,
            priceInWei,
            availableTickets,
        });

        const tx = await window.contract.methods.createEvent(
            eventName,
            eventDate,
            eventLocation,
            priceInWei,
            availableTickets
        ).send({ from: window.currentAccount });

        console.log("✅ Event created successfully:", tx);

        alert("✅ Event created successfully!");
        window.location.href = "eventview.html"; // Redirect to event list
    } catch (error) {
        console.error("❌ Error creating event:", error);
        alert(`⚠️ Failed to create event: ${error.message}`);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔹 DOM Content Loaded: Initializing Web3...");

    await initializeWeb3(); // ✅ Ensure Web3 is initialized before any button click
    await initializeContract();

    const createEventButton = document.getElementById("createEventButton");

    if (createEventButton) {
        createEventButton.addEventListener("click", async () => {
            await createEvent();
        });
    } else {
        console.warn("⚠️ 'createEventButton' not found in the DOM.");
    }
});


// ✅ Update Event
async function updateEvent() {
    try {
        enforceAdminPrivileges();

        // ✅ Retrieve values from the form
        const eventId = document.getElementById("eventId").value.trim();
        const eventName = document.getElementById("eventName").value.trim();
        const eventDate = document.getElementById("eventDate").value.trim();
        const eventLocation = document.getElementById("eventLocation").value.trim();
        const price = document.getElementById("price").value.trim();
        const availableTickets = document.getElementById("availableTickets").value.trim();

        // ✅ Basic validation
        if (!eventId || isNaN(eventId)) {
            alert("⚠️ Please provide a valid event ID.");
            return;
        }
        if (!eventName || eventName.length === 0) {
            alert("⚠️ Event name cannot be empty.");
            return;
        }
        if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
            alert("⚠️ Event date must be in YYYY-MM-DD format.");
            return;
        }
        if (!eventLocation || eventLocation.length === 0) {
            alert("⚠️ Event location cannot be empty.");
            return;
        }
        if (!price || isNaN(price) || Number(price) <= 0) {
            alert("⚠️ Price must be a valid number greater than zero.");
            return;
        }
        if (!availableTickets || isNaN(availableTickets) || availableTickets <= 0 || availableTickets > 100000) {
            alert("⚠️ Available tickets must be a valid number between 1 and 100,000.");
            return;
        }

        // ✅ Convert price to Wei (required for Ethereum transactions)
        const priceInWei = web3.utils.toWei(price.toString(), "ether");

        // ✅ Send transaction to the smart contract
        console.log("🔹 Sending transaction to update event:", eventId, eventName, eventDate, eventLocation, priceInWei, availableTickets);
        
        await contract.methods.updateEvent(
            eventId, 
            eventName, 
            eventDate, 
            eventLocation, 
            priceInWei, 
            availableTickets
        ).send({ from: currentAccount });

        alert("✅ Event updated successfully!");
        window.location.href = "eventview.html"; // Redirect back to event list
    } catch (error) {
        console.error("❌ Failed to update event:", error);
        alert(`⚠️ Error updating event: ${error.message}`);
    }
}

// ✅ Attach updateEvent() to the button
document.addEventListener("DOMContentLoaded", () => {
    const updateEventButton = document.getElementById("updateEventButton");
    if (updateEventButton) {
        updateEventButton.addEventListener("click", updateEvent);
    } else {
        console.warn("⚠️ 'updateEventButton' not found in the DOM.");
    }
});


// Delete Event
async function deleteEvent(eventId) {
    alert("❌ Event deletion is not allowed.");
    console.warn(`⚠️ Event ID ${eventId} cannot be deleted.`);
}


// Attach event listeners to the delete buttons
document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    await initializeContract();

    // Load events without attaching delete listeners
    await loadEvents();
});





// Load Tickets
async function loadTickets() {
    const ticketTableBody = document.getElementById("ticketsTableBody");
    if (!ticketTableBody) return;

    try {
        const ticketCount = await contract.methods.ticketCount().call();
        ticketTableBody.innerHTML = "";

        for (let i = 1; i <= ticketCount; i++) {
            const ticket = await contract.methods.getTicket(i).call();
            const priceETH = web3.utils.fromWei(ticket[5], "ether");
            const ticketStatus = ticket[7] ? "Expired" : "Available";

            const row = `
                <tr>
                    <td>${ticket[0]}</td>
                    <td>${ticket[1]}</td>
                    <td>${ticket[2]}</td>
                    <td>${ticket[3]}</td>
                    <td>${priceETH} ETH</td>
                    <td>${ticketStatus}</td>
                    <td>
                        <button class="btn btn-primary btn-sm purchaseButton" data-ticket-id="${ticket[0]}">Purchase</button>
                    </td>
                </tr>
            `;
            ticketTableBody.innerHTML += row;
        }

        // Attach event listeners to purchase buttons
        document.querySelectorAll(".purchaseButton").forEach((button) => {
            button.addEventListener("click", (event) => {
                const ticketId = event.target.getAttribute("data-ticket-id");
                purchaseTicket(ticketId);
            });
        });
    } catch (error) {
        console.error("Error loading tickets:", error);
    }
}

// Purchase Ticket
async function purchaseTicket(ticketId) {
    try {
        await contract.methods.purchaseTicket(ticketId).send({ from: currentAccount });
        alert("Ticket purchased successfully!");
        await loadTickets();
    } catch (error) {
        console.error("Error purchasing ticket:", error);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    await initializeWeb3();
    await initializeContract();

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");

    console.log("📋 Event ID from URL:", eventId); // Debugging

    try {
        // Load tickets from localStorage
        const storedTickets = JSON.parse(localStorage.getItem("presetTickets")) || [];

        // Find the specific event by ID
        const eventDetails = storedTickets.find(event => event.id == eventId);


        console.log("📋 Event Details Found:", eventDetails); // Debugging

        // Populate the form with event details
        document.getElementById("eventId").value = eventDetails.id; // Use `id`
        document.getElementById("eventName").value = eventDetails.name; // Use `name`
        document.getElementById("eventDate").value = eventDetails.date; // Use `date`
        document.getElementById("eventLocation").value = eventDetails.location; // Use `location`
        document.getElementById("price").value = web3.utils.fromWei(eventDetails.price, "ether"); // Convert Wei to ETH
        document.getElementById("availableTickets").value = eventDetails.quantity; // Display as integer
        
        console.log("✅ Form populated with event data.");
    } catch (error) {
    }
});



