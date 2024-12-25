$(document).ready(function () {
    let model;
    let score;

    async function initialize() {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://backend.jutsumetsu.top/api', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4 && xhr.status === 200){
                console.log('数据已成功发送到服务器');
            };
        }
        xhr.send(localStorage.getItem('TRPGFrom'));
        localStorage.removeItem('TRPGFrom');
        score = JSON.parse(localStorage.getItem('Score'));
        localStorage.removeItem('Score');
        model = await $.getJSON('POT.json');

        if (model == undefined || score == undefined) {
            console.log("failed to parse parameters");
        }

        drawGraph();
    }

    function getHeight() {
        return 700
    }

    function drawGraph() {
        const width = 600;
        const height = getHeight();
        const Y_STEP = 100;
        const font_l = {
            family: 'Helvetica',
            size: 24,
            anchor: 'start',
            leading: '1em'
        };
        const font_light = {
            family: 'Helvetica',
            size: 24,
            anchor: 'start',
            leading: '1em',
            weight: 300
        };
        const font_r = {
            family: 'Helvetica',
            size: 24,
            anchor: 'end',
            leading: '1em'
        };
        const font_ideology = {
            family: 'Helvetica',
            size: 40,
            anchor: 'start',
            weight: 300
        };
        const font_title = {
            family: "monospace",
            size: 16,
            anchor: 'start'
        }

        let svg = SVG(document.getElementById("graph"));
        svg.attr("viewBox", `0 0 ${width} ${height}`);
        svg.rect(width, height).x(0).y(0).fill("#EEE");


        for (let i = 0; i < model.dimensions.length; i++) {
            let y = i * Y_STEP;
            // draw progress bar
            let gradient = svg.gradient("linear", (add) => {
                add.stop(0, "#d06");
                add.stop((score[i] - 2) / 100, "#d06");
                add.stop((score[i] + 2) / 100, "#0d9");
                add.stop(1, "#0d9");
            });
            svg.rect().attr({
                width: 400,
                height: 40,
                x: 100,
                y: 40 + y,
                rx: 5,
                ry: 5,
                fill: gradient
            });

            // draw percentage
            svg.text(score[i] + "%").attr({
                x: 100 + 5,
                y: y + 40 + 5,
                fill: "#FFF",
            }).font(font_l);
            svg.text((100 - score[i]) + "%").attr({
                x: 500 - 5,
                y: y + 40 + 5,
                fill: "#FFF",
            }).font(font_r);

            // draw text
            let explanation = model.explanations[i][6 - Math.round((score[i] / 100) * 6)];
            let opposite = model.dimensions[i].split("-");
            svg.text(explanation).attr({
                x: 100,
                y: y + 5,
                fill: "#000"
            }).font(font_light);
            svg.text(opposite[0]).attr({
                x: 100 - 5,
                y: y + 40 + 5,
                fill: "#000"
            }).font(font_r);
            svg.text(opposite[1]).attr({
                x: 500 + 5,
                y: y + 40 + 5,
                fill: "#000"
            }).font(font_l);
        }

        let y = model.dimensions.length * Y_STEP;
        let ideology = findIdeology(score, model.ideologies);
        svg.text("最接近的意识形态：").attr({
            x: 30,
            y: y + 30,
            fill: "black"
        }).font(font_l);
        svg.text(ideology).attr({
            x: 30,
            y: y + 60,
            fill: "black"
        }).font(font_ideology);
        svg.text("基于8values的政治倾向测试").attr({
            x: 370,
            y: height - 60,
            fill: "black"
        }).font(font_title);


        $("#btn-result-save").removeAttr("disabled");
    }

    function vecDistance(vec1, vec2) {
        let distance = 0;
        vec1.forEach((value, index) => {
            distance += (value - vec2[index]) ** 2;
        });

        return Math.sqrt(distance);
    }

    function findIdeology(score, ideologies) {
        let ideology = Object.keys(ideologies)[0];
        let min_distance = vecDistance(ideologies[ideology], score);

        for (let [key, value] of Object.entries(ideologies)) {
            let distance = vecDistance(value, score);
            if (distance < min_distance) {
                ideology = key;
                min_distance = distance;
            }
        }

        return ideology;
    }

    function encodeSVG (svg) {
        // first create a clone of our svg node so we don't mess the original one
        var clone = svg.cloneNode(true);

        // create a doctype
        var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
        // a fresh svg document
        var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
        // replace the documentElement with our clone
        svgDoc.replaceChild(clone, svgDoc.documentElement);
        // get the data
        var svgData = (new XMLSerializer()).serializeToString(svgDoc);

        // now you've got your svg data, the following will depend on how you want to download it
        // e.g yo could make a Blob of it for FileSaver.js
        /*
        var blob = new Blob([svgData.replace(/></g, '>\n\r<')]);
        saveAs(blob, 'myAwesomeSVG.svg');
        */
        // here I'll just make a simple a with download attribute

        return 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
    };

    initialize();

    $("#btn-result-save").click(function () {
        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = getHeight();
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        let ctx = canvas.getContext("2d");

        let image = new Image();
        image.src = encodeSVG(document.getElementById("graph"));
        image.onload = function (){
            ctx.drawImage(image, 0, 0);
            let a = document.createElement('a');
            a.download = "compass.png";
            a.href = canvas.toDataURL("image/png");
            a.click();
        };
    });
});
