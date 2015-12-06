/*CS290 Database Interactions Assignment
  Tatsiana Clifton */
  
 /*The script for creating table and handling AJAX requests*/

function buildTable(response){
    var table = document.getElementById('rows');
    table.innerHTML = "";

    //create rows with data
    response.forEach(function(r){
        //format date into string MM/DD/YY
        var date = new Date(r.date);
        r.date = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()+1);

        //convert units into 'lbs' or 'kgs'
        if(r.lbs == '1')    //if "lbs": 1
                r.lbs = 'lbs';     //display lbs
        if(r.lbs == '0')     //if "lbs": 0
                r.lbs = 'kgs';     //display kgs

        var row = document.createElement('tr');

        //creare cells with data for all except id
        Object.keys(r).forEach(function(c){
            if(c != 'id'){
                var cell = document.createElement('td');
                cell.textContent = r[c];
                row.appendChild(cell);
            }
        });

        //create edit button for every row
        var formEdit = document.createElement('form');
        formEdit.method = 'post';
        formEdit.action = '/';
        var idE = document.createElement('input');
        idE.type = 'hidden';
        idE.name = 'id';
        idE.value = r.id;
        var edit = document.createElement('input');
        edit.type = 'submit';
        edit.name = 'Edit';
        edit.value = 'Edit';
        formEdit.appendChild(idE);
        formEdit.appendChild(edit);

        //create delete button for every row
        var formDelete = document.createElement('form');
        var idD = document.createElement('input');
        idD.type = 'hidden';
        idD.name = 'id';
        idD.value = r.id;
        var deleting = document.createElement('input');
        deleting.type = 'submit';
        deleting.value = 'Delete';
        formDelete.appendChild(idD);
        formDelete.appendChild(deleting);
        
        //make the delete button to delete via AJAX
        deleting.addEventListener('click', function(d){
            return function(id){
                d.preventDefault();
                deleteWorkout(id);
            }(idD.value);
        });

        //create cells in the table for Edit and Delete
        var buttonEdit = document.createElement('td');
        buttonEdit.appendChild(formEdit);
        row.appendChild(buttonEdit);
        var buttonDelete = document.createElement('td');
        buttonDelete.appendChild(formDelete);
        row.appendChild(buttonDelete);
        table.appendChild(row);
        });
}


function deleteWorkout(id){
    var content = {};
    content.action = 'DeleteWorkout';
    content.id = id;
    content = JSON.stringify(content);    
    
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            var response = JSON.parse(req.responseText);
            buildTable(response);
        }
    });  
    req.send(content);
}


//Once the page is loaded make AJAX request to display all workouts from database
document.addEventListener('DOMContentLoaded', function(){
    var req = new XMLHttpRequest();
    req.open('GET', '/workouts', true);
    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            var response = JSON.parse(req.responseText);
            buildTable(response);
        }
    });
    req.send(null);
});

//Once the sumbit button Add Workout is clicked make AJAX request to display the table with the added row

document.getElementById('submit').addEventListener('click', function(event){
    var content = {};
    content.action = 'AddWorkout';
    
    content.fields = {};
    content.fields.name = document.getElementById('name').value;
    content.fields.reps = document.getElementById('reps').value;
    content.fields.weight = document.getElementById('weight').value;
    content.fields.date = document.getElementById('date').value;
    if (content.fields.name != '' && content.fields.reps != '' && content.fields.weight != '' && content.fields.date != ''){
        var lbs = document.getElementsByName('lbs');

        if (lbs[0].checked)
            content.fields.lbs = lbs[0].value;
        else
            content.fields.lbs = lbs[1].value;

        content = JSON.stringify(content);    

        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function(){
            if(req.status>=200 && req.status<400){
                var response = JSON.parse(req.responseText);
                buildTable(response);
            }
        });
        req.send(content);
    }
    else{
        var errorMessage = document.createElement('p');
        errorMessage.id = "err";
        errorMessage.textContent = "Fields cannot be empty. Please fill all fields. Click to close this message.";
        var parent = document.getElementById ('workoutForm');
        parent.appendChild(errorMessage);
        errorMessage.addEventListener('click', function(event){
            event.preventDefault();
            document.getElementById('err').parentNode.removeChild(document.getElementById('err'));
        });
        //alert( "Fields cannot be empty. Please fill all fields.");
        //console.log ("Fields cannot be empty. Please fill all fields.");
    }
    event.preventDefault();
});
