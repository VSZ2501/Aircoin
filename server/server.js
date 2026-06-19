require('dotenv').config();
const express           = require('express');
const cors              = require('cors');
const connectDB         = require('./config/db');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const logementRoutes    = require('./routes/logement.routes');
const reservationRoutes = require('./routes/reservation.routes');
const avisRoutes        = require('./routes/avis.routes');
const errorHandler      = require('./middlewares/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Connexion MongoDB Atlas ───────────────────────────────────────────────────
connectDB();

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: '🏠 Aircoin API opérationnelle', version: '1.0' }));

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/logements',    logementRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/avis',         avisRoutes);

// ─── Gestion des erreurs (toujours en dernier) ─────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Serveur Aircoin → http://localhost:${PORT}`));