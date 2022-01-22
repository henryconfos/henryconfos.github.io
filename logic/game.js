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
    if(this.id == ""){
        if(lastHighlighted == undefined){
            this.id = "highlighted";
            lastHighlighted = this;
        }else{
            if(lastHighlighted.id != "correct"){
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

function guess(letter) {
    $(lastHighlighted).children().text(letter);

    var posClass = lastHighlighted.className;
    var pos = posClass.slice(-2);
    var correctLetter = puzzle[pos]

    //Deal with guess

    //if correct:
    for(const letters in puzzle){
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