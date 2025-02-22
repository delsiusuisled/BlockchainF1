//this is a place where i store some codes, ignore this file

//original ticketdata.js with delete (dont make sense)


// // Initialize Web3
// async function initializeWeb3() {
//     if (typeof window.ethereum === "undefined") {
//         alert("⚠️ MetaMask is not installed. Please install it.");
//         return;
//     }

//     web3 = new Web3(window.ethereum);

//     try {
//         const accounts = await ethereum.request({ method: "eth_requestAccounts" });
//         currentAccount = accounts[0];
//         console.log("✅ Wallet connected:", currentAccount);
//     } catch (error) {
//         console.error("❌ Failed to connect wallet:", error);
//     }
// }

// // Validate and Fetch Preset Tickets
// function getPresetTicketsFromStorage() {
//     const storedTicketData = JSON.parse(localStorage.getItem("presetTickets"));
//     console.log("🎟️ Retrieved presetTickets from localStorage:", storedTicketData);
//     if (!storedTicketData || !Array.isArray(storedTicketData)) {
//         console.warn("⚠️ No valid presetTickets found in localStorage. Initializing with an empty array.");
//         return [];
//     }
//     return storedTicketData;
// }

// // Save tickets to JSON storage
// function savePresetTicketsToStorage(tickets) {
//     localStorage.setItem("presetTickets", JSON.stringify(tickets));
// }

// // Load Tickets for a Specific Event from JSON Storage
// async function loadTicketsForEvent(eventId) {
//     const ticketDataTable = document.getElementById("ticketDataTable");
//     const eventTitle = document.getElementById("eventTitle");

//     if (!ticketDataTable || !eventTitle) {
//         console.error("❌ Required elements for tickets not found.");
//         return;
//     }

//     try {
//         // Fetch ticket data from localStorage
//         const storedTicketData = getPresetTicketsFromStorage();

//         // Filter tickets by the provided eventId
//         const eventTickets = storedTicketData.filter(ticket => String(ticket.id) === String(eventId));
//         console.log(`🎟️ Tickets for Event ID ${eventId}:`, eventTickets);

//         // Check if tickets for the event exist
//         if (eventTickets.length > 0) {
//             eventTitle.textContent = `Tickets for ${eventTickets[0].name}`;
//         } else {
//             console.warn("⚠️ No tickets found for this event.");
//             eventTitle.textContent = `No tickets available for Event ID: ${eventId}`;
//             ticketDataTable.innerHTML = `<tr><td colspan="8" class="text-center">No tickets found for this event.</td></tr>`;
//             return;
//         }

//         // Clear the existing table rows
//         ticketDataTable.innerHTML = "";

//         // Use DocumentFragment for efficient DOM manipulation
//         const fragment = document.createDocumentFragment();

//         // Loop through each ticket and generate rows based on the quantity
//         eventTickets.forEach(ticket => {
//             const owner = ticket.owner || "N/A"; // Default owner to "N/A" if not set
//             const status = owner === "N/A" ? "Available" : "Bought"; // Check owner for status

//             // Create rows for each ticket based on quantity
//             for (let i = 0; i < ticket.quantity; i++) {
//                 const ticketId = `${ticket.id}-${i + 1}`; // Generate unique ID for each ticket instance

//                 const row = document.createElement("tr");
//                 row.setAttribute("data-ticket-id", ticketId); // Add a unique identifier
//                 row.innerHTML = `
//                     <td>${ticketId}</td>
//                     <td>${ticket.name}</td>
//                     <td>${ticket.date}</td>
//                     <td>${ticket.location}</td>
//                     <td>${owner}</td>
//                     <td>${web3.utils.fromWei(ticket.price, "ether")} ETH</td>
//                     <td>${status}</td>
//                     <td>
//                         <button class="btn btn-primary view-button" onclick="viewTransaction('${ticketId}')">View Details</button>
//                         <button class="btn btn-danger delete-button" data-ticket-id="${ticketId}">Delete</button>
//                     </td>
//                 `;
//                 fragment.appendChild(row);
//             }
//         });

