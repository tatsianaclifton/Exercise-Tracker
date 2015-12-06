if(document.getElementById('kgs').value === "0")
    document.getElementById('kgs').checked = true;
else 
    document.getElementById('lbs').checked = true;

document.getElementById('lbs').addEventListener('click', function(){
    document.getElementById('lbs').value = "1";
    document.getElementById('lbs').checked = true;
});

document.getElementById('kgs').addEventListener('click', function(){
    document.getElementById('kgs').value = "0";
    document.getElementById('kgs').checked = true;
});

var date = new Date(document.getElementById('date').value);
document.getElementById('date').value = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()+1);
