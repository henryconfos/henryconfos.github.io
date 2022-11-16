var lastHighlighted;
var cHighlighted;
var puzzle = {
    aa: "T",
    ab: "R",
    ac: "I",
    ad: "M",
    ae: "S",
    ba: "O",
    be: "E",
    ca: "A",
    ce: "V",
    da: "S",
    de: "E",
    ea: "T",
    eb: "H",
    ec: "O",
    ed: "R",
    ef: "N"
}


$( ".l-box" ).click(function() {
    if(lastHighlighted == this){
        this.id = lastHighlighted.id;
    }
    if(this.id == "" || this.id == "incorrect" || this.id == "yellow"){
        if(lastHighlighted == undefined){
            this.id = "highlighted";
            lastHighlighted = this;
        }else{
            if(lastHighlighted.id != "correct" && lastHighlighted.id != "incorrect" && lastHighlighted.id != "yellow"){
                lastHighlighted.id = ""
            }
            this.id = "highlighted";
            lastHighlighted = this;
        }
    }
});

$( ".letter" ).click(function() {
    if(lastHighlighted == undefined){
        alert("Please select a slot by clicking on it!");
    }else{
        guess($(this).children().text());
    }
})


//user can cometimes put two letters in make sure first choice is selected. 
$(document).keyup(function(e){
    if(lastHighlighted != undefined){
        var l = e.key
        var nL = l.toUpperCase();
        console.log(nL);
        guess(nL);
    }
})




function guess(letter) {
    $(lastHighlighted).children().text(letter);

    var posClass = lastHighlighted.className;
    var pos = posClass.slice(-2);
    var correctLetter = puzzle[pos]
    var pContains = [];
    for(const l in puzzle){
        pContains.push(puzzle[l]);
    }
    console.log(pContains);
    //Deal with guess

    //if correct:
    for(const letters in puzzle){
        if(puzzle[letters] != letter && letter != correctLetter){
            //if the letter is in the puzzle but in the wrong spot
            // letter wrong spot in current word not in puzzle.
            //TODO: make sure the letter isn't one of the corner ones.
            if(pContains.indexOf(letter) >= 0){
                console.log("yellow");
                yellow();
                break;
            }else{
                incorrect();
                break;
            }
        }
        if(puzzle[letters] == letter){
            if(letter == correctLetter){
                if($("."+letters).attr('id') != "corner"){
                    $("."+letters).attr('id', 'correct');
                    $("."+letters).children().text(letter);
                }
            }
        }
    }

}

function incorrect() {
    lastHighlighted.id = "incorrect";
}

function yellow() {
    lastHighlighted.id = "yellow"
}