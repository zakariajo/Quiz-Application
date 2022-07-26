let countspan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let currentIndex = 0;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");

function getQuestions(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText)
            let qCount = questionObject.length;
            console.log(qCount);

            createBullets(qCount);

            addQuestionData(questionObject[currentIndex], qCount);

            // click on submit 
            submitButton.onclick = () => {

                // get he right answer 
                let theRightAnswer = questionObject[currentIndex].right_answer;
                console.log(theRightAnswer);
                // increase index 
                currentIndex++;
                //check the answer 
                checkAnswer(theRightAnswer, qCount);
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

function addQuestionData(obj, count){
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
        radioinput.dataset.asnwer = obj[`answer_${i}`];

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