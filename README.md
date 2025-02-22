# BlockchainF1 Solidity Codes

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/access/AccessControlEnumerable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.2/contracts/security/ReentrancyGuard.sol";

contract F1PaddockClub is AccessControlEnumerable, ReentrancyGuard {

    struct Ticket {
        uint ticketId;
        string eventName;
        string eventDate;
        string eventLocation;
        address currentOwner;
        uint256 price;
        bool isForSale;
        bool isForResale;
        bool isExpired;
        address[] resaleHistory;
    }

    struct Event {
        uint eventId;
        string eventName;
        string eventDate;
        string eventLocation;
        uint256 price;
        uint availableTickets;
        uint[] ticketIds;
        bool status;
    }

    struct Organizer {
        string fullName;
        address walletAddress;
    }

    uint public eventCount;
    uint public ticketCount; 

    mapping(uint => Event) public events;
    mapping(uint => Ticket) public tickets;
    mapping(address => Organizer) private organizers;
    address[] public organizerList;

    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    uint256 public minResalePrice = 0.000000000000000001 ether;
    uint256 public maxResalePrice = 10 ether;
    uint256 public transactionFeePercent = 2; // 2% transaction fee

    event TicketCreated(uint ticketId, string eventName, address owner);
    event TicketTransferred(uint ticketId, address from, address to);
    event RefundIssued(uint ticketId, address owner, uint256 refundAmount);
    event EventUpdated(uint indexed eventId, string name, string date, string location, uint256 price, uint256 availableTickets);
    event OrganizerAdded(address organizer);
    event OrganizerRemoved(address organizer);
    event TicketResold(uint ticketId, address seller, uint256 newPrice);
    event ResaleCancelled(uint ticketId);

    modifier onlyAdmin() {
        require(
            msg.sender == 0x39022f2935339Ff128e2917AFF08867098Fffc4e,
            "Only the admin can perform this action."
        );
        _;
    }
    constructor() {
        // Admin Setup
        _setupRole(DEFAULT_ADMIN_ROLE, 0x39022f2935339Ff128e2917AFF08867098Fffc4e);
        addOrganizer("Delsius Yib Sheng Hyun", 0x39022f2935339Ff128e2917AFF08867098Fffc4e);

        // Preset Events and Tickets
        createEvent(
            "Singapore Grand Prix",
            "2025-09-15",
            "Singapore",
            0.00000000000000008 ether,
            50 // Number of tickets for this event
        );
        createEvent(
            "Monaco Grand Prix",
            "2025-05-25",
            "Monaco",
            0.00000000000000007 ether,
            30 // Number of tickets for this event
        );
    }

    event Received(address sender, uint amount);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
    
   function createEvent(
        string memory _name,
        string memory _date,
        string memory _location,
        uint256 _price,
        uint _availableTickets
    ) public onlyAdmin {
        require(_availableTickets > 0, "Ticket quantity must be greater than 0.");

        eventCount++;
        uint[] memory ticketIds = new uint[](_availableTickets);

        for (uint i = 0; i < _availableTickets; i++) {
            ticketCount++;
            ticketIds[i] = ticketCount;
            tickets[ticketCount] = Ticket({
                ticketId: ticketCount,
                eventName: _name,
                eventDate: _date,
                eventLocation: _location,
                currentOwner: address(0),
                price: _price,
                isForSale: true,
                isForResale: false,
                isExpired: false,
                resaleHistory: new address[](0)
            });
            emit TicketCreated(ticketCount, _name, address(0));
        }

        events[eventCount] = Event({
            eventId: eventCount,
            eventName: _name,
            eventDate: _date,
            eventLocation: _location,
            price: _price,
            availableTickets: _availableTickets,
            status: true,
            ticketIds: ticketIds
        });

        emit EventUpdated(eventCount, _name, _date, _location, _price, _availableTickets);
    }

 function createTicket(
        uint _eventId,
        string memory _eventName,
        string memory _eventDate,
        string memory _eventLocation,
        uint256 _price
    ) public onlyAdmin {
        require(events[_eventId].eventId != 0, "Event does not exist.");
        require(bytes(_eventName).length > 0, "Event name cannot be empty.");
        require(bytes(_eventDate).length > 0, "Event date cannot be empty.");
        require(bytes(_eventLocation).length > 0, "Event location cannot be empty.");
        require(_price > 0, "Price must be greater than zero.");

        ticketCount++;
        tickets[ticketCount] = Ticket({
            ticketId: ticketCount,
            eventName: _eventName,
            eventDate: _eventDate,
            eventLocation: _eventLocation,
            currentOwner: address(0),
            price: _price,
            isForSale: true,
            isForResale: false,
            isExpired: false,
            resaleHistory: new address[](0)
        });

        events[_eventId].ticketIds.push(ticketCount);
        events[_eventId].availableTickets++;
        emit TicketCreated(ticketCount, _eventName, msg.sender);
    }

      function resellTicket(uint _ticketId, uint256 _newPrice) public onlyTicketOwner(_ticketId) {
        require(_newPrice >= minResalePrice && _newPrice <= maxResalePrice, "Price out of allowed range.");
        Ticket storage ticket = tickets[_ticketId];
        require(!ticket.isExpired, "Cannot resell expired ticket.");
        
        ticket.price = _newPrice;
        ticket.isForResale = true;
        ticket.isForSale = false;
        
        emit TicketResold(_ticketId, msg.sender, _newPrice);
    }

    // Add this function to allow users to remove their tickets from the marketplace
function cancelResale(uint _ticketId) public onlyTicketOwner(_ticketId) {
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.isForResale, "Ticket not listed for resale.");
        ticket.isForResale = false;
        emit ResaleCancelled(_ticketId);
    }

    function purchaseResaleTicket(uint _ticketId) public payable nonReentrant isForResale(_ticketId) {
        Ticket storage ticket = tickets[_ticketId];
        require(msg.value == ticket.price, "Incorrect ETH amount.");
        require(!ticket.isExpired, "Ticket expired.");
        require(msg.sender != ticket.currentOwner, "Cannot buy your own ticket.");

        uint256 feeAmount = (msg.value * transactionFeePercent) / 100;
        uint256 sellerAmount = msg.value - feeAmount;

        payable(0x39022f2935339Ff128e2917AFF08867098Fffc4e).transfer(feeAmount);
        payable(ticket.currentOwner).transfer(sellerAmount);

        ticket.resaleHistory.push(msg.sender);
        ticket.currentOwner = msg.sender;
        ticket.isForResale = false;

        emit TicketTransferred(_ticketId, ticket.currentOwner, msg.sender);
    }

    modifier isForResale(uint _ticketId) {
        require(tickets[_ticketId].isForResale, "Not for resale");
        _;
    }

    modifier onlyTicketOwner(uint _ticketId) {
        require(tickets[_ticketId].currentOwner == msg.sender, "Not ticket owner");
        _;
    }

