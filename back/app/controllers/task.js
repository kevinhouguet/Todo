const { Task } = require('../models');

const taskController = {

    listTasks: async function (req, res) {
        // Récupérer la liste des taches
        const tasks = await Task.findAll();
        // Renvoyer la liste des taches en json
        res.json(tasks);
    }
};

module.exports = taskController;
