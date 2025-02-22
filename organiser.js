const ADMIN_ACCOUNT = "0x39022f2935339Ff128e2917AFF08867098Fffc4e";
let isWeb3Initialized = false;

async function initializeWeb3() {
    if (!window.ethereum) {
        console.error("MetaMask or Web3 provider not detected.");
        alert("Please install MetaMask from https://metamask.io/");
        return;
    }

    web3 = new Web3(window.ethereum);

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            console.log("Web3 initialized. Connected wallet:", currentAccount);

            sessionStorage.setItem("connectedWallet", currentAccount);
            isWeb3Initialized = true;
        } else {
            console.warn("No accounts returned by MetaMask.");
            alert("Please connect your wallet.");
        }
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Wallet connection is required.");
    }
}

async function initializeContract() {
    if (!isWeb3Initialized) {
        await initializeWeb3();
    }

    if (!contract) {
        console.log("Initializing Contract...");
        contract = new web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("Contract initialized:", contract);
    }
}

async function isAdmin() {
    if (!currentAccount) {
        await updateWalletDisplay();
    }
    return currentAccount === ADMIN_ACCOUNT;
}

async function enforceAdminPrivileges(actionName) {
    const isAdminAccount = await isAdmin();
    if (!isAdminAccount) {
        alert(`Only the admin (${ADMIN_ACCOUNT}) can ${actionName}.`);
        throw new Error(`Unauthorized access attempt to ${actionName}`);
    }
}

async function updateWalletDisplay() {
    if (!isWeb3Initialized) {
        await initializeWeb3();
    }

    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts.length > 0 ? accounts[0] : null;

    if (currentAccount) {
        sessionStorage.setItem("connectedWallet", currentAccount);
    }

    const walletDisplayElement = document.getElementById("walletAddressDisplay");
    if (currentAccount && walletDisplayElement) {
        walletDisplayElement.textContent = `Connected Wallet: ${currentAccount}`;
        console.log("Wallet display updated:", currentAccount);
    } else {
        console.error("No wallet connected or display element not found.");
    }
}

function isValidEthereumAddress(address) {
    return web3.utils.isAddress(address);
}

async function loadOrganizers() {
    const organizerTableBody = document.getElementById("organizerTableBody");
    if (!organizerTableBody) {
        console.warn("organizerTableBody element not found. Skipping loadOrganizers.");
        return;
    }

    try {
        await initializeContract();
        await updateWalletDisplay();

        const ORGANIZER_ROLE = web3.utils.keccak256("ORGANIZER_ROLE");
        const organizerCount = await contract.methods.getRoleMemberCount(ORGANIZER_ROLE).call();

        organizerTableBody.innerHTML = "";

        for (let i = 0; i < organizerCount; i++) {
            const organizerAddress = await contract.methods.getRoleMember(ORGANIZER_ROLE, i).call();
            const organizerFullName = await contract.methods.getOrganizerFullName(organizerAddress).call();

            const row = `
                <tr>
                    <td>${organizerFullName}</td>
                    <td>${organizerAddress}</td>
                    <td>
                        <button class="btn btn-warning btn-sm updateButton" 
                                data-address="${organizerAddress}" 
                                data-fullname="${organizerFullName}">
                            Update
                        </button>
                        <button class="btn btn-danger btn-sm deleteButton" data-address="${organizerAddress}">
                            Delete
                        </button>
                    </td>
                </tr>`;
            organizerTableBody.innerHTML += row;
        }

        // If user is not an admin, hide action buttons
        const isAdminAccount = await isAdmin();
        if (!isAdminAccount) {
            document.querySelectorAll(".updateButton, .deleteButton").forEach(button => {
                button.style.display = "none";
            });
        }
    } catch (error) {
        console.error("Error loading organizers:", error);
    }
}

window.ethereum.on("accountsChanged", async (accounts) => {
    currentAccount = accounts.length > 0 ? accounts[0] : null;
    console.log("Wallet changed. Connected wallet:", currentAccount);

    sessionStorage.setItem("connectedWallet", currentAccount || "");
    await updateWalletDisplay();
});

