// On importe mongoose et on utilise la méthode Schema pour créer notre schéma de données
import mongoose, { Schema } from 'mongoose';

// Définition des valeurs possibles pour le champ "tracking"
const tracking = ['Non lu', 'En cours', 'Traité'];

// Définition du schéma de ticket
let ticketSchema = mongoose.schema({
    // Définition du champ "title" comme étant une chaîne de caractères requise, d'une longueur minimale de 3 et maximale de 25
    title: {
        type:String,
        required: true,
        minlenght: 3,
        maxlenght: 25
    },
    // Définition du champ "content" comme étant une chaîne de caractères requise, d'une longueur minimale de 10 et contenant une validation personnalisée pour empêcher les doublons et les messages de spam
    content: {
        type: String, 
        required: true,
        minlength: 10,
        validate: {
            validator: function(v) {
                const regex = /(.)\1{3,}/g;
                const floodRegex = /(.{10,}).*\1{3,}/gm; 
                return !regex.test(v) && !floodRegex.test(v); 
            },
            message: props => `${props.value} is not a valid content.`
        }
    },
    // Définition du champ "plaintiff" comme étant une référence à l'ID d'un utilisateur existant et requis
    plaintiff:{
        type:Schema.types.objectiId,
        ref:'User',
        required:true
    },
    // Définition du champ "accused" comme étant une référence à l'ID d'un utilisateur existant (optionnel)
    accused:{
        type: Schema.Types.ObjectifId,
        ref: 'User'
    },
    // Définition du champ "tracking" comme étant une des valeurs possibles pour "tracking", avec une valeur par défaut de "Non lu"
    tracking:{
        type: Schema.Types.objectId,
        enum: tracking,
        default: 'Non lu'
    }
});

// Export du modèle de ticket
export const Ticket = mongoose.model('Ticket', ticketSchema);
