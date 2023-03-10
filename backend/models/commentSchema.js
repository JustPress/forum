// On importe mongoose et on utilise la méthode Schema pour créer notre schéma de données
import mongoose, { Schema } from 'mongoose';

// Définition du schéma pour les commentaires
let commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlenght: 10,
        // Validation personnalisée pour éviter les flood et les caractères consécutifs identiques
        validate: {
            validator: function(v) {
                // Regex pour trouver des caractères identiques consécutifs
                const regex = /(.)\1{3,}/g;
                // Regex pour trouver des messages de type "flood"
                const floodRegex = /(.{10,}).*\1{3,}/gm; 
                return !regex.test(v) && !floodRegex.test(v); 
            }, 
            // Message d'erreur si la validation échoue
            message: props => `${props.value} n'est pas un contenu valide.`
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref:'Topic',
        required:true
    },
});

// Export du modèle Comment, créé à partir du schéma commentSchema
export const Comment = mongoose.model('Comment', commentSchema);