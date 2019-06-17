let p1sel;
let p2sel;
let winner;

//#################################### ESTABLISH DB CONNECTION #############################################

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBcoUveW6YSN3K7It8NdFuQRi360QWvluk",
    authDomain: "rockpaperscissors-b4a8e.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-b4a8e.firebaseio.com",
    projectId: "rockpaperscissors-b4a8e",
    storageBucket: "",
    messagingSenderId: "314095652046",
    appId: "1:314095652046:web:3e159261a2f26a80"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
var database = firebase.database();

//#################################### INITIAL + CONTINUOUS READ FROM DATABASE #############################################

//Process read
database.ref().on("value", function (snapshot) {

    //Grab the data, save to variables
    let player1name = snapshot.val().player1.info.name
    let player1country = snapshot.val().player1.info.country
    let player1selection = snapshot.val().player1.selection.rpsChoice
    p1sel = snapshot.val().player1.selection.rpsChoice

    let player2name = snapshot.val().player2.info.name
    let player2country = snapshot.val().player2.info.country
    let player2selection = snapshot.val().player2.selection.rpsChoice
    p2sel = snapshot.val().player2.selection.rpsChoice
    let winner = snapshot.val().winner.name

    //Analyze player actions
    analyzeForWin()

    //Put that info on the DOM
    $("#player1information").text(`Player 1: ${player1name} of ${player1country} selects ${player1selection}.`);
    $("#player1nameDisplay").text(`${player1name}`)
    $("#player1countryDisplay").text(`${player1country}`)
    $("#player1selectionDisplay").text(`${player1selection}`)

    $("#player2information").text(`Player 2: ${player2name} of ${player2country} selects ${player2selection}.`);
    $("#player2nameDisplay").text(`${player2name}`)
    $("#player2countryDisplay").text(`${player2country}`)
    $("#player2selectionDisplay").text(`${player2selection}`)

}, function (error) {
    console.log("Error: " + error.code); // Catch errors
});

//#################################### WRITE TO DATABASE #############################################

function updatePlayerInformation(number) {
    event.preventDefault()

    //Determine which document in Firebase to manipulate
    let docToAlter = '/player' + number

    //Dynamically establish the divs whose values will be grabbed
    let nameInputToGrab = `#player${number}nameInput`
    let countryInputToGrab = `#player${number}countryInput`

    //Grab the values from the predetermined divs
    let nameValue = $(nameInputToGrab).val().trim()
    let countryValue = $(countryInputToGrab).val().trim()

    //Update the appropriate document in Firebase with the supplied information
    database.ref(`${docToAlter}/info`).set({
        name: nameValue,
        country: countryValue,
    });
};

function updatePlayerChoice(number) {
    event.preventDefault()

    //Determine which document in Firebase to manipulate
    let docToAlter = '/player' + number

    //Dynamically establish the divs whose values will be grabbed
    let selectionInputToGrab = `#player${number}selectionInput`

    //Grab the values from the predetermined divs
    let selectionValue = $(selectionInputToGrab).val().trim()

    //Update the appropriate document in Firebase with the supplied information
    database.ref(`${docToAlter}/selection`).set({
        rpsChoice: selectionValue
    });
};

//#################################### TRACK ACTIVE USERS #############################################

function analyzeForWin() {

    console.log('p1: ' + p1sel)
    console.log('p2: ' + p2sel)

    //Check for tie
    if (p1sel === p2sel) {
        winner = 'No one'
    };

    //See if player 1 wins
    if (p1sel === 'rock' && p2sel === 'scissors') {
        winner = 'Player 1'
    } else if (p1sel === 'scissors' && p2sel === 'paper') {
        winner = 'Player 1'
    } else if (p1sel === 'paper' && p2sel === 'rock') {
        winner = 'Player 1'
    };

    //See if player 2 wins
    if (p2sel === 'rock' && p1sel === 'scissors') {
        winner = 'Player 2'
    } else if (p2sel === 'scissors' && p1sel === 'paper') {
        winner = 'Player 2'
    } else if (p2sel === 'paper' && p1sel === 'rock') {
        winner = 'Player 2'
    };

    database.ref('/winner').set({
        name: winner
    });

    $('#results').text(`${winner} wins.`)

};

//#################################### TRACK ACTIVE USERS #############################################

//Establish a new document in Firebase to hold a list of all active users
var activeUsersReference = database.ref("/activeUsers");

//Access the special record in Firebase holding active connections
var connectedReference = database.ref(".info/connected");
console.log(connectedReference)

//Listen for changes in the hidden log of connections statuses...
connectedReference.on("value", function (snapshot) {
    console.log(snapshot.val())
    if (snapshot.val()) { // If a change has occurred...
        var connections = activeUsersReference.push(true); // Consider the new user as connected...
        connections.onDisconnect().remove(); // ... and remove the user upon their disconnection.
    }
});

//Put that info on the DOM
//$("#player1connectionID").text(`Player 1 Connection ID:`);
//$("#player2connectionID").text(`Player 2 Connection ID:`);

//Update count of active users
database.ref('/activeUsers').on("value", function (snapshot) {
    $('#activeUserCount').text(`Active User Count: ${snapshot.numChildren()}`)
})

console.log($('#player1selectionInput').val())