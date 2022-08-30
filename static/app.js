
const container = document.getElementById("container");
const form = document.getElementById("user-guess-form");
const userGuessInput = document.getElementById("user_guess")
const serverResponseCont = document.getElementById("server-response");
const currentScoreCont = document.getElementById("current-score-cont");
const overlay = document.getElementById("overlay");

form.addEventListener('submit', handleSubmit)

score = 0;
guessed_words = [];

async function handleSubmit(evt) {
    evt.preventDefault();

    const userGuessVal = userGuessInput.value;

    /* Check if our user's guessed word has already been guessed */
    if (userGuessVal == "") {
        serverResponseCont.innerText = "PLEASE ENTER A WORD"
        return
    }
    
    if (guessed_words.includes(userGuessVal)){
        serverResponseCont.innerText = "WORD ALREADY USED. PLEASE PICK ANOTHER WORD"
        userGuessInput.value = "";
        return
    }


    /* If user guess is valid, and hasn't been used, send the word to our server to check if it is valid */
    let eval_url = `http://127.0.0.1:5000/eval-guess?user_guess=${userGuessVal}`;
    const response = await axios.post(eval_url);

    /* If the guess is "not a word" let the user know */
    if (response.data['result'] == "not-word") {
        serverResponseCont.innerText = "NOT A WORD.  PLEASE ENTER A WORD."
    /* If the guess is "not on board" let the user know */
    } else if (response.data['result'] == "not-on-board") {
        serverResponseCont.innerText = "WORD DOES NOT EXIST ON BOARD.  PLEASE TRY AGAIN."
    /* If the word is valid, add it to our guessed_words list and update our score */
    } else if (response.data['result'] == "ok") {
        /* add our word to list of used words */
        guessed_words.push(userGuessVal)
        /* updatee our score and display */
        score = updateScore(userGuessVal);
        currentScoreCont.innerText = score;
        /* send a message to the user congratulating them */
        serverResponseCont.innerText = "GOOD JOB!"
    }

    userGuessInput.value = "";
}

/* start the game by and start our timer */
function startGame(){
    userGuessInput.value = "";
    currentScoreCont.innerText = score;
    console.log("start game");
    let timer = setTimeout(function() {
        form.classList.add("disabled")
        userGuessInput.blur();
        overlay.classList.add("show");
        console.log("game over");
        updateUserStats(score);
        clearTimeout(timer);
    }, 60000)
}

function updateScore(word) {
    let current_word_score = word.length;
    return score += current_word_score;
}

async function updateUserStats(score){
    let update_url = `http://127.0.0.1:5000/update-stats?score=${score}`;
    const response = await axios.post(update_url);
    console.log(response)
}
 
startGame();