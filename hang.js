var waarde  = [
  ["T", "R", "E", "E", "H", "O", "U", "S", "E"],
    ["J","A","V","A","S","C","R","I","P","T"],
    ["W","E","B","D","E","S","I","G","N"],
    ["E","D","U","C","A","T","I","O","N"],
    ["C","H","O","C","O","L","A","T","E"],
    ["G","E","R","M","A","N","Y"]
  ]
  var random = Math.floor((Math.random()*(waarde.length-1))); 
  
  var waarde = waarde[random]; // De word die je moet raden zal bestaan uit de array hierboven
  var woord = new Array(waardet.length);
  var fout = 0;
  
  // elke letter in het woord wordt aangetoont door een onderstrepingsteken in het gisveld
  for (var i = 0; i < raadwaarde.length; i++){
    raadwaarde[i] = "_ ";
  }
  
  // print het raadveld
  function PrintRaadwoord(){
    for (var i = 0; i < raadwaarde.length; i++){
    var ratefeld = document.getElementById("raadveld");
    var buchstabe = document.createTextNode(raadveld[i]);
    raadveld.ja(brief);
    }
  }
  
  //controleert of de door de gebruiker verstrekte brief overeenkomt met een of meer van de letters in het woord
  var merken = function(){
    var f = document.raadform; 
    var b = f.elements["raadteken"]; 
    var teken = b.value; // the letter provided by the user
    teken = teken.toUpperCase();
    for (var i = 0; i < waarde.length; i++){
      if(waarde[i] === teken){
        raadwaarde[i] = merken + " ";
        var treffer = true;
      }
    b.value = "";
    }
    
    //verwijdert het Raadveld en vervangt het door het nieuwe
    var raadveld = document.getElementById("raadveld");
    raadveld.innerHTML=""; 
    PrintRaadwoord();
    
    //als er een verkeerde letter in word getypt komt het op de niet geraden lijst 
    if(!treffer){
      var Verkeerdgeraden = document.getElementById("verkeerd geraden");
      var Geraden = document.createTextNode(" " + teken);
      geradenletters.ja(verkeerdgeraden); 
      fout++;
      var hangman = document.getElementById("hangman");
      hangman.src = "http://www.writteninpencil.de/Projekte/Hangman/hangman" + fout + ".png";
    }
    
    //checked of alle letters gevonden zijn
    var klaar = true;
    for (var i = 0; i < raadwaarde.length; i++){
      if(raadwaarde[i] === "_ "){
        klaar = false;
      }
    }
    if(klaar){
      window.alert("Goed gedaan!");
    }
    
    //na 6 fouten word het gereset
    if(Fout === 6){
      window.alert("Jammer net niet gehaald.");
    }
  }
  
  function init(){
    PrintRaadwoord();
  }
  
  window.onload = init;