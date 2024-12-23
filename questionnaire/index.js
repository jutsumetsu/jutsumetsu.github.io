function submitTRPGFrom(shouldTurn){

    const Qnumber = document.getElementById('Qnumber').value;
    const preBG = document.getElementById('preBG').value;
    const moral = document.getElementById('moral').value;
    const lawful = document.getElementById('lawful').value;
    const pcname = document.getElementById('pcname').value;
    const pcage = document.getElementById('pcage').value;
    const pcsex = document.getElementById('pcsex').value;
    const pcstatus = document.getElementById('pcstatus').value;
    const pcBG = document.getElementById('pcBG').value;
    const RPT1 = document.getElementById('RPT1').value;
    const RPT2 = document.getElementById('RPT2').value;
    const RPT3 = document.getElementById('RPT3').value;

    console.log('QQ号:', Qnumber);
    console.log('曾用背景:', preBG);
    console.log('道德倾向', moral);
    console.log('秩序倾向:', lawful);
    console.log('人物卡姓名:', pcname);
    console.log('人物卡年龄:', pcage);
    console.log('人物卡性别:', pcsex);
    console.log('人物卡身份:', pcstatus);
    console.log('人物卡背景:', pcBG);
    console.log('流浪儿情景:', RPT1);
    console.log('无法战胜情景:', RPT2);
    console.log('理念相悖情景:', RPT3);

    // 验证数据
    if (Qnumber == ''){
        alert('QQ号不能为空');
        return;
    }
    else if (isNaN(Qnumber)){
        alert('请正确填写QQ号');
        return;
    }

    if (preBG == ''){
        alert('曾用人物卡背景不能为空');
        return;
    }

    if (moral == ''){
        alert('道德倾向不能为空');
        return;
    }
    if (lawful == ''){
        alert('秩序倾向不能为空');
        return;
    }

    if (pcname == ''){
        alert('人物卡姓名不能为空');
        return;
    }

    if (pcage == ''){
        alert('人物卡年龄不能为空');
        return;
    }
    else if (isNaN(Qnumber)){
        alert('人物卡年龄应当为数字');
        return;
    }

    if (pcsex == ''){
        alert('人物卡性别不能为空');
        return;
    }
    if (pcstatus== ''){
        alert('人物卡身份不能为空');
        return;
    }
    if (pcBG == ''){
        alert('人物卡背景不能为空');
        return;
    }
    if (RPT1 == ''){
        alert('RP情景测验第一题不能为空');
        return;
    }

    const data = JSON.stringify({
        "QQ号": Qnumber,
        '曾用背景': preBG,
        '道德倾向': moral,
        '秩序倾向': lawful,
        '人物卡姓名': pcname,
        '人物卡年龄': pcage,
        '人物卡性别': pcsex,
        '人物卡身份': pcstatus,
        '人物卡背景': pcBG,
        '流浪儿情景': RPT1,
        '无法战胜情景': RPT2,
        '理念相悖情景': RPT3
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://backend.jutsumetsu.top/data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            console.log('数据已成功发送到服务器');
        };
    }
    // 这里可以进一步处理数据，比如发送到服务器
    if(!shouldTurn){
        xhr.send(data);
    }
    else{
        xhr.send(data);
    }

    const xhr2 = new XMLHttpRequest();
    xhr2.open('POST', 'https://backend.jutsumetsu.top/api', true);
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.onreadystatechange = function(){
        if (xhr2.readyState === 4 && xhr2.status === 200){
            console.log('数据已成功发送到服务器');
        };
    }
    // 这里可以进一步处理数据，比如发送到服务器
    if(!shouldTurn){
        xhr2.send(data);
    }
    else{
        xhr2.send(data);
    }

}


$("#btn-submit").click(function(){
    submitTRPGFrom();
});

$("#btn-quiz").click(function(){
    submitTRPGFrom();
});