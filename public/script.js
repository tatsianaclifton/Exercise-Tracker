//Once the page is loaded make AJAX request to display all workouts from database
document.addEventListener('DOMContentLoaded', function(){
    var req = new XMLHttpRequest();
    req.open('GET', '/workouts', true);
    req.addEventListener('load', function(){
        if(req.status>=200 && req.status<400){
            var response = JSON.parse(req.responseText);
            var table = document.getElementById('rows');
            table.innerHTML = "";
        
            //create rows with data
            response.forEach(function(r){
                //format date into string MM/DD/YY
                var date = new Date(r.date);
                r.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
                
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
                table.appendChild(row);
            });
        }
    });
    req.send(null);
});

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons{
//Once the sumbit button Add Workout is clicked make AJAX request to display a new table
    document.getElementById('submit').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        req.open('GET', '/workouts', true);
        req.addEventListener('load', function(){
            if(req.status>=200 && req.status<400){
                var response = JSON.parse(req.responseText);
                var table = document.getElementById('rows');
                table.innerHTML = "";

                //create rows with data
                response.forEach(function(r){
                    //format date into string MM/DD/YY
                    var date = new Date(r.date);
                    r.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

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
                    table.appendChild(row);
                });
            }
        });
        req.send(null);
        event.preventDefault();    
    });
}