const express = require("express");
const cors = require("cors");
const {Pool} = require('pg');


const app = express();

app.use(cors());
app.use(express.json());

// conexion a postgres
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "escuela",
    password: "1234",
    port: "5432",
});

// leer alumno
app.get("/alumnos", async (req, res) =>{
    try {
        const result = await pool.query("SELECT * FROM alumnos ORDER BY id ASC");

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo alumnos"});
    }
})

// crear alumno
app.post("/alumnos", async (req, res) => {
    try {
        const { nombre, apellido, telefono, direccion} = req.body;
        const result = await pool.query(
            "INSERT INTO alumnos (nombre, apellido, telefono, direccion) VALUES ($1,$2,$3,$4) RETURNING *",  
            [nombre, apellido, telefono, direccion]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al crear alumno"});
    }
})
       

// actualizar alumno
app.put("/alumnos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, apellido, telefono, direccion} = req.body;

        const result = await pool.query(
            "UPDATE alumnos SET nombre=$1, apellido=$2, telefono=$3, direccion=$4 WHERE id=$5 RETURNING *",
            [nombre, apellido, telefono, direccion, id]
        )

        if (result.rows.length === 0){
            return res.status(404).json({
                error: "Alumno no encontrado"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al actualizar alumno"});
    }
})

// eliminar alumno
app.delete("/alumnos/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM alumnos WHERE id=$1", [req.params.id]);
        res.json({
            message: "Alumno eliminado satisfactoriamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al eliminar alumno"});
    }
})

// inicia servidor
app.listen(3000, () => 
    console.log("Servidor esta corriendo en http://localhost:3000")
);