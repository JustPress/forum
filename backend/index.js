//Imports
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";

// Création de l'application Express et définition du numéro de port
const app = express();
const PORT = 9333;

// Middleware pour parser les requêtes JSON entrantes
app.use(express.json());

// Middleware pour parser les requêtes url encodées avec une syntaxe étendue (req.body)
app.use(express.urlencoded({ extended: true }));

// Middleware pour activer CORS
app.use(cors());

// Définition de strict mode pour les requêtes Mongoose (impose les champs demandés/ améliore les performances)
mongoose.set('strictQuery', true);

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://victormorel:28fc7d775421f24506ab185f85bf1922@mongodb.3wa.io:27017/victormorel?authSource=admin');

// Gestionnaire d'événements pour les erreurs de connexion Mongoose
mongoose.connection.on("error", () => {
    console.log("Erreur lors de la connexion à la base de données");
});

// Gestionnaire d'événements pour la connexion réussie à Mongoose
mongoose.connection.on("open", () => {
    console.log("Connexion à la base de données établie");
    // Use the router for any routes with the '/' path
    app.use('/', userRouter);
});

// Démarrage de l'application Express en écoutant le port spécifié
app.listen(PORT, () => {
  console.log(`Example app listening at http://victormorel.ide.3wa.io:${PORT}`);
});