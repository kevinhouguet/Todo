const { Task } = require('../models');

const taskController = {

    listTasks: async function (req, res) {
        try {
            // Récupérer la liste des taches
            const tasks = await Task.findAll();
            // Renvoyer la liste des taches en json
            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur')
        }
    },

    createTask: async function(req,res){
        try {
            const { name } = req.body;

            if(!name){
                throw Error('Veuillez indiquer un name')
            }

            const newTask = await Task.create({name});
            
            res.status(201).json(newTask)
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur')
        }
    },
    updateTask: async function(req,res){
        try {
            const { name } = req.body;
            const { id } = req.params;

            if(!id || isNaN(id)){
                throw Error(`Verifiez l'id donne`);
            }

            const task = await Task.findByPk(parseInt(id));

            if(!task){
                return res.status(404).json({error: "La task n'existe pas"});
            }

            if(name){
                task.name = name;
            }

            await task.save();
            
            res.status(200).json(task);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur')
        }
    },
    deleteTask: async function(req,res){
        try {
            const { id } = req.params;

            if(!id || isNaN(id)){
                throw Error(`Verifiez l'id donne`);
            }

            const task = await Task.findByPk(parseInt(id));

            if(!task){
                return res.status(404).json({error: "La task n'existe pas"});
            }

            await task.destroy();
            
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur')
        }
    }
};

module.exports = taskController;
