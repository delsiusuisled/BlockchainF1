let isConnecting = false;

let isWeb3Initialized = false;
let isContractInitialized = false;

// Initialize Web3
async function initializeWeb3() {
    if (isWeb3Initialized) {
        console.log("🔹 Web3 is already initialized.");
        return;
    }

    if (typeof window.ethereum === "undefined") {
        alert("⚠️ MetaMask is not installed. Please install it.");
        throw new Error("MetaMask not detected.");
    }

    try {
        console.log("🔹 Initializing Web3...");
        const provider = window.ethereum;
        window.web3 = new Web3(provider);

        const accounts = await provider.request({ method: "eth_requestAccounts" });
        window.currentAccount = accounts[0];
        sessionStorage.setItem("connectedWallet", window.currentAccount);
        console.log("✅ Wallet connected:", window.currentAccount);

        isWeb3Initialized = true;
    } catch (error) {
        console.error("❌ Failed to initialize Web3 or connect wallet:", error);
    }
}

// Initialize Contract
async function initializeContract() {
    if (isContractInitialized) {
        console.log("🔹 Contract is already initialized.");
        return;
    }

    if (!window.web3) {
        console.error("Web3 is not initialized. Initializing now...");
        await initializeWeb3();
    }

    try {
        console.log("🔹 Initializing Contract...");
        window.contract = new window.web3.eth.Contract(F1TicketContract.abi, CONTRACT_ADDRESS);
        console.log("✅ Contract initialized successfully.");

        isContractInitialized = true;
    } catch (error) {
        console.error("❌ Error initializing contract:", error);
    }
}

// Check Admin Role
async function isAdmin(walletAddress) {
    try {
        await initializeWeb3();
        await initializeContract();

        const ADMIN_ROLE = window.web3.utils.keccak256("ADMIN_ROLE"); // Ensure web3.utils is available
        const isAdmin = await window.contract.methods.hasRole(ADMIN_ROLE, walletAddress).call();
        console.log(`🔹 isAdmin(${walletAddress}): ${isAdmin}`);
        return isAdmin;
    } catch (error) {
        console.error("❌ Error checking admin role:", error);
        return false;
    }
}

// Check Organizer Role
async function isOrganizer(walletAddress) {
    try {
        await initializeWeb3();
        await initializeContract();

        const ORGANIZER_ROLE = window.web3.utils.keccak256("ORGANIZER_ROLE"); // Ensure web3.utils is available
        const isOrganizer = await window.contract.methods.hasRole(ORGANIZER_ROLE, walletAddress).call();
        console.log(`🔹 isOrganizer(${walletAddress}): ${isOrganizer}`);
        return isOrganizer;
    } catch (error) {
        console.error("❌ Error checking organizer role:", error);
        return false;
    }
}

// Check if Wallet is Admin or Organizer
async function isOrganizerOrAdmin(walletAddress) {
    try {
        const admin = await isAdmin(walletAddress);
        const organizer = await isOrganizer(walletAddress);

        console.log(`🔹 Checking Admin/Organizer Role: isAdmin = ${admin}, isOrganizer = ${organizer}`);
        return admin || organizer;
    } catch (error) {
        console.error("❌ Error checking admin/organizer role:", error);
        return false;
    }
}


