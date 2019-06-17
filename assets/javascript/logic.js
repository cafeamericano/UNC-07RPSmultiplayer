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

//#################################### GLOBAL VARIABLES #############################################

let p1sel;
let p2sel;

//#################################### OBJECTS #############################################

let player1 = {
    name: '',
    country: '',
    selection: '',
    isReady: false,
    updatePlayerInformationOnHUD: function () {
        $("#player1nameDisplay").text(`${this.name}`)
        $("#player1countryDisplay").text(`${this.country}`)
        //$("#player1selectionDisplay").text(`${this.selection}`)
        if (this.isReady) {
            $("#player1isReadyDisplay").text(`Selection made!`)
        } else {
            $("#player1isReadyDisplay").text(`Decision pending.`)
        };
    }
};

let player2 = {
    name: '',
    country: '',
    selection: '',
    isReady: false,
    updatePlayerInformationOnHUD: function () {
        $("#player2nameDisplay").text(`${this.name}`)
        $("#player2countryDisplay").text(`${this.country}`)
        //$("#player2selectionDisplay").text(`${this.selection}`)
        if (this.isReady) {
            $("#player2isReadyDisplay").text(`Selection made!`)
        } else {
            $("#player2isReadyDisplay").text(`Decision pending.`)
        };
    }
};

let game = {
    winningPlayer: '',
    winningName: '',
    updatePlayerInformationOnDatabase(number) {
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
    },
    updatePlayerChoiceOnDatabase(number) {
        event.preventDefault()

        //Determine which document in Firebase to manipulate
        let docToAlter = '/player' + number

        //Dynamically establish the divs whose values will be grabbed
        let selectionInputToGrab = `#player${number}selectionInput`

        //Grab the values from the predetermined divs
        let selectionValue = $(selectionInputToGrab).val().trim()

        //Update the appropriate document in Firebase with the supplied information
        database.ref(`${docToAlter}/selection`).set({
            rpsChoice: selectionValue,
            isReady: true
        });
    },
    analyzeForWin: function () {
        console.log('p1: ' + p1sel)
        console.log('p2: ' + p2sel)

        //Check for tie
        if (p1sel === p2sel) {
            game.winningPlayer = 'No one'
            game.winningName = 'No one'
        };

        //See if player 1 wins
        if (p1sel === 'rock' && p2sel === 'scissors') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
        } else if (p1sel === 'scissors' && p2sel === 'paper') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
        } else if (p1sel === 'paper' && p2sel === 'rock') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
        };

        //See if player 2 wins
        if (p2sel === 'rock' && p1sel === 'scissors') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
        } else if (p2sel === 'scissors' && p1sel === 'paper') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
        } else if (p2sel === 'paper' && p1sel === 'rock') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
        };

        database.ref('/winningPlayer').set({
            player: game.winningPlayer,
            name: game.winningName
        });

        $('#results').text(`${player1.name} selected ${player1.selection}. ${player2.name} selected ${player2.selection}. ${game.winningName} won the game.`)
    },
    restart: function () {
        event.preventDefault();

        //Reset the winning player
        database.ref(`/winningPlayer`).set({
            name: '',
            country: ''
        });

        //Make player 1 not ready
        database.ref(`player1/selection`).set({
            isReady: false,
            rpsChoice: '',
        });

        //Make player 2 not ready
        database.ref(`player2/selection`).set({
            isReady: false,
            rpsChoice: '',
        });

        //Clear dropdown boxes and results
        $('#results').text('')
        $('#player1selectionInput').val('')
        $('#player2selectionInput').val('')
    }
}


//#################################### INITIAL + CONTINUOUS READ FROM DATABASE #############################################

//Process read
database.ref().on("value", function (snapshot) {

    //Grab the data, save to variables
    player1.name = snapshot.val().player1.info.name
    player1.country = snapshot.val().player1.info.country
    player1.selection = snapshot.val().player1.selection.rpsChoice
    player1.isReady = snapshot.val().player1.selection.isReady
    p1sel = snapshot.val().player1.selection.rpsChoice

    player2.name = snapshot.val().player2.info.name
    player2.country = snapshot.val().player2.info.country
    player2.selection = snapshot.val().player2.selection.rpsChoice
    player2.isReady = snapshot.val().player2.selection.isReady
    p2sel = snapshot.val().player2.selection.rpsChoice

    //Analyze player actions
    if (player1.isReady && player2.isReady) {
        game.analyzeForWin()
    }

    //Put that info on the DOM
    player1.updatePlayerInformationOnHUD()
    player2.updatePlayerInformationOnHUD()

}, function (error) {
    console.log("Error: " + error.code); // Catch errors
});

























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