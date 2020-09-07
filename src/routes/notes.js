const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

//ponemos el middleware isAuthenticated para que compruebe si hay una sesion y así muestre las notas, 
//si no esta iniciado sesion lo manda para que inicie sesion

router.get('/notes/add', isAuthenticated, (req,res) => {
    res.render('notes/new-note.hbs');
})

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
 const {title, description} = req.body;
 const errors = [];
 if(!title){
     errors.push({text: 'Please write a Title... :('});
}
if(!description){
    errors.push({text: 'Please write a description.. :('});
}
if(errors.length > 0){
    res.render('notes/new-note.hbs', {
        errors,
        title,
        description
    });
}else{
 const newNote = new Note({title, description});
 newNote.user = req.user.id;
 await newNote.save();
 req.flash('succes_msg', 'Note added succesfully');
 res.redirect('/notes');
}
});

router.get('/notes',isAuthenticated, async (req,res) => {
    const notes = await Note.find({user: req.user.id}).sort({date:'desc'});
    res.render('notes/all-notes.hbs', { notes: notes.map(note => note.toJSON()) });
});

router.get('/notes/edit/:id',isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note.hbs', {note: note.toJSON()});
})

router.put('/notes/edit-note/:id',isAuthenticated, async (req,res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('succes_msg', 'Note updated Succesfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated, async (req,res) => {
   await Note.findOneAndDelete(req.params.id);
   req.flash('succes_msg', 'Note deleted Succesfully');
   res.redirect('/notes');
})

module.exports = router;
