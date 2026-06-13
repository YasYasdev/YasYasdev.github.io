// ===== SELECTORS =====
const vraag = document.querySelector(".vraag");
const answerA = document.querySelector(".answer-a");
const answerB = document.querySelector(".answer-b");
const answerC = document.querySelector(".answer-c");
const answerD = document.querySelector(".answer-d");

const btVolgende = document.querySelector(".pvolgende");
const btVorige = document.querySelector(".pvorige");
const opnieuw = document.querySelector(".reset");

const vraagImg = document.querySelector(".vraag-img");
const counter = document.querySelector(".counter");
const eind = document.querySelector(".einde");

let score = 0;
let questinIndex = 0;
let alBeantwoord = false;

// images
let afbeeldingen = [
  "img/image.png",
  "img/lowkick.jpg",
  "img/lowkick.jpg",
  "img/KO.png",
  "img/charlesclicnh.jpg",
  "img/gear.jpg",
  "img/Teep.png",
  "img/hook.jpg",
  "img/Japan.jpg",
  "img/frontkk.jpg"
];

// vragen en antwoorden
let vragen = [
  "Wat is een jab in kickboxen?",
  "Welk lichaamsdeel gebruik je voor een low kick?",
  "Hoe heet een trap met een cirkelvormige beweging?",
  "Wat betekent 'KO' in een wedstrijd?",
  "Wat is een 'clinch'?",
  "Welke beschermingsmiddelen zijn verplicht bij amateur kickboxen?",
  "Wat is het doel van een 'teep' (push kick)?",
  "Welke stoot komt van opzij en draait op de schouder?",
  "Waar ontstond modern kickboxen?",
  "Wat is een front kick?"
];

let antwoordenA = [
  "Een rechte stoot met de voorste hand",
  "Voet",
  "Front kick",
  "Kick Only",
  "Vastpakken van de tegenstander",
  "Alleen handschoenen",
  "Om afstand te creëren",
  "Hook",
  "Japan",
  "Trap recht naar voren"
];

let antwoordenB = [
  "Een trap naar het hoofd",
  "Scheenbeen",
  "Roundhouse kick",
  "Knock Out",
  "Een verdedigende stoot",
  "Handschoenen en bitje",
  "Om knock-out te slaan",
  "Jab",
  "Thailand",
  "Side kick"
];

let antwoordenC = [
  "Een verdedigende beweging",
  "Knie",
  "Side kick",
  "Kick Off",
  "Een stootcombinatie",
  "Handschoenen, bitje en scheenbeschermers",
  "Om sierlijk te bewegen",
  "Cross",
  "Nederland",
  "Roundhouse kick"
];

let antwoordenD = [
  "Een worp",
  "Hiel",
  "Axe kick",
  "Knee",
  "Een trap",
  "Handschoenen, bitje, scheenbeschermers en helm",
  "Om tegenstander te laten vallen",
  "Uppercut",
  "Verenigde Staten",
  "Achterwaartse trap"
];

let goedeAntwoord = ["a","b","b","b","a","d","a","a","a","a"];

// functies maken
function updateCounter() {
  if (counter) {
    counter.innerHTML = "Vraag " + (questinIndex + 1) + " van " + vragen.length;
  }
}

function resetKleuren() {
  answerA.classList.remove("rood", "green");
  answerB.classList.remove("rood", "green");
  answerC.classList.remove("rood", "green");
  answerD.classList.remove("rood", "green");
}

function woord() {
  resetKleuren();
  alBeantwoord = false;

  vraag.innerHTML = vragen[questinIndex];
  answerA.innerHTML = antwoordenA[questinIndex];
  answerB.innerHTML = antwoordenB[questinIndex];
  answerC.innerHTML = antwoordenC[questinIndex];
  answerD.innerHTML = antwoordenD[questinIndex];

  if (vraagImg) {
    if (afbeeldingen[questinIndex]) {
      vraagImg.src = afbeeldingen[questinIndex];
      vraagImg.style.display = "block";
    } else {
      vraagImg.style.display = "none";
    }
  }

  updateCounter();
}

function toonResultaat() {
  // Alles verstoppen
  vraag.style.display = "none";
  answerA.style.display = "none";
  answerB.style.display = "none";
  answerC.style.display = "none";
  answerD.style.display = "none";
  btVolgende.style.display = "none";
  btVorige.style.display = "none";
  if (vraagImg) vraagImg.style.display = "none";
  if (counter) counter.style.display = "none";

  // Resultaat tonen
  eind.style.display = "block";
  eind.innerHTML =
    "Goed gedaan " + naam + "!<br>Je score is: " + score + " van " + vragen.length;
}

function checkAnswer(answer) {
  if (alBeantwoord == false) {
    alBeantwoord = true;

    answerA.classList.add("rood");
    answerB.classList.add("rood");
    answerC.classList.add("rood");
    answerD.classList.add("rood");

    if (goedeAntwoord[questinIndex] == answer) {
      score++;
    }

    if (goedeAntwoord[questinIndex] == "a") {
      answerA.classList.remove("rood");
      answerA.classList.add("green");
    } else if (goedeAntwoord[questinIndex] == "b") {
      answerB.classList.remove("rood");
      answerB.classList.add("green");
    } else if (goedeAntwoord[questinIndex] == "c") {
      answerC.classList.remove("rood");
      answerC.classList.add("green");
    } else if (goedeAntwoord[questinIndex] == "d") {
      answerD.classList.remove("rood");
      answerD.classList.add("green");
    }
  }
}

// start
woord();

// antwoord klikken
answerA.addEventListener("click", function () { checkAnswer("a"); });
answerB.addEventListener("click", function () { checkAnswer("b"); });
answerC.addEventListener("click", function () { checkAnswer("c"); });
answerD.addEventListener("click", function () { checkAnswer("d"); });

// knopjes
btVolgende.addEventListener("click", function () {
  if (alBeantwoord == false) {
    alert("Kies eerst een antwoord!");
  } else {
    questinIndex++;

    if (questinIndex < vragen.length) {
      woord();
    } else {
      toonResultaat();
    }
  }
});

btVorige.addEventListener("click", function () {
  if (questinIndex > 0) {
    questinIndex--;
    woord();
  }
});

opnieuw.addEventListener("click", function () {
  window.location.href = "../projecten.html";
});

