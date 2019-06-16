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

//#################################### INITIAL READ FROM DATABASE #############################################

//Process read
database.ref().on("value", function (snapshot) {

    //Grab the data, save to variables
    let player1name = snapshot.val().player1.name
    let player1country = snapshot.val().player1.country
    let player2name = snapshot.val().player2.name
    let player2country = snapshot.val().player2.country

    //Put that info on the DOM
    $("main").append(`<p>Player 1: ${player1name} of ${player1country}</p>`);
    $("main").append(`<p>Player 2: ${player2name} of ${player2country}</p>`);

}, function (error) {
    console.log("Error: " + error.code); // Catch errors
});

//#################################### WRITE TO DATABASE #############################################

function updatePlayerInformation(number) {


    let docToAlter = '/player' + number

    let nameInputToGrab = `#player${number}nameInput`
    let countryInputToGrab = `#player${number}countryInput`

    let nameValue = $(nameInputToGrab).val().trim()
    let countryValue = $(countryInputToGrab).val().trim()

    database.ref(docToAlter).set({
        name: nameValue,
        country: countryValue
    });
}
