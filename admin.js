async function initializeWeb3() {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        console.log("Web3 initialized with MetaMask.");
    } else {
        console.error("MetaMask is not installed.");
        alert("Please install MetaMask to use this application.");
    }
}

async function initializeContract() {
    if (!web3) {
        console.error("Web3 is not initialized. Initializing now...");
        await initializeWeb3(); // Ensure Web3 is initialized first
    }

    if (!contract) {
        console.log("Initializing Contract...");
        contract = new web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS); // Replace with your contract details
    }
}


// Verify Admin or Organizer Access
async function verifyAccess() {
    if (!web3) {
        console.error("Web3 is not initialized. Initializing now...");
        await initializeWeb3();
    }

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
        alert("No wallet connected!");
        window.location.href = "index.html"; // Redirect unauthorized users
        return;
    }

    const connectedWallet = accounts[0].toLowerCase();

    if (connectedWallet === ADMIN_ADDRESS.toLowerCase()) {
        console.log("Admin verified:", connectedWallet);
        updateWalletDisplay(connectedWallet); // Update wallet display
        return;
    }

    const isUserOrganizer = await isOrganizer(connectedWallet);
    if (isUserOrganizer) {
        console.log("Organizer verified:", connectedWallet);
        updateWalletDisplay(connectedWallet); // Update wallet display
        return;
    }

    alert("Access Denied: You are not authorized to access this page.");
    window.location.href = "index.html";
}

// Update Wallet Address in Navbar
function updateWalletDisplay(walletAddress) {
    const walletDisplayElement = document.getElementById("walletAddressDisplay");
    if (walletDisplayElement) {
        walletDisplayElement.textContent = `Connected Wallet: ${walletAddress}`;
    } else {
        console.error("walletAddressDisplay element not found in the DOM.");
    }
}

// Initialize Admin or Organizer Verification on Page Load
async function initStaffPage() {
    try {
        await initializeWeb3(); // Initialize Web3
        await initializeContract(); // Initialize Contract
        await verifyAccess(); // Verify Admin or Organizer access
    } catch (error) {
        console.error("Error initializing the staff page:", error);
    }
}


window.addEventListener("DOMContentLoaded", initStaffPage);

document.getElementById("disconnectWallet")?.addEventListener("click", disconnectWallet);

