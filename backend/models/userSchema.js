// On importe mongoose et on utilise la méthode Schema pour créer notre schéma de données
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

// Définition des rôles possibles pour les utilisateurs
const userRoles = ["Admin", "Moderator", "User"];

// Définition du schéma de l'utilisateur
let userSchema = mongoose.Schema({
        pseudo: {
            type: String,
            required: [true, 'This property Pseudo is required'],
            unique: true
        },
        email: {
            type: String,
            required: [true, 'This property Email is required'],
            match: /.+\@.+\..+/,
            unique: true
        },
        topics: [{
        	type: Schema.Types.ObjectId,
        	ref: 'Topics',
        }],
        isAdmin: {
            type: Boolean
        },
        // Ajout d'un champ "roles" qui doit être une valeur de l'enum userRoles, par défaut "User"
        roles: {
            type: String,
            enum: userRoles,
            default: 'User'
        },
        password: {
            type: String,
            required: [true, 'This property Password is required']
        },
    }, {
        // Définition de l'ajout automatique d'un timestamp
        timestamps: true,
        // Désactivation de la gestion automatique de la version du document
        versionKey: false
    }
);

// Ajout d'un hook qui permet de hasher le mot de passe avant de l'enregistrer dans la base de données
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode qui permet de comparer un mot de passe en clair avec le mot de passe enregistré dans la base de données
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Méthode qui permet de générer un token JWT pour l'utilisateur
userSchema.methods.createJWT = function () {
    return jwt.sign({
        id: this._id,
        email: this.email
    }, 'key_secret', {expiresIn: '24h'});
};

// Export du modèle d'utilisateur
export const User = mongoose.model('User', userSchema);