//         // Append all rows at once for performance
//         ticketDataTable.appendChild(fragment);
//         console.log(`✅ Loaded ${eventTickets.length} tickets for eventId: ${eventId}`);
//     } catch (error) {
//         console.error("❌ Error loading tickets for event:", error);
//         ticketDataTable.innerHTML = `<tr><td colspan="9" class="text-center">Error loading tickets. Please try again.</td></tr>`;
//     }
// }


// // Function to create a new ticket
// function createNewTicket(eventId) {
//     const storedTicketData = getPresetTicketsFromStorage();

//     // Filter tickets for the given event ID
//     const eventTickets = storedTicketData.filter(ticket => String(ticket.id) === String(eventId));

//     if (!eventTickets.length) {
//         alert("⚠️ No tickets found for this event. Cannot create a new ticket.");
//         return;
//     }

//     // Retrieve the current quantity and calculate the new ticket ID
//     const originalQuantity = parseInt(localStorage.getItem(`originalQuantity-${eventId}`), 10) || eventTickets[0].quantity;
//     const newTicketId = originalQuantity + 1;

//     // Prompt user for confirmation
//     if (confirm(`Do you want to create a new ticket with ID ${newTicketId}?`)) {
//         // Create a new ticket object
//         const newTicket = {
//             id: eventId,
//             ticketID: newTicketId,
//             name: eventTickets[0].name,
//             date: eventTickets[0].date,
//             location: eventTickets[0].location,
//             owner: "N/A",
//             price: eventTickets[0].price,
//             status: "Available",
//         };

//         // Increment the quantity for the event
//         eventTickets[0].quantity += 1;

//         // Update the originalQuantity
//         localStorage.setItem(`originalQuantity-${eventId}`, newTicketId);

//         // Add the new ticket to localStorage
//         storedTicketData.push(newTicket);
//         savePresetTicketsToStorage(storedTicketData);

//         alert(`✅ Ticket with ID ${newTicketId} created successfully!`);
//         loadTicketsForEvent(eventId);
//     }
// }

// // Function to delete a specific ticket by ticket ID (quantity-based)
// function deleteTicket(ticketId, eventId) {
//     let storedTicketData = getPresetTicketsFromStorage();

//     // Find the ticket to delete based on the specific ticket ID
//     const ticketToDelete = storedTicketData.find(ticket => `${ticket.id}-${ticket.ticketID}` === ticketId);

//     if (!ticketToDelete) {
//         alert("⚠️ Ticket not found!");
//         return;
//     }

//     // Remove the ticket from storage
//     storedTicketData = storedTicketData.filter(ticket => `${ticket.id}-${ticket.ticketID}` !== ticketId);

//     // Update the quantity for the event in storage
//     const eventTickets = storedTicketData.filter(ticket => ticket.id === ticketToDelete.id);
//     if (eventTickets.length > 0) {
//         eventTickets[0].quantity = Math.max(eventTickets[0].quantity - 1, 0); // Ensure it doesn't go below 0
//     }

//     // Save updated tickets back to storage
//     savePresetTicketsToStorage(storedTicketData);

//     // Remove the ticket row from the table
//     const ticketRow = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
//     if (ticketRow) {
//         ticketRow.remove();
//     }

//     alert(`🗑️ Ticket ID ${ticketId} deleted successfully!`);
// }

// // Function to load tickets for a specific event
// async function loadTicketsForEvent(eventId) {
//     const ticketDataTable = document.getElementById("ticketDataTable");
//     const eventTitle = document.getElementById("eventTitle");

//     if (!ticketDataTable || !eventTitle) {
//         console.error("❌ Required elements for tickets not found.");
//         return;
//     }

//     try {
//         // Fetch ticket data from localStorage
//         const storedTicketData = getPresetTicketsFromStorage();

//         // Filter tickets by the provided eventId
//         const eventTickets = storedTicketData.filter(ticket => String(ticket.id) === String(eventId));
//         console.log(`🎟️ Tickets for Event ID ${eventId}:`, eventTickets);

