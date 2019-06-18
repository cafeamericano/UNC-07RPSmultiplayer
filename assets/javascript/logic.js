//##########################################################################################################################
//############################################## ESTABLISH DB CONNECTION ###################################################
//##########################################################################################################################

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

//##########################################################################################################################
//######################################### OBJECTS AND GLOBAL VARIABLES ###################################################
//##########################################################################################################################

let messageCountTotal;

let player1 = {
    name: '',
    location: '',
    selection: '',
    winCount: 0,
    lossCount: 0,
    isReady: false,
    syncFromDatabase(snapshot) {
        player1.name = snapshot.val().player1.name
        player1.location = snapshot.val().player1.location
        player1.selection = snapshot.val().player1.selection
        player1.winCount = snapshot.val().player1.winCount
        player1.lossCount = snapshot.val().player1.lossCount
        player1.isReady = snapshot.val().player1.isReady
    },
    syncToDatabase() {
        database.ref('/player1').update({
            name: this.name,
            location: this.location,
            selection: this.selection,
            winCount: this.winCount,
            lossCount: this.lossCount,
            isReady: this.isReady
        });
    },
    updatePlayerInformationOnHUD: function () {
        $("#player1nameDisplay").text(`${this.name}`)
        $("#player1locationDisplay").text(`${this.location}`)
        $("#player1winsCount").text(`Wins: ${this.winCount}`)
        $("#player1lossCount").text(`Losses: ${this.lossCount}`)
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
    location: '',
    selection: '',
    winCount: 0,
    lossCount: 0,
    isReady: false,
    syncFromDatabase(snapshot) {
        player2.name = snapshot.val().player2.name
        player2.location = snapshot.val().player2.location
        player2.selection = snapshot.val().player2.selection
        player2.winCount = snapshot.val().player2.winCount
        player2.lossCount = snapshot.val().player2.lossCount
        player2.isReady = snapshot.val().player2.isReady
    },
    syncToDatabase() {
        database.ref('/player2').update({
            name: this.name,
            location: this.location,
            selection: this.selection,
            winCount: this.winCount,
            lossCount: this.lossCount,
            isReady: this.isReady
        });
    },
    updatePlayerInformationOnHUD: function () {
        $("#player2nameDisplay").text(`${this.name}`)
        $("#player2locationDisplay").text(`${this.location}`)
        $("#player2winsCount").text(`Wins: ${this.winCount}`)
        $("#player2lossCount").text(`Losses: ${this.lossCount}`)
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
    resultText: '',
    syncFromDatabase(snapshot) {
        this.winningPlayer = snapshot.val().game.winningPlayer
        this.winningName = snapshot.val().game.winningName
        this.resultText = snapshot.val().game.resultText
    },
    syncToDatabase() {
        database.ref('/game').update({
            winningPlayer: this.winningPlayer,
            winningName: this.winningName,
            resultText: this.resultText
        });
    },
    updateResultsOnDOM() {
        //console.log(this.resultText)
        $('#results').text(game.resultText)
    },
    updatePlayerInformationOnDatabase(number) {
        event.preventDefault()
        let nameInputToGrab = `#player${number}nameInput`
        let locationInputToGrab = `#player${number}locationInput`

        if (number === 1) {
            player1.name = $(nameInputToGrab).val().trim()
            player1.location = $(locationInputToGrab).val().trim()
        } else if (number === 2) {
            player2.name = $(nameInputToGrab).val().trim()
            player2.location = $(locationInputToGrab).val().trim()
        }

        player1.syncToDatabase()
        player2.syncToDatabase()
        game.syncToDatabase()

    },
    updatePlayerChoiceOnDatabase(number) {
        event.preventDefault()
        let selectionInputToGrab = `#player${number}selectionInput`

        if (number === 1) {
            player1.selection = $(selectionInputToGrab).val().trim()
            player1.isReady = true
        } else if (number === 2) {
            player2.selection = $(selectionInputToGrab).val().trim()
            player2.isReady = true
        }

        player1.syncToDatabase()
        player2.syncToDatabase()
        game.syncToDatabase()

    },
    analyzeForWin: function () {
        console.log('Running analyze for win function')

        //Check for tie
        if (player1.selection === player2.selection) {
            game.winningPlayer = 'No one'
            game.winningName = 'No one'
        };

        //See if player 1 wins
        if (player1.selection === 'rock' && player2.selection === 'scissors') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
            player1.winCount += 1
            player2.lossCount += 1
        } else if (player1.selection === 'scissors' && player2.selection === 'paper') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
            player1.winCount += 1
            player2.lossCount += 1
        } else if (player1.selection === 'paper' && player2.selection === 'rock') {
            game.winningPlayer = 'Player 1'
            game.winningName = player1.name
            player1.winCount += 1
            player2.lossCount += 1
        };

        //See if player 2 wins
        if (player2.selection === 'rock' && player1.selection === 'scissors') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
            player2.winCount += 1
            player1.lossCount += 1
        } else if (player2.selection === 'scissors' && player1.selection === 'paper') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
            player2.winCount += 1
            player1.lossCount += 1
        } else if (player2.selection === 'paper' && player1.selection === 'rock') {
            game.winningPlayer = 'Player 2'
            game.winningName = player2.name
            player2.winCount += 1
            player1.lossCount += 1
        };

        //Set the result text, then sync it to the DB
        game.resultText = `${player1.name} chose ${player1.selection}. ${player2.name} chose ${player2.selection}. ${game.winningName} won the game.`
        game.syncToDatabase()

        //Set and sync player isReady statuses to prevent an infinite loop of analyzeForWin from occurring (due to Firebase syncing)
        player1.isReady = false
        player2.isReady = false
        player1.syncToDatabase()
        player2.syncToDatabase()

    },
    restart: function () {
        event.preventDefault();

        player1.isReady = false;
        player1.selection = '';

        player2.isReady = false;
        player2.selection = '';

        game.winningPlayer = '';
        game.winningName = '';
        game.resultText = '';

        player1.syncToDatabase()
        player2.syncToDatabase()
        game.syncToDatabase()
    },
    cleanRestart() {

        //Experimentation demonstrates this must be done once for every object synced with Firebase
        this.restart();
        this.restart();
        this.restart();

    }
};

