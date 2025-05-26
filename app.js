// app.js
const express = require('express');
//const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sequelize = require('./db');
const User = require('./models/User');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Sincronizar con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
    // Aquí puedes arrancar el servidor
    app.listen(PORT, () => {
      console.log('Servidor escuchando por el puerto: ${PORT}');
    });
  })
  .catch((error) => {
    console.error('Error sincronizando tablas:', error);
  });

// Conexión a MongoDB
/*mongoose.connect('mongodb://localhost:27017/authapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'));*/

// Configuración de EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true })); // Para leer formularios
app.use(session({
  secret: 'secreto123', // Cambiar en producción
  resave: false,
  saveUninitialized: false
}));

// Middleware de protección
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Rutas
app.get('/', (req, res) => {
  console.log('Sesión actual:', req.session);
  res.render('index', { userId: req.session.userId });
});

app.get('/register', (req, res) => {
  res.render('register', { error: undefined });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
     return res.render('register', { error: 'Todos los campos son obligatorios' });
  }

  const existingUser = await User.findOne({ where : { username } });
  if (existingUser) {
     return res.render('register', { error: 'El usuario ya existe' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { error: 'Usuario o contraseña incorrectos' });
  }

  //req.session.userId = user._id;
  req.session.userId = user.id;
  console.log('Usuario logueado:', req.session);
  res.redirect('/');
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
