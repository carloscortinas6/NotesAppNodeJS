//esquema de los usuarios

const mongoose =require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    date: {type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt =  await bcrypt.genSalt(10); //genera un hash
    const hash = bcrypt.hash(password, salt); //parsea la contraseña con el hash generado
    return hash;
};
//comaparar la contraseña que introduce el usuario con la que se genera en el hash
UserSchema.methods.matchPassword =async function (password){
     return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);