$(document).ready(function () {  // Use closure, no globals
    let scores;
    let current_question = 0;
    let questions;
    let model;
    let form;
    let choice = [];
    let originalIndices = [];

    initialize();

    async function initialize(){
        form = JSON.parse(localStorage.getItem('TRPGFrom'));
        localStorage.removeItem('TRPGFrom');
        console.log('QQ号：',form["QQ号"]);
        model = await $.getJSON('POT.json')
            .fail(()=>console.log("failed to load questions"));
        questions = model.questions;
        scores = new Array(questions.length).fill(0);
        for (let i = 0; i < questions.length; i++) {
            originalIndices.push(i);
        }
        // Shuffle Quesions
        questions.sort(() => Math.random() - 0.5);

        $("#btn-strongly-positive")
            .click(()=>{ scores[current_question] = +1.0; save_choice('强烈同意'); next_question() });
        $("#btn-positive")          
            .click(()=>{ scores[current_question] = +0.5; save_choice('同意'); next_question() });
        $("#btn-uncertain")        
            .click(()=>{ scores[current_question] =  0.0; save_choice('中立/不确定'); next_question() });
        $("#btn-negative")         
            .click(()=>{ scores[current_question] = -0.5; save_choice('反对'); next_question() });
        $("#btn-strongly-negative")
            .click(()=>{ scores[current_question] = -1.0; save_choice('强烈反对'); next_question() });

        $("#btn-prev").click(()=>{ prev_question() });

        render_question();
    }

    function render_question() {
        $("#question-text").html(questions[current_question].text);
        $("#question-number").html(`第 ${current_question + 1} 题 剩余 ${questions.length - current_question - 1} 题`);
        if (current_question == 0) {
            $("#btn-prev").attr("disabled", "disabled");
        } else {
            $("#btn-prev").removeAttr("disabled");
        }
    }

    function next_question() {
        if (current_question < questions.length - 1) {
            current_question++;
            render_question();
        } else {
            results();
        }
    }

    function prev_question() {
        if (current_question != 0) {
            current_question--;
            render_question();
        }

    }

    function save_choice(text){
        choice[`${questions[current_question].text}`] = text;
        console.log(`${questions[current_question].text}-`, text);
    }

    function restoreChoiceOrder() {
        let restoredChoice = {};
        originalIndices.forEach((index) => {
            restoredChoice[`${questions[index].text}`] = choice[`${questions[index].text}`];
        });
        return restoredChoice;
    }

    function results() {
        const d = model.dimensions.length;
        let score = new Array(d).fill(0);
        let max_score = [...score];
        for (let i = 0; i < scores.length; i ++ ) {
            for (let key = 0; key < d; key ++){
                score[key] += scores[i] * questions[i].evaluation[key];
                max_score[key] += Math.abs(questions[i].evaluation[key]);
            }
        }

        choice = restoreChoiceOrder();
        form.push(...choice);

        for (let key = 0; key < d; key ++ ){
            score[key] = (score[key] + max_score[key]) / (2*max_score[key]);
            score[key] = Math.round(score[key] * 100);
        } 

        form['score'] = score.join();
        const data = JSON.stringify(form);
        const data_score = JSON.stringify(score);
        localStorage.setItem("TRPGFrom",data);
        localStorage.setItem("Score",data_score);

        location.href = "result.html"; 
    }
});