async function addOrganizer(organizerFullName, organizerAddress) {
    await enforceAdminPrivileges("add organizers");

    if (!isValidEthereumAddress(organizerAddress)) {
        alert("Invalid Ethereum address. Please enter a valid address.");
        return;
    }

    try {
        console.log("Adding organizer:", organizerFullName, organizerAddress);
        await contract.methods.addOrganizer(organizerFullName, organizerAddress).send({ from: currentAccount });
        alert("Organizer added successfully!");
        await loadOrganizers();
    } catch (error) {
        console.error("Error adding organizer:", error);
    }
}

async function deleteOrganizer(organizerAddress) {
    await enforceAdminPrivileges("delete organizers");

    try {
        console.log("Deleting organizer:", organizerAddress);
        await contract.methods.removeOrganizer(organizerAddress).send({ from: currentAccount });
        alert("Organizer deleted successfully!");
        await loadOrganizers();
    } catch (error) {
        console.error("Error deleting organizer:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const storedAccount = sessionStorage.getItem("connectedWallet");
    if (storedAccount) {
        currentAccount = storedAccount;
        console.log("Using stored wallet:", currentAccount);
    } else {
        await initializeWeb3();
    }

    await initializeContract();
    await updateWalletDisplay();

    const currentPath = window.location.pathname;

    if (currentPath.endsWith("organiserview.html")) {
        await loadOrganizers();

        document.getElementById("organizerTableBody").addEventListener("click", async (event) => {
            if (event.target.classList.contains("updateButton")) {
                const organizerAddress = event.target.dataset.address;
                const organizerFullName = event.target.dataset.fullname;

                sessionStorage.setItem("updateOrganizerAddress", organizerAddress);
                sessionStorage.setItem("updateOrganizerFullName", organizerFullName);

                window.location.href = "organiserupdate.html";
            }

            if (event.target.classList.contains("deleteButton")) {
                const organizerAddress = event.target.dataset.address;
                if (confirm(`Are you sure you want to delete organizer: ${organizerAddress}?`)) {
                    await deleteOrganizer(organizerAddress);
                }
            }
        });
    }

    if (currentPath.endsWith("organisercreate.html")) {
        const createOrganizerButton = document.getElementById("createOrganizerButton");
        if (createOrganizerButton) {
            createOrganizerButton.addEventListener("click", async () => {
                const organizerFullName = document.getElementById("organizerFullName").value.trim();
                const organizerAddress = document.getElementById("organizerAddress").value.trim();

                if (!organizerFullName || !organizerAddress) {
                    alert("Please enter both Organizer Full Name and Address.");
                    return;
                }

                await addOrganizer(organizerFullName, organizerAddress);
            });
        }
    }

    if (currentPath.endsWith("organiserupdate.html")) {
        const organizerFullName = sessionStorage.getItem("updateOrganizerFullName");
        const organizerAddress = sessionStorage.getItem("updateOrganizerAddress");

        if (organizerFullName && organizerAddress) {
            document.getElementById("currentFullName").value = organizerFullName;
            document.getElementById("currentAddress").value = organizerAddress;

            const updateButton = document.getElementById("updateOrganizerButton");
            if (updateButton) {
                updateButton.addEventListener("click", async () => {
                    try {
                        const newFullName = document.getElementById("newFullName").value.trim();
                        const newAddress = document.getElementById("newAddress").value.trim();

                        if (!newFullName || !newAddress) {
                            alert("Please fill in all fields.");
                            return;
                        }

                        await deleteOrganizer(organizerAddress);
                        await addOrganizer(newFullName, newAddress);
                        alert("Organizer updated successfully!");
                        window.location.href = "organiserview.html";
                    } catch (error) {
                        console.error("Error updating organizer:", error);
                    }
                });
            } else {
                console.error("Update Organizer Button not found.");
            }
        } else {
            console.error("Organizer details missing from sessionStorage.");
            window.location.href = "organiserview.html";
        }
    }
});