//         // Check if tickets for the event exist
//         if (eventTickets.length > 0) {
//             eventTitle.textContent = `Tickets for ${eventTickets[0].name}`;
//         } else {
//             console.warn("⚠️ No tickets found for this event.");
//             eventTitle.textContent = `No tickets available for Event ID: ${eventId}`;
//             ticketDataTable.innerHTML = `<tr><td colspan="8" class="text-center">No tickets found for this event.</td></tr>`;
//             return;
//         }

//         // Clear the existing table rows
//         ticketDataTable.innerHTML = "";

//         // Use DocumentFragment for efficient DOM manipulation
//         const fragment = document.createDocumentFragment();

//         // Loop through each ticket and generate rows based on the quantity
//         eventTickets.forEach(ticket => {
//             const owner = ticket.owner || "N/A"; // Default owner to "N/A" if not set
//             const status = owner === "N/A" ? "Available" : "Bought"; // Check owner for status

//             // Create rows for each ticket based on quantity
//             for (let i = 0; i < ticket.quantity; i++) {
//                 const ticketId = `${ticket.id}-${i + 1}`; // Generate unique ID for each ticket instance

//                 const row = document.createElement("tr");
//                 row.setAttribute("data-ticket-id", ticketId); // Add a unique identifier
//                 row.innerHTML = `
//                     <td>${ticketId}</td>
//                     <td>${ticket.name}</td>
//                     <td>${ticket.date}</td>
//                     <td>${ticket.location}</td>
//                     <td>${owner}</td>
//                     <td>${web3.utils.fromWei(ticket.price, "ether")} ETH</td>
//                     <td>${status}</td>
//                     <td>
//                         <button class="btn btn-primary view-button" onclick="viewTransaction('${ticketId}')">View Details</button>
//                         <button class="btn btn-danger delete-button" data-ticket-id="${ticketId}">Delete</button>
//                     </td>
//                 `;
//                 fragment.appendChild(row);
//             }
//         });

//         // Append all rows at once for performance
//         ticketDataTable.appendChild(fragment);
//         console.log(`✅ Loaded ${eventTickets.length} tickets for eventId: ${eventId}`);
//     } catch (error) {
//         console.error("❌ Error loading tickets for event:", error);
//         ticketDataTable.innerHTML = `<tr><td colspan="9" class="text-center">Error loading tickets. Please try again.</td></tr>`;
//     }
// }

// // Event listener for both create and delete buttons
// document.addEventListener("DOMContentLoaded", () => {
//     const createTicketButton = document.getElementById("createTicketBtn");
//     const ticketDataTable = document.getElementById("ticketDataTable");
//     const urlParams = new URLSearchParams(window.location.search);
//     const eventId = urlParams.get("eventId");

//     if (createTicketButton && eventId) {
//         createTicketButton.addEventListener("click", () => {
//             createNewTicket(eventId);
//         });
//     }

//     // Add event listener for delete button within the table
//     ticketDataTable.addEventListener("click", (event) => {
//         if (event.target.classList.contains("delete-button")) {
//             const ticketId = event.target.getAttribute("data-ticket-id");
//             if (confirm(`❌ Are you sure you want to delete Ticket ID ${ticketId}? This action cannot be undone.`)) {
//                 deleteTicket(ticketId, eventId);
//             }
//         }
//     });
// });

// // Redirect to ticket owner details page
// function viewTransaction(ticketId) {
//     window.location.href = `ticketownerrecordview.html?ticketId=${ticketId}`;
// }

// // On Page Load
// document.addEventListener("DOMContentLoaded", async () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const eventId = urlParams.get("eventId");

//     if (eventId) {
//         await initializeWeb3();
//         await loadTicketsForEvent(eventId);
//     } else {
//         console.error("❌ Event ID not found in URL.");
//         const eventTitle = document.getElementById("eventTitle");
//         if (eventTitle) {
//             eventTitle.textContent = "Event not found.";
//         }
//     }
// });
