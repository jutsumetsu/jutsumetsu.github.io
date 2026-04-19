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
    else if (isNaN(parseFloat(pcage)) || !isFinite(pcage)){
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
    xhr.open('POST', 'https://backend.jutsumetsu.top/api/questionnaire', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            console.log('数据已成功发送到服务器');
            alert("提交成功！");
        }
    }
    // 这里可以进一步处理数据，比如发送到服务器
    if(!shouldTurn){
        xhr.send(data);
    }
    else{
        localStorage.setItem("TRPGFrom",data);
    }
}


$("#btn-submit").click(function(){
    submitTRPGFrom(false);
});

$("#btn-quiz").click(function(){
    submitTRPGFrom(true);
    location.href= './quiz.html';
});

const AUTO_SAVE_KEY = 'TRPGFormAutoSave';  // 独立存储 key，不影响原有逻辑

// 保存所有表单数据到 localStorage
function saveFormData() {
    const formData = {
        // 文本输入框 / 文本域
        Qnumber: $('#Qnumber').val(),
        preBG: $('#preBG').val(),
        pcname: $('#pcname').val(),
        pcage: $('#pcage').val(),
        pcsex: $('#pcsex').val(),
        pcstatus: $('#pcstatus').val(),
        pcBG: $('#pcBG').val(),
        RPT1: $('#RPT1').val(),
        RPT2: $('#RPT2').val(),
        RPT3: $('#RPT3').val(),
        // 单选按钮组
        moral: $('input[name="moral"]:checked').val() || '',
        lawful: $('input[name="lawful"]:checked').val() || '',
        politics: $('input[name="politics"]:checked').val() || ''
    };
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
}

// 从 localStorage 恢复数据到表单
function loadFormData() {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        // 恢复文本类输入框
        $('#Qnumber').val(data.Qnumber || '');
        $('#preBG').val(data.preBG || '');
        $('#pcname').val(data.pcname || '');
        $('#pcage').val(data.pcage || '');
        $('#pcsex').val(data.pcsex || '');
        $('#pcstatus').val(data.pcstatus || '');
        $('#pcBG').val(data.pcBG || '');
        $('#RPT1').val(data.RPT1 || '');
        $('#RPT2').val(data.RPT2 || '');
        $('#RPT3').val(data.RPT3 || '');

        // 恢复单选按钮组
        if (data.moral) {
            $(`input[name="moral"][value="${data.moral}"]`).prop('checked', true);
        }
        if (data.lawful) {
            $(`input[name="lawful"][value="${data.lawful}"]`).prop('checked', true);
        }
        if (data.politics) {
            $(`input[name="politics"][value="${data.politics}"]`).prop('checked', true);
        }
    } catch (e) {
        console.error('恢复表单数据失败', e);
    }
}

// 页面加载完成后执行
$(function () {
    // 1. 恢复之前保存的数据
    loadFormData();

    // 2. 监听表单变化，实时保存
    // 文本输入框和文本域使用 input 事件
    $('#TRPG input[type="text"], #TRPG textarea').on('input', function () {
        saveFormData();
    });
    // 单选按钮使用 change 事件
    $('#TRPG input[type="radio"]').on('change', function () {
        saveFormData();
    });

    // 3. 恢复数据后，手动触发 politics 的 change 事件，以正确显示按钮
    $('input[name="politics"]').trigger('change');
});