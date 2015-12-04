var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'student',
    password: 'default',
    database: 'student'
});
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

//create table
app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
       pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

app.get('/', function(req, res, next){
	var context = {};
	res.render('workouts', context);
});


//get all workouts
app.get('/workouts', function(req, res, next){
    pool.query("SELECT * FROM workouts", function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        res.send(JSON.stringify(rows));
    });
});  

//get a singe workout
app.get('/workout', function(req, res, next){
    pool.query("SELECT * FROM workouts WHERE id = ?",  [req.query.id], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        res.send(JSON.stringify(rows));
    });  
});

//handles add, edit and delete workouts
app.post('/', function(req, res){
    if (req.body['Add Workout']){
        pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result){
            if(err){
                next(err);
                return;
            }
            pool.query("SELECT * FROM workouts WHERE id = ?",  [req.query.id], function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
        res.send(JSON.stringify(rows));
            }); 
        });
    }
    
    if (req.body['Edit Workout']){
        pool.query("SELECT * FROM workouts WHERE id = ?", [req.body.id], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.forEdit = rows;
            res.render('workouts', context);
        });
    }
    
       if (req.body['Edited Workout']){ 
            pool.query("UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?", [req.body.name, req.body.reps, req.body.date, req.body.lbs, req.body.id], function(err, result){
                if(err){
                    next(err);
                    return;
                }
                    pool.query("SELECT * FROM workouts", function(err, rows, fields){
                        if(err){
                            next(er);
                            return;
                        }
                context.results = rows;
                res.render('workputs', context);
            });
        });
    }
    
    if (req.body['Delete Workout']){
        pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
            if(err){
                next(err);
                return;
            }
            pool.query("SELECT * FROM workouts WHERE id = ?",  [req.query.id], function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
        res.send(JSON.stringify(rows));
            }); 
        });
    }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});