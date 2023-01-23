function startGame() {
    // laat een bericht zien voor een bedank van het spelen van de game
    document.getElementById("gameStatus").innerHTML = "Dankuwel voor het spelen van mijn prachtige game! Abdel wenst je verder veel plezier op de website!";
    
    // Hussel een random nummer tussen de 1 en de 100
    var randomNumber = Math.floor(Math.random() * 100) + 1;
    
    // Stel een teller in voor het aantal gokken
    var guessCount = 0;
    
    // Stel een vlag in om bij te houden of je de spel hebt gewonnen
    var gameWon = false;
    
    // Start de game herhalend
    while (!gameWon) {
      // ontvang de gok van de speler
      var guess = prompt("Type een cijfer tussen (1-100):");
      
      // Verhoog de gokteller
      guessCount++;
      
      // Controleer of de gok juist is
      if (guess == randomNumber) {
        gameWon = true;
      } else if (guess < randomNumber) {
        // Als de gok te laag is, laat dan een hint zien
        alert("Jou antwoord is te laag. Probeer nogmaals.");
      } else {
        // Als de gok te hoog is, laat dan een hint zien
        alert("Jou antwoord is te hoog. Probeer nogmaals.");
      }
    }
    
    // Laat een bericht zien aan de speler dat hij heeft gewonnen heeft en waarbij hij word gefeliciteeerd
    alert("Gefeliciteerd!  Je hebt het cijfer goed geraden binnen " + guessCount + "* ongelovenlijk!");
  }