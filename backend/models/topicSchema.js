// On importe mongoose et on utilise la méthode Schema pour créer notre schéma de données
import mongoose, { Schema } from "mongoose";

// On crée notre schéma de données en utilisant la méthode Schema de mongoose
let topicSchema = mongoose.Schema({
    title: {
        type:String,
        required: true,
        minlenght: 3,
        maxlenght: 25
    },
    followers:[{
    	type: Schema.Types.ObjectId,
    	ref:'User'
    }],
    author:{
    	type: Schema.Types.ObjectId,
    	ref: 'User',
    	required: true
    },
    comments:[{
    	type: Schema.Types.ObjectId,
    	ref: 'Comments',
    }],
    content: { 
        type: String, 
        required: true,
        minlength: 10, 
        // On utilise la méthode validate de mongoose pour créer une validation personnalisée
        validate: {
            // On définit une fonction de validation qui prend la valeur du champ à valider en paramètre (v)
            validator: function(v) {
                const regex = /(.)\1{3,}/g;
                const floodRegex = /(.{10,}).*\1{3,}/gm; 
                // On vérifie si la valeur du champ respecte notre regex et notre regex floodRegex
                return !regex.test(v) && !floodRegex.test(v); 
            }, 
            // On définit le message d'erreur personnalisé à renvoyer en cas de non-validation
            message: props => `${props.value} is not a valid content.`
        } 
    },
});

// On exporte notre schéma de données sous forme de modèle grâce à la méthode model de mongoose
export const Product = mongoose.model('Topic', topicSchema);