import { User } from "../models/userSchema.js";

export const register = async (req, res) => {
    try {
        const { pseudo, email, password } = req.body;
        const user = await User.create({
            pseudo,
            email,
            password
        });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({error:error});
    }
};

export const login = async (req, res) => {
    const{email, password} = req.body;

    User.findOne({ email:email}, (err, user) => {
        if (err) {
            res.status(500).json({message:"pas de serveur"});
        }
        if (!user) {
            res.status(401).json({ message: "Identifiants1 invalides" });
        } else {
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Erreur serveur" });
                } if (!isMatch) {
                    res.status(401).json({ message: "Identifiants2 invalides" });
                } else {
                    const token = user.createJWT();
                    res.status(200).json({user: {email: user.email}, token: token});
                }
            });
        }
    });
};