function getAllEvents() public view returns (Event[] memory) {
    Event[] memory eventList = new Event[](eventCount);

    // Start from 1, go up to eventCount
    for (uint i = 1; i <= eventCount; i++) {
        eventList[i - 1] = events[i]; // ✅ Correct index mapping
    }

    return eventList;
}

    function getTicketsForEvent(uint _eventId) public view returns (Ticket[] memory) {
        require(events[_eventId].eventId != 0, "Event does not exist.");

        uint[] memory ticketIds = events[_eventId].ticketIds;
        Ticket[] memory eventTickets = new Ticket[](ticketIds.length);

        for (uint i = 0; i < ticketIds.length; i++) {
            eventTickets[i] = tickets[ticketIds[i]];
        }

        return eventTickets;
    }

    function purchaseTicket(uint _eventId) public payable nonReentrant {
        require(events[_eventId].eventId != 0, "Event does not exist.");
        require(events[_eventId].availableTickets > 0, "No tickets available.");

        uint ticketIdToPurchase = 0;
        for (uint i = 0; i < events[_eventId].ticketIds.length; i++) {
            uint ticketId = events[_eventId].ticketIds[i];
            Ticket storage ticket = tickets[ticketId];
            if (ticket.isForSale && ticket.currentOwner == address(0) && !ticket.isExpired) {
                ticketIdToPurchase = ticketId;
                break;
            }
        }

        require(ticketIdToPurchase > 0, "No available ticket found.");
        Ticket storage selectedTicket = tickets[ticketIdToPurchase];

        require(msg.value == selectedTicket.price, "Incorrect ETH amount.");
        selectedTicket.currentOwner = msg.sender;
        selectedTicket.isForSale = false;
        selectedTicket.resaleHistory.push(msg.sender);
        events[_eventId].availableTickets--;

        payable(0x39022f2935339Ff128e2917AFF08867098Fffc4e).transfer(msg.value);
        emit TicketTransferred(ticketIdToPurchase, address(0), msg.sender);
    }

    

    function updateEvent(
    uint _eventId,
    string memory _name,
    string memory _date,
    string memory _location,
    uint256 _price,
    uint256 _availableTickets
) public onlyAdmin {
    require(events[_eventId].eventId != 0, "Event does not exist.");

    // ✅ Preserve existing ticket IDs
    uint[] memory existingTicketIds = events[_eventId].ticketIds;
    require(existingTicketIds.length <= _availableTickets, "Cannot reduce ticket count below existing tickets");

    events[_eventId] = Event({
        eventId: _eventId,
        eventName: _name,
        eventDate: _date,
        eventLocation: _location,
        price: _price,
        availableTickets: _availableTickets,
        status: true,
        ticketIds: existingTicketIds // ✅ Preserve ticket IDs
    });

    emit EventUpdated(_eventId, _name, _date, _location, _price, _availableTickets);
}


    function addOrganizer(string memory fullName, address organizer) public onlyAdmin {
        require(organizers[organizer].walletAddress == address(0), "Organizer already exists.");
        organizers[organizer] = Organizer(fullName, organizer);
        organizerList.push(organizer);
        grantRole(ORGANIZER_ROLE, organizer);
        emit OrganizerAdded(organizer);
    }

    function getOrganizerFullName(address organizer) public view returns (string memory) {
        require(organizers[organizer].walletAddress != address(0), "Organizer not found.");
        return organizers[organizer].fullName;
    }

    function removeOrganizer(address organizer) public onlyAdmin {
        require(organizers[organizer].walletAddress != address(0), "Organizer not found.");
        revokeRole(ORGANIZER_ROLE, organizer);
        delete organizers[organizer];
        emit OrganizerRemoved(organizer);
    }

    function getOrganizerByAdmin(address admin) public view returns (address) {
        require(hasRole(ORGANIZER_ROLE, admin), "Admin is not an organizer");

        for (uint i = 0; i < organizerList.length; i++) {
            if (organizers[organizerList[i]].walletAddress == admin) {
                return organizerList[i];
            }
        }
        revert("Organizer not found for this admin.");
    }

    modifier validatePrice(uint256 _price) {
        require(
            _price >= minResalePrice && _price <= maxResalePrice,
            "Price out of allowed range."
        );
        _;
    }


    function transferTicket(uint _ticketId, address _newOwner) public payable nonReentrant {
        require(_newOwner != address(0), "Invalid new owner address.");
        require(!tickets[_ticketId].isExpired, "Cannot transfer an expired ticket.");

        Ticket storage ticket = tickets[_ticketId];
        address previousOwner = ticket.currentOwner;
        require(previousOwner == msg.sender, "Only the owner can transfer the ticket.");
        require(previousOwner != _newOwner, "Cannot transfer to the same owner.");

        ticket.resaleHistory.push(_newOwner); // Corrected to push new owner
        ticket.currentOwner = _newOwner;
        ticket.isForSale = false;

        emit TicketTransferred(_ticketId, previousOwner, _newOwner);
    }

    function expireTicket(uint _ticketId) public onlyAdmin {
        require(_ticketId > 0 && _ticketId <= ticketCount, "Invalid Ticket ID.");
        tickets[_ticketId].isExpired = true;
    }

    mapping(uint => bool) public refundedTickets;

    function refundTicket(uint _ticketId) public nonReentrant {
        require(
            msg.sender == tickets[_ticketId].currentOwner,
            "Only ticket owner can request a refund."
        );
        require(!tickets[_ticketId].isExpired, "Cannot refund an expired ticket.");
        require(!refundedTickets[_ticketId], "Ticket already refunded.");
        uint256 refundAmount = tickets[_ticketId].price;
        payable(msg.sender).transfer(refundAmount);

        refundedTickets[_ticketId] = true;
        emit RefundIssued(_ticketId, msg.sender, refundAmount);
    }

    function getResaleTickets() public view returns (Ticket[] memory) {
    uint resaleCount = 0;

    // Count how many tickets are for resale
    for (uint i = 1; i <= ticketCount; i++) {
        if (tickets[i].isForResale && !tickets[i].isExpired) {
            resaleCount++;
        }
    }

    // Create an array with the right size
    Ticket[] memory resaleTickets = new Ticket[](resaleCount);
    uint index = 0;

    for (uint i = 1; i <= ticketCount; i++) {
        if (tickets[i].isForResale && !tickets[i].isExpired) {
            resaleTickets[index] = tickets[i];
            index++;
        }
    }

    return resaleTickets;
}


    function getResaleHistory(uint _ticketId) public view returns (address[] memory) {
        require(_ticketId > 0 && _ticketId <= ticketCount, "Invalid Ticket ID.");
        return tickets[_ticketId].resaleHistory;
    }

    modifier isForSale(uint _ticketId) {
        require(tickets[_ticketId].isForSale, "This ticket is not for sale.");
        _;
    }
}
