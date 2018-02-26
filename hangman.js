var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./word.js');
var Game = require('./game.js');
var hangManDisplay = Game.newWord.hangman;
var wordBank = Game.newWord.wordList;
var guessesRemaining = 5;
var guessedLetters = [];
var display = 0;
var currentWord;

startGame();

function startGame() {
    console.log('------------------------------------------------------------');
    console.log('');
    console.log('Welcome to Hangman!');
    console.log('');
    console.log('-------------------------------------------------------------');

    if (guessedLetters.length > 0) {
        guessedLetters = [];
    }

    inquirer.prompt([{
        name: 'play',
        type: 'confirm',
        message: 'Ready to play?'
    }]).then(function(answer) {
        if (answer.play) {
            console.log('');
            console.log('You have 5 guesses.');
            newGame();
        } else {
            console.log('Leaving already?');
        }
    });
}

function newGame() {
    if (guessesRemaining === 5) {
        console.log('_________________________________________________________');
        var randNum = Math.floor(Math.random() * wordBank.length);
        currentWord = new Word(wordBank[randNum]);
        currentWord.getLetters();
        console.log('');
        console.log(currentWord.wordRender());
        console.log('');
        promptUser();
    } else {
        resetGuessesRemaining();
        newGame();
    }
}

function resetGuessesRemaining() {
    guessesRemaining = 5;
}

function promptUser() {
    inquirer.prompt([{
        name: 'chosenLetter',
        type: 'input',
        message: 'Choose a letter',
        validate: function(value) {
            if (isLetter(value)) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(ltr) {

        var letterReturned = ltr.chosenLetter.toUpperCase();

        var guessedAlready = false;
        for (var i = 0; i < guessedLetters.length; i++) {
            if (letterReturned === guessedLetters[i]) {
                guessedAlready = true;
            }
        }
        if (guessedAlready === false) {

            guessedLetters.push(letterReturned);

            var found = currentWord.checkIfLetterFound(letterReturned);
            if (found === 0) {
                console.log('Sorry, try again!');
                guessesRemaining--;
                console.log('_________________________________________________________');
                console.log('');
                console.log(currentWord.wordRender());
                console.log('');
                console.log('_________________________________________________________');
                console.log('Letters guessed: ' + guessedLetters);
            } else {
                console.log('You are correct!');
                if (currentWord.checkWord() === true) {
                    console.log('');
                    console.log(currentWord.wordRender());
                    console.log('');
                    startGame();
                } else {
                    console.log('Guesses remaining: ' + guessesRemaining);
                    console.log('');
                    console.log(currentWord.wordRender());
                    console.log('');
                    console.log('_________________________________________________________');
                    console.log('Letters guessed: ' + guessedLetters);
                }
            }
            if (guessesRemaining > 0 && currentWord.wordFound === false) {
                promptUser();
            } else if (guessesRemaining === 0) {
                console.log('');
                console.log('The correct word was: ' + currentWord.word);
                console.log('');
            }
        } else {

            console.log('Sorry');
            promptUser();
        }
    });
}