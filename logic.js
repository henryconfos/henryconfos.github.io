var activeElm = null;
var lives = 4;
var played = false;

let today = new Date();
let day = String(today.getDate()+1).padStart(2, '0');
let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
let year = today.getFullYear();

// let formattedDate = day + '/' + month + '/' + year;
let formattedDate = Math.floor(Math.random() * 1191) + 1;

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
share = ["Corners #"+formattedDate+": "];

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
        
        var cLetter = document.getElementById(String.fromCharCode(97 + i)).textContent;


       // If correct letter and place
       if(cLetter == puzzle[i]){
        document.getElementById(String.fromCharCode(97 + i)).classList.add('green');

        
        if(!cGuess.includes(puzzle[i])){
            cGuess.push(puzzle[i]);
        }
       };

       if(cLetter != puzzle[i] && puzzle.includes(cLetter)){
        const elem = document.getElementById(String.fromCharCode(97 + i));
        if(elem.classList.contains('grey')){
            elem.classList.remove('grey');
        }
        elem.classList.add('yellow');
        setTimeout(function() {
            elem.classList.remove('yellow');
            elem.textContent = '';
        }, 1600);
       }


    }

    for (let i = 0; i < puzzle.length; i++) {
        for (let x = 0; x < cGuess.length; x++) {
            if(puzzle[i] == cGuess[x]){
                document.getElementById(String.fromCharCode(97 + i)).textContent = puzzle[i];
                document.getElementById(String.fromCharCode(97 + i)).classList.add('green');
            }
        }
     }

     var numItems = document.querySelectorAll('.green').length - 1;
     if(numItems == 12 && lives != 0){
         notify("That'll do it!");
         share.push("🟩");
         document.querySelector(".result").textContent = share.join("");
         document.querySelector('.r-div').style.display = 'block';
     }

}

function handleKeyPress(keyChar) {
    if(activeElm != null){

        if(keyChar == "DEL"){
            activeElm.textContent = '';
            activeElm.classList.remove("active");
            activeElm.classList.remove("yellow");
            activeElm.classList.remove("grey");
            return;
        }

        console.log(keyChar);
        if(cGuess.includes(keyChar)){
            notify("Already Guessed!");
            return;
        }

        var divWithLetter = Array.from(document.querySelectorAll("button.key")).filter(function(btn) {
            return btn.textContent.trim() === keyChar;
        });

        activeElm.textContent = keyChar;
        activeElm.classList.remove("active");

        // Check if wrong
        if(!puzzle.includes(keyChar)){

            activeElm.classList.add('grey');
            flipGrey(activeElm);
            share.push("⬜️ ");

            if(divWithLetter[0]) {
                divWithLetter[0].classList.add('strikethrough');
            }

            lives--;
            if(lives > 1){
                notify(lives+" guesses remaining.");
            }else{
                notify(lives+" guess remaining.");
            }
            if(lives == 0){
                cGuess = puzzle;
                share.push("❌");
                document.querySelector(".result").textContent = share.join("");
                document.querySelector('.r-div').style.display = 'block';
            }
        }else{
            aEID = activeElm.getAttribute("id");
            if( keyChar != puzzle[aEID.charCodeAt(0) - 97]){
                if(divWithLetter[0]) {
                    divWithLetter[0].classList.add('yellow');
                }
                share.push("🟨 ");
            }else{
                if(divWithLetter[0]) {
                    divWithLetter[0].classList.add('greenKey');
                }
            }
        }
        activeElm = null;
        checkPuzzle();

        
    }
}

function notify(message) {
    var notificationBox = document.getElementById('notificationBox');

    notificationBox.textContent = message;
 
    notificationBox.style.display = 'block';
    setTimeout(function() {
        notificationBox.style.display = 'none';
    }, 1700);
}

function flipGrey(elm) {
    setTimeout(function() {
        elm.classList.remove('grey');
        elm.textContent = '';
    }, 1600);
}


document.querySelectorAll('.box').forEach(function(box) {
    box.addEventListener('click', function() {
        if(!this.classList.contains("corner") && !this.classList.contains("green")){
            
            if(activeElm && activeElm !== this){
                activeElm.classList.remove("active");
            }

            
            this.classList.toggle("active");

            // Update activeElm to the currently clicked box if it's now active, or set to null if not
            activeElm = this.classList.contains("active") ? this : null;
        }
    });
});

function loadCorners(){
    for (let i = 0; i < corners.length; i++) {
        document.querySelector('.c'+i).textContent = corners[i];
    }
}



createKeyboard();
loadCorners();

document.onkeypress=function(e){
    console.log(e.key);
    handleKeyPress(e.key.toUpperCase());
}

if(!played){
    document.getElementById("popup").style.display = "block";
}

// Close the popup when the 'x' is clicked
document.querySelector(".close").addEventListener('click', function(){
    document.getElementById("popup").style.display = "none";
    localStorage.setItem("played", "yes");
});

document.querySelector(".share").addEventListener('click', function() {
    navigator.clipboard.writeText(document.querySelector(".result").textContent);
    notify("Copied!");
});
