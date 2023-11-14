var activeElm = null;
var lives = 4;
var played = false;

let today = new Date();
let day = String(today.getDate()+1).padStart(2, '0');
let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
let year = today.getFullYear();

// let formattedDate = day + '/' + month + '/' + year;
let formattedDate = Math.floor(Math.random() * 10) + 1;

if (localStorage.getItem("played") == null) {
    localStorage.setItem("played", "no");
    played = false;
}else{
    if(localStorage.getItem("played") == "yes"){
        played = true;
    }else{
        played = false;
    }
}

corners = p[formattedDate].corners;
puzzle = p[formattedDate].puzzle;
cGuess = [];


function createKeyboard() {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
    ];

    const keyboardDiv = document.getElementById('keyboard');

    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';

        row.forEach(keyChar => {
            const keyButton = document.createElement('button');
            keyButton.className = 'key';
            keyButton.textContent = keyChar;
            keyButton.addEventListener('click', () => handleKeyPress(keyChar));

            rowDiv.appendChild(keyButton);
        });

        keyboardDiv.appendChild(rowDiv);
    });
}


function checkPuzzle(){
    for (let i = 0; i < puzzle.length; i++) {
        
        var cLetter = $("#"+String.fromCharCode(97 + i)).text();


       // If correct letter and place
       if(cLetter == puzzle[i]){
        $("#"+String.fromCharCode(97 + i)).addClass('green');

        
        if(!cGuess.includes(puzzle[i])){
            cGuess.push(puzzle[i]);
        }
       };

       if(cLetter != puzzle[i] && puzzle.includes(cLetter)){
        $("#"+String.fromCharCode(97 + i)).addClass('yellow');
       }


    }

    for (let i = 0; i < puzzle.length; i++) {
        for (let x = 0; x < cGuess.length; x++) {
            if(puzzle[i] == cGuess[x]){
                $("#"+String.fromCharCode(97 + i)).text(puzzle[i]);
                // if($('#'+cLetter).hasClass('grey')){
                //     $('#'+cLetter).removeClass('grey')
                // }
                // if($('#'+cLetter).hasClass('yellow')){
                //     $('#'+cLetter).removeClass('yellow')
                // }
                $("#"+String.fromCharCode(97 + i)).addClass('green');
            }
        }
     }

     var numItems = $('.green').length -1;
     if(numItems == 12){
         notify("That'll do it!")
     }

}

function handleKeyPress(keyChar) {
    if(activeElm != null){

        if(keyChar == "DEL"){
            $(activeElm).text('');
            $(activeElm).removeClass("active");
            $(activeElm).removeClass("yellow");
            $(activeElm).removeClass("grey");
            return;
        }

        console.log(keyChar);
        if(cGuess.includes(keyChar)){
            notify("Already Guessed!");
            return;
        }

        

        $(activeElm).text(keyChar);
        $(activeElm).removeClass("active");

        // Check if wrong
        if(!puzzle.includes(keyChar)){
            console.log("wrong");
            $(activeElm).addClass('grey');
            var divWithLetter = $("button.key").filter(function() {
                return $(this).text().trim() === keyChar;
            });

            $(divWithLetter[0]).addClass('strikethrough')

            lives--
            if(lives > 1){
                notify(lives+" guesses remaining.")
            }else{
                notify(lives+" guess remaining.")
            }
            if(lives == 0){
                cGuess = puzzle;
            }
        }
        console.log("here");
        activeElm = null;
        checkPuzzle();

        
    }
}

function notify(message) {
    var $notificationBox = $('#notificationBox');

    $notificationBox.text(message);
 
    $notificationBox.fadeIn(200).delay(1500).fadeOut(200);
}


$('.box').on( "click", function() {
    if(!$(this).hasClass("corner") && !$(this).hasClass("green")){
        
        if(activeElm && activeElm !== this){
            $(activeElm).removeClass("active");
        }

        
        $(this).toggleClass("active");

        // Update activeElm to the currently clicked box if it's now active, or set to null if not
        activeElm = $(this).hasClass("active") ? this : null;

        // if($(this).hasClass('yellow')){
        //     $(this).removeClass("yellow");
        // }
                
        if($(this).hasClass('grey')){
            $(this).removeClass("grey");
        }
    }

  } );

function loadCorners(){
    for (let i = 0; i < corners.length; i++) {
        $('.c'+i).text(corners[i]);
    }
}



createKeyboard();
loadCorners();

document.onkeypress=function(e){
    console.log(e.key);
    handleKeyPress(e.key.toUpperCase());
}

if(!played){
    $("#popup").show();
}


$(".popup-content").animate({ bottom: "10%" }, "slow");

// Close the popup when the 'x' is clicked
$(".close").click(function(){
    $("#popup").fadeOut();
  $(".popup-content").animate({ bottom: "-100%" }, function() {
    $("#popup").hide(); 
    localStorage.setItem("played", "yes");
  });
});