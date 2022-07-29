let countspan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//set options
let currentIndex = 0;
let right_answer =0;
let countdownintervale;


function getQuestions(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText)
            let qCount = questionObject.length;
            // console.log(qCount);

            createBullets(qCount);

            addQuestionData(questionObject[currentIndex], qCount);

            //countdown start 

            countDown(10,qCount);
            // click on submit 
            submitButton.onclick = () => {

                // get he right answer 
                let theRightAnswer = questionObject[currentIndex].right_answer;
                // console.log(theRightAnswer);
                // increase index 
                currentIndex++;
                //check the answer 
                checkAnswer(theRightAnswer, qCount);

                // remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML ="";

                // add next question 
                addQuestionData(questionObject[currentIndex], qCount);

                // handle bullets class
                handleBullets();


                // countdown restart 
                clearInterval(countdownintervale);
                countDown(10,qCount);
                // show results 

                showResults(qCount);

            };

        }
    }
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions()

function createBullets(num){
    countspan.innerHTML = num;

    for (let i = 0; i < num; i++){
        let theBullet = document.createElement("span");
        if (i === 0){
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
}


//

function addQuestionData(obj, count){
    
    if (currentIndex < count){

        // create h2 qst 
    let questionTitle = document.createElement("h2");
    
    //create qst text 
    let questionText = document.createTextNode(obj['title']);

    //append text to h2
    questionTitle.appendChild(questionText);

    //appen h2 to the quizArea

    quizArea.appendChild(questionTitle);

    //answers 
    for (let i = 1; i<=4 ; i++){
        //create main answer dev
        let mainDiv = document.createElement("div");

        //add class to maindiv
        mainDiv.className = 'answer';

        //create radio input

        let radioinput = document.createElement("input");

        // add type + name +id + data attribute
        radioinput.name = 'question';
        radioinput.type = 'radio';
        radioinput.id = `answer_${i}`;
        radioinput.dataset.answer = obj[`answer_${i}`];

        // make first option selected 

        if (i === 1){
            radioinput.checked = true;
        }

        // create label

        let theLabel = document.createElement("label");

        //add for attribute

        theLabel.htmlFor = `answer_${i}`;

        //create label text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        // add the text to the label

        theLabel.appendChild(theLabelText);

        // add input + label to main div

        mainDiv.appendChild(radioinput);
        mainDiv.appendChild(theLabel);

        // append all divs to answers area
        answersArea.appendChild(mainDiv);

    }
    }

}


function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let thechoosenAnswer;

    for (let i = 0 ; i < answers.length; i++){
        if (answers[i].checked){
            thechoosenAnswer = answers[i].dataset.answer;
            
        }
    }

    console.log(`the right answer is: ${rAnswer}`);
    console.log(`the choosen answer is: ${thechoosenAnswer}`);

    if ( rAnswer === thechoosenAnswer){
        right_answer++;
        console.log("good answer");
    } else {
        console.log("not good answer");
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index){
            span.className = 'on';
        }

    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        
        if (right_answer > (count /2) && right_answer < count){
            theResults = `<span class="good">good</span>, ${right_answer} from ${count} is good`;

        } else if (right_answer === count){
            theResults = `<span class="perfect">perfect</span>, all answers is good`;
        }else {
            theResults = `<span class="bad">bad</span>, ${right_answer} from ${count} is good`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgrondColor = 'white';
        resultsContainer.style.marginTop = '10px';
    }

}

function countDown(duration, count){
    if (currentIndex < count){
        let minutes, secondes;
        countdownintervale = setInterval(function(){
            minutes = parseInt(duration / 60);
            secondes = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes} `: minutes;
            secondes = secondes < 10 ? `0${secondes} `: secondes;
            
            countdownElement.innerHTML = `${minutes}:${secondes}`;
            if (--duration <0){
                clearInterval(countdownintervale);
                submitButton.click();
                console.log("finished")
            }
        }, 1000);
    }
}