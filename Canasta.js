document.addEventListener("DOMContentLoaded", function() {
    // Get the input elements
    var player1Input = document.getElementById("player1");
    var player2Input = document.getElementById("player2");
    var player3Input = document.getElementById("player3");
    var player4Input = document.getElementById("player4");

    // Get the start game button
    var startButton = document.getElementById("start-game");

    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['0', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    
    // Function to create a deck of cards
    function createDeck() {
        var deck = [];

        // Add 52 cards from each deck
        for (var i = 0; i < 2; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    // Exclude Diamonds and Clubs for the 0 cards (Jokers)
                    if (value === '0' && (suit === 'Diamonds' || suit === 'Clubs')) {
                        continue;
                    }
                    deck.push(value + " of " + suit);
                }
            }
        }

        // Update the total cards label
        var totalCards = deck.length;
        document.getElementById('total-cards').textContent = totalCards;

        return deck;
    }

    console.log(createDeck());
    
    // Example usage
    const deck = createDeck();
    console.log(deck);

    // Function to shuffle the deck
    function shuffleDeck(deck) {
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }

    function dealCards(deck, numCards) {
        var players = [
            player1Input.value.trim(),
            player2Input.value.trim(),
            player3Input.value.trim(),
            player4Input.value.trim()
        ];
    
        var hands = {};
    
        // Initialize each player's hand
        for (var player of players) {
            hands[player] = [];
        }
    
        // Deal cards to each player
        for (var j = 0; j < numCards; j++) {
            for (var player of players) {
                var card = deck.pop();
                // Check if the dealt card is a joker
                if (card !== "Joker") {
                    hands[player].push(card);
                }
            }
        }
    
        // Sort the hands of each player
        for (var player in hands) {
            hands[player].sort(function(a, b) {
                return cardValue(a) - cardValue(b);
            });
        }
    
        // Convert card strings to card objects
        for (var player in hands) {
            hands[player] = hands[player].map(function(card) {
                var parts = card.split(" of ");
                return { value: parts[0], suit: parts[1] };
            });
        }
    
        return hands;
    }

    // Function to get the numerical value of a card
    function cardValue(card) {
        var value = card.split(" ")[0];
        if (value === "Joker") {
            return 0; // Joker is the lowest
        } else if (value === "Ace") {
            return 14; // Ace is the highest
        } else if (value === "King") {
            return 13;
        } else if (value === "Queen") {
            return 12;
        } else if (value === "Jack") {
            return 11;
        } else {
            return parseInt(value);
        }
    }

    // Function to start the game
function startGame() {
    // Get the names entered by the players
    var player1Name = player1Input.value.trim();
    var player2Name = player2Input.value.trim();
    var player3Name = player3Input.value.trim();
    var player4Name = player4Input.value.trim();

    // Check if all players have entered their names
    if (player1Name === "" || player2Name === "" || player3Name === "" || player4Name === "") {
        alert("Please enter names for all players.");
        return;
    }

    // Create and shuffle the deck
    var deck = createDeck();
    deck = shuffleDeck(deck);

    // Deal 11 cards to each player
    var hands = dealCards(deck, 11);

    // Display the hands
    displayHands(hands);

    // Create the draw deck with the remaining cards
    createDrawDeck(deck.length);

    // Display teams
    displayTeams(player1Name, player2Name, player3Name, player4Name); // Ensure correct parameter order

    // Show the new button
    document.getElementById("new-button").style.display = "block";
}

    // Add click event listener to the start game button
    startButton.addEventListener("click", startGame);

    // Function to display the hands
    function displayHands(hands) {
        var container = document.getElementById("hands-container");
        container.innerHTML = ""; // Clear previous hands

        for (var player in hands) {
            var hand = hands[player];
            var handElement = document.createElement("div");
            handElement.classList.add("player-hand");

            var playerName = document.createElement("h3");
            playerName.textContent = player;
            handElement.appendChild(playerName);

            var cardsList = document.createElement("div");
            cardsList.classList.add("cards-list");

            for (var i = 0; i < hand.length; i++) {
                var cardItem = document.createElement("div");
                cardItem.classList.add("card-item");

                var cardImage = document.createElement("img");
                displayCard(hand[i], cardImage); // Call displayCard function to set card image
                cardImage.classList.add("card-image");

                cardItem.appendChild(cardImage);
                cardsList.appendChild(cardItem);
            }
            handElement.appendChild(cardsList);
            container.appendChild(handElement);
        }
    }

    // Function to display teams
    function displayTeams(player1Name, player2Name, player3Name, player4Name) {
        var team1Container = document.getElementById("team1");
        var team2Container = document.getElementById("team2");

        // Clear previous content
        team1Container.innerHTML = "";
        team2Container.innerHTML = "";

        // Create team elements
        var team1Header = document.createElement("h2");
        team1Header.textContent = "Team 1";
        team1Container.appendChild(team1Header);

        var team1List = document.createElement("ul");
        var player1ListItem = document.createElement("li");
        player1ListItem.textContent = player1Name;
        var player3ListItem = document.createElement("li");
        player3ListItem.textContent = player3Name;
        team1List.appendChild(player1ListItem);
        team1List.appendChild(player3ListItem);
        team1Container.appendChild(team1List);

        var team2Header = document.createElement("h2");
        team2Header.textContent = "Team 2";
        team2Container.appendChild(team2Header);

        var team2List = document.createElement("ul");
        var player2ListItem = document.createElement("li");
        player2ListItem.textContent = player2Name;
        var player4ListItem = document.createElement("li");
        player4ListItem.textContent = player4Name;
        team2List.appendChild(player2ListItem);
        team2List.appendChild(player4ListItem);
        team2Container.appendChild(team2List);
    }

    // Function to display a card
    function displayCard(card, imgElement) {
        if (card.value === "Joker" && card.suit === "Joker") {
            console.log("Displaying Joker:", card); // Log joker card for debugging
            imgElement.src = "red_joker.png"; // Assuming red_joker.png is in the same folder
        } else {
            const imagePath = `I:/canastaProjectLIVE/CODE/images/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
            console.log("Displaying Regular Card:", card); // Log regular card for debugging
            console.log("Image Path:", imagePath); // Log the image path for debugging
            imgElement.src = imagePath;
        }
    }

    // Function to create the draw deck
    function createDrawDeck(numCards) {
        var drawDeckContainer = document.getElementById('draw-deck-container');
        drawDeckContainer.innerHTML = ''; // Clear previous content

        var img = document.createElement('img');
        img.src = 'I:/canastaProjectLIVE/CODE/images/backside.png';
        img.alt = 'Backside of Cards';

        // Append the image to the draw deck container
        drawDeckContainer.appendChild(img);

        // Update the draw deck card count label
        var drawDeckCardCount = document.getElementById('draw-deck-card-count');
        drawDeckCardCount.textContent = numCards;
    }
});