let messages = {
    postMessage: function (number) {
        event.preventDefault()

        //Determine which document in Firebase to manipulate
        let docToAlter = 'messages/player' + number

        //Dynamically establish the divs whose values will be grabbed
        let selectionInputToGrab = `#player${number}messageInput`

        //Grab the values from the predetermined divs
        let selectionValue = $(selectionInputToGrab).val().trim()

        //Update the appropriate document in Firebase with the supplied information
        database.ref(docToAlter).set({
            message: selectionValue
        });

        $(selectionInputToGrab).val('')

        this.logMessageToDatabase(selectionValue, number);
    },
    logMessageToDatabase: function (message, senderNumber) {
        //Grab the message count value fromt he database
        database.ref('messages/count').once('value').then(function (snapshot) {
            let total = snapshot.val().total
            let count = total;

            //Write to DB
            let sendingPlayer = 'Player ' + senderNumber
            database.ref('messages/log').update({
                [count]: { message, sendingPlayer },
            });

            //Then increment count
            database.ref('messages/count').update({
                total: total + 1
            });

        });
    },
    updateMessages: function () {
        event.preventDefault()
        database.ref('messages/log').once('value').then(function (snapshot) {
            let obj = snapshot.val()
            let arr = Object.keys(obj)

            //Determine first and last record
            let firstRecord = Number(arr[0]);
            let lastRecord = Number(arr.slice(-1)[0]);

            //Clear what's there, then run the loop
            $('#allMessageLog').empty()
            for (var i = firstRecord; i < lastRecord + 1; i++) {
                let messageToPost = obj[i].message
                let sender = obj[i].sendingPlayer

                let newBlock = $('<div>')
                if (sender === 'Player 1') {
                    $(newBlock).css({ 'text-align': 'left' })
                    $(newBlock).addClass('alert alert-primary')
                } else {
                    $(newBlock).css({ 'text-align': 'right' })
                    $(newBlock).addClass('alert alert-success')
                }
                newBlock.append(`<strong>${sender}</strong>`)
                newBlock.append(`<div>${messageToPost}</div>`)
                $('#allMessageLog').prepend(newBlock)
            };
        })
    },
    toggleMessagesDisplay: function () {
        event.preventDefault()
        $('#allMessageLog').slideToggle()
    }

};

//Event Display

$(document).on("click", "#chatToggler", function () {
    messages.toggleMessagesDisplay()
})

//##########################################################################################################################
//#################################### INITIAL + CONTINUOUS READ FROM DATABASE #############################################
//##########################################################################################################################

//Process read
database.ref().on("value", function (snapshot) {

    //Grab the data, save to variables
    player1.syncFromDatabase(snapshot)
    player2.syncFromDatabase(snapshot)
    game.syncFromDatabase(snapshot)

    //Analyze player actions
    if (player1.isReady && player2.isReady) {
        game.analyzeForWin()
    };

    //Put that info on the DOM
    player1.updatePlayerInformationOnHUD()
    player2.updatePlayerInformationOnHUD()
    game.updateResultsOnDOM()
    messages.updateMessages()

}, function (error) {
    console.log("Error: " + error.code); // Catch errors
});

function rewardWinner(winner) {
    if (winner === 'Player 1') {
        database.ref('player1').update({
            winCount: player1.winCount += 1
        })
        database.ref('player2').update({
            winCount: player2.lossCount += 1
        })
    } else if (winner = 'Player 2') {
        database.ref('player1').update({
            winCount: player2.winCount += 1
        })
        database.ref('player2').update({
            winCount: player1.lossCount += 1
        })
    }
}












//#################################### TRACK ACTIVE USERS #############################################

//Establish a new document in Firebase to hold a list of all active users
var activeUsersReference = database.ref("/activeUsers");

//Access the special record in Firebase holding active connections
var connectedReference = database.ref(".info/connected");
//console.log(connectedReference)

//Listen for changes in the hidden log of connections statuses...
connectedReference.on("value", function (snapshot) {
    //console.log(snapshot.val())
    if (snapshot.val()) { // If a change has occurred...
        var connections = activeUsersReference.push(true); // Consider the new user as connected...
        connections.onDisconnect().remove(); // ... and remove the user upon their disconnection.
    }
});


//##########################################################################################################################
//##################################################### SPECIAL ############################################################
//##########################################################################################################################

