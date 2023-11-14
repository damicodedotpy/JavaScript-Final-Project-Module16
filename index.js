// Import Express library
const express = require("express");
// Create an instance of Express
const app = express();
// Import the PostgreSQL library and its object Pool
const { Pool } = require("pg");
// Instance of the Pool object to create a database connection and configure it
const pool = new Pool({
    user: "postgres",
    password: "3132",
    host: "127.0.0.1",
    database: "proyectofinal16",
    port: 5432
})
// Specify the port of the app
app.set("port", 5500);
// Create a middleware to parse the data coming from databases to json
app.use(express.json());


// This endpoint gets the data of a certain student
app.get("/estudiantes/:legajoEstudiante", function(request, response) {
    const legajoID = request.params.legajoEstudiante;
    pool.query(`SELECT * FROM estudiantes WHERE legajo = '${legajoID}'`, function(error, result) {
        if (error) {
            console.error(error);
            response.status(500).send("There was an error compadre :(");
        } else {
            console.log(result.rows);
            response.json(result.rows);
        }
    });
});


// This endpoint creates a new entry of estudiante into the 'estudiantes' table
app.post("/estudiantes/create", function(request, response) {
    const { legajo, nombre, email} = request.body;
    pool.query(`INSERT INTO estudiantes VALUES (${legajo}, '${nombre}', '${email}')`, function(error, result) {
        if (error) {
            console.error(error);
            response.status(500).send("There was an error carnalito :(");
        } else {
            console.log("Success!", result);
            response.send("Student registered successfully");
        }
    });
});


// This endpoint creates a new curso (signature) entry into the 'cursos' table.
app.post("/curso/create", function(request, response) {
    const { codigo, nombre, docente, descripcion } = request.body;
    pool.query(`INSERT INTO cursos VALUES (${codigo}, 
        '${nombre}', 
        '${docente}', 
        '${descripcion}')`, 
        function(error, result) {
        if (error) {
            console.error(error)
            response.status(500).send("There was an error carna :(");
        } else {
            console.log("Course added successfully", request.body);
            response.send(request.body);
        }
    })
})


// This endpoint creates a new note (calification) into the 'notas' table
app.post("/notas/create", function(request, response) {
    const { _id, legajo_estudiante, codigo_curso, nota, fecha } = request.body;
    pool.query(`INSERT INTO notas VALUES (${_id}, 
        ${legajo_estudiante}, 
        ${codigo_curso}, 
        '${nota}', 
        '${fecha}')`, 
        function(error, result) {
            if (error) {
                console.error(error);
                response.status(500).send("There was an error bru :c");
            } else {
                console.log("Success", request.body);
                response.send(request.body);
            }
    });
});


// This endpoint updates an old entry from the 'notas' table
app.put("/notas/:IDnota/update", function(request, response) {
    const { nota } = request.body;
    pool.query(`UPDATE notas 
    SET nota = '${nota}'
    WHERE _id = ${request.params.IDnota}`, 
    function(error, result) {
        if (error) {
            console.error(error);
            response.status(500).send("There was an error compi :c");
        } else {
            console.log("Success", request.body);
            response.send(request.body);
        }
    });
});


// This endpoint deletes an specific entry from the 'notas' table.
app.delete("/notas/:IDnota/delete", function(request, response) {
    try {
        pool.query(`DELETE FROM notas WHERE _id = ${request.params.IDnota}`);
        console.log("Success", response);
        response.send("Note deleted successfully");
    } catch(error) {console.error(error)}
})


// This endpoint gets the notes mayor or equal to 6 from the 'notas' table
app.get("/notas/:IDcurso/aprobados", function(request, response) {
    pool.query(`SELECT * FROM notas 
    WHERE codigo_curso = ${request.params.IDcurso} 
    AND nota IN ('6', '7', '8', '9', '10')`, 
    function(error, result) {
        if (error) {
            console.error(error);
            response.status(500).send("There was an error carnalito :c check the query, maybe that...");
        } else {
            console.log("Success!", result.rows);
            response.json(result.rows);
        }
    });
});


// Show a run confirmation for each time the app receives a request
app.listen(puerto=5500, function() {
    console.log(`Escuando desde puerto ${puerto}`)
})