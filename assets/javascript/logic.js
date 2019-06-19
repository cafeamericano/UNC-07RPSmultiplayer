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

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ PLAYER 1 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let player1 = {
    name: '',
    location: '',
    selection: '',
    isReady: false,
    syncFromDatabase(snapshot) {
        player1.name = snapshot.val().name
        player1.location = snapshot.val().location
        player1.selection = snapshot.val().selection
        player1.isReady = snapshot.val().isReady
    },
    syncToDatabase() {
        database.ref('/player1').update({
            name: this.name,
            location: this.location,
            selection: this.selection,
            isReady: this.isReady
        });
    },
    updatePlayerInformationOnHUD: function () {
        $("#player1nameDisplay").text(`${this.name}`)
        $("#player1locationDisplay").text(`${this.location}`)
        if (this.isReady) {
            $("#player1isReadyDisplay").text(`Selection made!`)
        } else {
            $("#player1isReadyDisplay").text(`Not ready.`)
        };
    }
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ PLAYER 2 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let player2 = {
    name: '',
    location: '',
    selection: '',
    isReady: false,
    syncFromDatabase(snapshot) {
        player2.name = snapshot.val().name
        player2.location = snapshot.val().location
        player2.selection = snapshot.val().selection
        player2.isReady = snapshot.val().isReady
    },
    syncToDatabase() {
        database.ref('/player2').update({
            name: this.name,
            location: this.location,
            selection: this.selection,
            isReady: this.isReady
        });
    },
    updatePlayerInformationOnHUD: function () {
        $("#player2nameDisplay").text(`${this.name}`)
        $("#player2locationDisplay").text(`${this.location}`)
        if (this.isReady) {
            $("#player2isReadyDisplay").text(`Selection made!`)
        } else {
            $("#player2isReadyDisplay").text(`Not ready.`)
        };
    }
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GAME @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let game = {
    winningPlayer: '',
    winningName: '',
    resultText: '',
    playCount: 0,
    syncFromDatabase(snapshot) {
        this.winningPlayer = snapshot.val().winningPlayer
        this.winningName = snapshot.val().winningName
        this.resultText = snapshot.val().resultText
        this.playCount = snapshot.val().playCount
    },
    syncToDatabase() {
        database.ref('/game').update({
            winningPlayer: this.winningPlayer,
            winningName: this.winningName,
            resultText: this.resultText,
            playCount: this.playCount + 1
        });
    },
    updateResultsOnDOM() {
        $('#results').text(game.resultText)
    },
    updatePlayerInformationOnDatabase(number) {
        event.preventDefault()
        let nameInputToGrab = `#player${number}nameInput`
        let locationInputToGrab = `#player${number}locationInput`

        if (number === 1) {
            player1.name = $(nameInputToGrab).val().trim()
            player1.location = $(locationInputToGrab).val().trim()
            scoreboard.player1wins = 0;
            scoreboard.player1losses = 0;
            $('#editPlayer1infoPanel').slideUp()
        } else if (number === 2) {
            player2.name = $(nameInputToGrab).val().trim()
            player2.location = $(locationInputToGrab).val().trim()
            scoreboard.player2wins = 0;
            scoreboard.player2losses = 0;
            $('#editPlayer2infoPanel').slideUp()
        }

        player1.syncToDatabase()
        player2.syncToDatabase()
        scoreboard.syncToDatabase()

    },
    updatePlayerChoiceOnDatabase(number) {
        event.preventDefault()
        let selectionInputToGrab = `#player${number}selectionInput`

        if (number === 1) {
            player1.selection = $(selectionInputToGrab).val().trim()
            player1.isReady = true
            $('#editPlayer1selectionPanel').slideUp()
        } else if (number === 2) {
            player2.selection = $(selectionInputToGrab).val().trim()
            player2.isReady = true
            $('#editPlayer2selectionPanel').slideUp()
        }

        player1.syncToDatabase()
        player2.syncToDatabase()
        game.syncToDatabase()

    },
    analyzeForWin: function () {
        console.log('Running analyze for win function')
        if (player1.selection === player2.selection) {
            return 0
        } else if (player1.selection === 'rock' && player2.selection === 'scissors') {
            return 1
        } else if (player1.selection === 'scissors' && player2.selection === 'paper') {
            return 1
        } else if (player1.selection === 'paper' && player2.selection === 'rock') {
            return 1
        } else if (player2.selection === 'rock' && player1.selection === 'scissors') {
            return 2
        } else if (player2.selection === 'scissors' && player1.selection === 'paper') {
            return 2
        } else if (player2.selection === 'paper' && player1.selection === 'rock') {
            return 2
        };
    },
    processGameCompletion: function() {
        let winner = this.analyzeForWin()
        let winnerName;
        if (winner === 0) {
            winnerName = 'No one'
        } else if (winner === 1) {
            winnerName = player1.name
            scoreboard.player1wins += 1;
            scoreboard.player2losses += 1;
            scoreboard.syncToDatabase()
        } else if (winner === 2) {
            winnerName = player2.name
            scoreboard.player2wins += 1;
            scoreboard.player1losses += 1;
            scoreboard.syncToDatabase()
        }

        //Set the result text, then sync it to the DB
        game.resultText = `${player1.name} chose ${player1.selection}. ${player2.name} chose ${player2.selection}. ${winnerName} won the game.`
        game.playCount = 1;
        game.syncToDatabase()

        //Set and sync player isReady statuses to prevent an infinite loop of analyzeForWin from occurring (due to Firebase syncing)
        player1.isReady = false
        player2.isReady = false
        player1.selection = '';
        player2.selection = '';

        player1.syncToDatabase()
        player2.syncToDatabase()

        //Shut down UI
        $('#p1column').css({ 'pointer-events': 'none' })
        $('#p1column').css({ 'opacity': '0.5' })
        $('#p2column').css({ 'pointer-events': 'none' })
        $('#p2column').css({ 'opacity': '0.5' })
        $('#statusSection').animate({ 'opacity': '0.0' }, 'fast')
        $('#restartButton').fadeIn()
    },
    restart: function () {
        event.preventDefault();

        //NOTE: Player isReady and selection cleared at end of analyzeForWin. This is so restart() will not remove a player's selection if they have already restarted and selected for a new game.

        game.winningPlayer = '';
        game.winningName = '';
        game.resultText = '';

        player1.syncToDatabase()
        player2.syncToDatabase()
        game.syncToDatabase()

        $('#p1column').css({ 'pointer-events': 'auto' })
        $('#p1column').css({ 'opacity': '1.0' })
        $('#p2column').css({ 'pointer-events': 'auto' })
        $('#p2column').css({ 'opacity': '1.0' })
        $('#statusSection').animate({ 'opacity': '1.0' }, 'fast')
        $('#restartButton').fadeOut()
    },
    cleanRestart() {

        //Experimentation demonstrates this must be done once for every object synced with Firebase
        this.restart();
        this.restart();
        this.restart();

    }
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SCOREBOARD @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let scoreboard = {
    player1wins: 0,
    player1losses: 0,
    player2wins: 0,
    player2losses: 0,
    syncFromDatabase(snapshot) {
        this.player1wins = snapshot.val().player1wins
        this.player1losses = snapshot.val().player1losses
        this.player2wins = snapshot.val().player2wins
        this.player2losses = snapshot.val().player2losses
    },
    syncToDatabase() {
        database.ref('/scoreboard').update({
            player1wins: this.player1wins,
            player1losses: this.player1losses,
            player2wins: this.player2wins,
            player2losses: this.player2losses,
        });
    },
    updateDOM() {
        $("#player1winsCount").text(`Wins: ${this.player1wins}`)
        $("#player1lossCount").text(`Losses: ${this.player1losses}`)
        $("#player2winsCount").text(`Wins: ${scoreboard.player2wins}`)
        $("#player2lossCount").text(`Losses: ${scoreboard.player2losses}`)
    }
};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MESSAGES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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
                    $(newBlock).addClass('alert alert-warning')
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

//##########################################################################################################################
//#################################### INITIAL + CONTINUOUS READ FROM DATABASE #############################################
//##########################################################################################################################

database.ref('/player1').on("value", function (snapshot) {
    player1.syncFromDatabase(snapshot)
    player1.updatePlayerInformationOnHUD()
    //Analyze player actions
    if (player1.isReady && player2.isReady) {
        game.processGameCompletion()
    };
});

database.ref('/player2').on("value", function (snapshot) {
    player2.syncFromDatabase(snapshot)
    player2.updatePlayerInformationOnHUD()
    //Analyze player actions
    if (player1.isReady && player2.isReady) {
        game.processGameCompletion()
    };
});

database.ref('/game').on("value", function (snapshot) {
    game.syncFromDatabase(snapshot)
    game.updateResultsOnDOM()
});

database.ref('/scoreboard').on("value", function (snapshot) {
    scoreboard.syncFromDatabase(snapshot)
    console.log(scoreboard)
    scoreboard.updateDOM()
});

database.ref('/messages').on("value", function (snapshot) {
    messages.updateMessages()
});

//##########################################################################################################################
//################################################ EVENT LISTENERS #########################################################
//##########################################################################################################################

$(document).ready(function () {
    $('#editPlayer1infoPanel').hide()
    $('#editPlayer1selectionPanel').hide()
    $('#editPlayer2infoPanel').hide()
    $('#editPlayer2selectionPanel').hide()
    $('#player1nameDisplay').css({ 'font-size': '30px' })
    $('#player1nameDisplay').css({ 'font-weight': '800' })
    $('#player2nameDisplay').css({ 'font-size': '30px' })
    $('#player2nameDisplay').css({ 'font-weight': '800' })
})

$(document).on("click", "#editPlayer1infoToggler", function () {
    $('#editPlayer1infoPanel').slideToggle()
})

$(document).on("click", "#editPlayer1selectionToggler", function () {
    $('#editPlayer1selectionPanel').slideToggle()
})

$(document).on("click", "#editPlayer2infoToggler", function () {
    $('#editPlayer2infoPanel').slideToggle()
})

$(document).on("click", "#editPlayer2selectionToggler", function () {
    $('#editPlayer2selectionPanel').slideToggle()
})

//##########################################################################################################################
//################################################ TRACK ACTIVE USERS ######################################################
//##########################################################################################################################

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
