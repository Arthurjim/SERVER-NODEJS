const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_BD,
  database: process.env.
})

const getUsers = async (req, res) =>{
  const response = await pool.query('SELECT * FROM users');
  res.json(response.rows)
 
}
const addUsers = async (req, res ) => {
  const {name, lastname, fechaini, fehcavenci} = req.body;
 try {
  const response = await pool.query('INSERT INTO users (name, lastname, fechaini, fehcavenci) VALUES($1, $2, $3, $4)', [name,lastname, fechaini,fehcavenci ])
  res.json(response.rows);
  console.log('Se ha insertado nuevo usuario')
 } catch (error) {
   console.log('Datos erroneos')
 }
  
}
const getUltimo = async (req,res) =>{
  const response = await pool.query("SELECT * FROM users ORDER BY id DESC LIMIT 1");
  res.json(response.rows);
}
const getOne = async (req, res) =>{
  const id = req.params.id;
  try {
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
  } catch (error) {
    console.log('No existe')
    
  }
}
const getVencidos = async (req, res ) => {
  const response = await pool.query("SELECT * FROM users WHERE fehcavenci < CURRENT_DATE");
  res.json(response.rows);
}
const getListDate = async (req,res) =>{
  const day = req.params.day;
  try {
    const response = await pool.query("SELECT * FROM users INNER JOIN calendario ON users.id = calendario.id_usuario  WHERE calendario.day = $1 ",[day]);
    res.json(response.rows);
    console.log('son estos')
  } catch (error) {
    console.log('No se encontraron de este dia')
  }
}
const addListDate = async (req, res) => {
  const { id_users, day } = req.body;
  try {
    const response = await pool.query("INSERT INTO calendario (id_usuario, day) VALUES($1, $2)", [id_users, day]);
    res.json(response.rows);
    console.log('Se ha insertado usuario a calendario')
  } catch (error) {
    console.log('No existe dicho id')
    return
  }
 
}
const oneDelete = async (req, res) => {
  
  const { id } = req.params;
  try {
    const response = await pool.query("DELETE FROM users WHERE id = $1",[id])
     res.json(response.rows);
     console.log(`usuario elminado con id ${id}`)
  } catch (error) {
    console.log('No se pudo eliminar')
    return null;
  }
}
const updateUser = async (req, res) =>{
  const id = req.params.id;
  const { fechaini, fehcavenci} = req.body;
  try{
    const response = await pool.query("UPDATE users SET fechaini = $1, fehcavenci = $2  WHERE id=$3; ",[fechaini, fehcavenci,id])
    res.json(response.rows);
    console.log(`usuario actualizado con id ${id}`)
  } catch (error) {
    console.log('No se pudo modificar')
    return null;
  }
}



const register = async (req,res) =>{
  let { nombre, email, password, password2} =req.body;
  console.log({
    nombre,
    email, 
    password,
    password2
  })
  
  let errors = [];
  if(!nombre || !email || !password || !password2){
    return null
    console.log("datos no validos")
  }
  if(password.length < 6){
    console.log('contraseña corta')
    return null;
   
  }
  if(password !== password2){
    console.log('contraseña diferente')
    return null;
    
  }
  if(errors.length >0 ){
    res.render('register', {errors})
  } else{
    //Form validation has passed
    let hashedPassword =  await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      pool.query(
        `SELECT * FROM administradores WHERE email = $1`,[email], (err, results) =>{
          if(err){
           return 0;
            
          }
          console.log(results.rows)
          if(results.rows.length > 0){
           console.log(err)
          }else{
            pool.query(
              `INSERT INTO administradores (nombre, email, password) 
              VALUES($1, $2, $3)
              RETURNING id, password`,[nombre, email, hashedPassword], (err, result)=>{
                if(err){
                  console.log("hay un error en el registro")
                }
                res.json(results.rows);
                
                
              }
            )
          }
        }
      )
  }
}



module.exports = {
  getUsers,
  addUsers,
  getUltimo,
  getOne,
  getVencidos,
  getListDate,
  addListDate,
  oneDelete,
  updateUser,
  register,
  pool
}