// ✅ Connect Wallet with Loading State
async function connectWallet() {
    if (isConnecting) return;
    isConnecting = true; // Prevent multiple clicks

    const navConnectButton = document.getElementById("navConnectWalletButton");
    if (navConnectButton) {
        navConnectButton.textContent = "Connecting...";
        navConnectButton.disabled = true;
    }

    try {
        if (typeof window.ethereum === "undefined") {
            alert("⚠️ MetaMask is not installed. Please install it.");
            return;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletAddress = accounts[0];

        console.log("✅ Wallet Connected:", walletAddress);
        sessionStorage.setItem("connectedWallet", walletAddress);

        // Ensure Web3 and Contract are initialized before proceeding
        await initializeWeb3();
        await initializeContract();

        // Update Navbar UI
        await safeUpdateNavbar(walletAddress);
    } catch (error) {
        console.error("❌ Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    } finally {
        isConnecting = false;
        if (navConnectButton) {
            navConnectButton.textContent = "Disconnect Wallet";
            navConnectButton.disabled = false;
            navConnectButton.classList.remove("btn-danger");
            navConnectButton.classList.add("btn-secondary");
            navConnectButton.onclick = disconnectWallet;
        }
    }
}


// ✅ Disconnect Wallet with Proper UI Reset
function disconnectWallet() {
    console.log("🔹 Disconnecting Wallet...");

    const navConnectButton = document.getElementById("navConnectWalletButton");
    const walletDisplay = document.getElementById("walletAddressDisplay");
    const staffNavItem = document.getElementById("staffNavItem");

    if (navConnectButton) {
        navConnectButton.textContent = "Disconnecting..."; // Temporary state
        navConnectButton.disabled = true; // Prevent interaction during the process
    }

    // Clear session storage
    sessionStorage.removeItem("connectedWallet");
    window.currentAccount = null;

    // ✅ Instantly Hide Staff Button & Wallet Display
    if (walletDisplay) {
        walletDisplay.style.display = "none";
        walletDisplay.textContent = ""; // Clear connected wallet text
    }
    if (staffNavItem) {
        staffNavItem.style.display = "none"; // Hide Staff nav item
    }

    // Add a small delay for UI smoothness
    setTimeout(() => {
        console.log("✅ Wallet Disconnected.");

        // Reset Navbar to "Connect Wallet" state
        if (navConnectButton) {
            navConnectButton.textContent = "Connect Wallet";
            navConnectButton.disabled = false; // Enable the button
            navConnectButton.classList.add("btn-danger");
            navConnectButton.classList.remove("btn-secondary");
            navConnectButton.onclick = connectWallet; // Reset to connect logic
        }
    }, 500);
}

// ✅ Safe Update Navbar Function
async function safeUpdateNavbar(walletAddress) {
    const walletDisplay = document.getElementById("walletAddressDisplay");
    const navConnectButton = document.getElementById("navConnectWalletButton");
    const staffNavItem = document.getElementById("staffNavItem");

    if (!walletDisplay || !navConnectButton || !staffNavItem) {
        console.error("❌ Navbar elements not found.");
        return;
    }

    if (!walletAddress) {
        console.log("🔹 Wallet disconnected. Resetting navbar...");
        walletDisplay.style.display = "none"; // Hide wallet address
        walletDisplay.textContent = ""; // Clear wallet address
        navConnectButton.textContent = "Connect Wallet"; // Reset button text
        navConnectButton.classList.add("btn-danger");
        navConnectButton.classList.remove("btn-secondary");
        navConnectButton.onclick = connectWallet; // Set click handler
        staffNavItem.style.display = "none"; // Hide Staff nav
        return;
    }

    console.log("🔹 Updating Navbar for Wallet:", walletAddress);
    walletDisplay.style.display = "block";
    walletDisplay.textContent = `Connected: ${walletAddress}`;
    navConnectButton.textContent = "Disconnect Wallet";
    navConnectButton.classList.remove("btn-danger");
    navConnectButton.classList.add("btn-secondary");
    navConnectButton.onclick = disconnectWallet;

    const isAdminOrOrganizer = await isOrganizerOrAdmin(walletAddress);
    staffNavItem.style.display = isAdminOrOrganizer ? "inline-block" : "none";
}

// ✅ Page Load Logic
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await initializeWeb3();
        await initializeContract();

        const connectedWallet = sessionStorage.getItem("connectedWallet");
        if (connectedWallet) {
            console.log("✅ Wallet Detected:", connectedWallet);
            await safeUpdateNavbar(connectedWallet);
        } else {
            console.log("❌ No wallet connected.");
            await safeUpdateNavbar(null);
        }

        document.getElementById("navConnectWalletButton").addEventListener("click", connectWallet);
    } catch (error) {
        console.error("❌ Error during page initialization:", error);
    }
});