require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración de MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Modelos
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'seller', 'player'], default: 'player' }
}));

const Game = mongoose.model('Game', new mongoose.Schema({
  name: String,
  date: Date,
  prizes: {
    linea: Number,
    dobleLinea: Number,
    cartonLleno: Number
  },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' }
}));

// Rutas
app.get('/', (req, res) => {
  res.send('🎲 Bingo Masari API - ¡Funcionando! 🎯');
});

// Ruta para crear usuario de prueba
app.get('/create-test-user', async (req, res) => {
  try {
    const user = new User({
      name: 'Admin Demo',
      email: 'admin@bingomasari.com',
      password: 'Admin123',
      role: 'admin'
    });
    
    await user.save();
    res.send('Usuario admin creado: admin@bingomasari.com / Admin123');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para crear un juego
app.post('/games', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para obtener todos los juegos
app.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
});
