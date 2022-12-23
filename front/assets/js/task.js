const taskManager = {
    apiEndpoint: 'http://localhost:3000',


    /**
     * Récupére la liste des tâches depuis l'API.
     */
    fetchAndInsertTasksFromApi: async function (event) {

        try {
           // Récupère la liste des tâches à l'aide de la fonction fetch()
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`);
            const data = await httpResponse.json();

            // console.log(data);
            if(!httpResponse.ok){
                throw new Error('Fetch Error')
            }

            // Boucle sur la liste des tâches            
            data.forEach(task => {
                // pour chaque tâche appeler la fonction insertTaskInHtml()
                taskManager.insertTaskInHtml(task);
            });
            
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * Permet de créer une nouvelle tâche sur la page HTML. 
     * La fonction a un paramètre, un objet contenant les données de la tâche. 
     * Il est composé de 2 propriétés : l'id de la tâche et son nom.
     * 
     * Exemple : 
     * {
     *   id: 5,
     *   name: 'Faire les courses'
     * } 
     * 
     * @param {Object} taskData 
     */
    insertTaskInHtml: function (taskData) {

        // On récupère le HTML d'une tâche dans le template
        const taskTemplate = document.querySelector('.template-task');
        const newTask = document.importNode(taskTemplate.content, true);

        // On insère les données de la tâche dans le HTML
        newTask.querySelector('.task__name').textContent = taskData.name;
        newTask.querySelector('.task__input-name').value = taskData.name;
        newTask.querySelector('.task__input-id').value = taskData.id;
        newTask.querySelector('.task').dataset.id = taskData.id;

        // On écoute les événements sur les éléments créés
        newTask.querySelector('.task__delete').addEventListener(
            'click', taskManager.handleDeleteButton);
        
        newTask.querySelector('.task__edit').addEventListener(
            'click', taskManager.handleEditButton);

        newTask.querySelector('.task__edit-form').addEventListener(
            'submit', taskManager.handleEditForm);

        // On insère le HTML de la tâche dans la page
        document.querySelector('.tasks').append(newTask);

        // reset du formulaire seulement a la fin de l'insertion de la task
        document.querySelector('.create-task').reset();

    },

    /**
     * Cette fonction est appelée quand le formumaire de création de tâche est soumis. 
     * 
     * @param {Event} event 
     */
    handleCreateForm: async function (event) {
        // Bloquer l'envoie du formulaire
        event.preventDefault();

        // Récupérer les données du formulaire
        const taskFormData = new FormData(event.currentTarget);

        try {
            // Envoyer les données à l'API
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks`, {
                method: 'POST',
                body: taskFormData
            })

            if(!httpResponse.ok){
                throw new Error('Fetch error')
            }

            const data = await httpResponse.json();

            // Après confirmation de l'API insérer la tâche dans la page (il y a une fonction toute prete pour ça ;) 
            // en utilisant la valeur de retour de l'API

            taskManager.insertTaskInHtml(data);
        } catch (e) {
            console.error(e);
        }

        
    },

    /**
     * Cette fonction est appelée quand l'utilisateur appuie sur le bouton de suppression.
     * 
     * @param {Event} event 
     */
    handleDeleteButton: async function (event) {

        // On récupère l'ID de l'élément à supprimer
        const taskHtmlElement = event.currentTarget.closest('.task');
        const taskId = taskHtmlElement.dataset.id;

        if(confirm('Voulez-vous vraiment supprimer cette tache ?')){
            try {
                // On envoie la requete de suppression à l'API
                const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${taskId}`, {
                    method: 'DELETE'
                })
                if(!httpResponse){
                    throw Error('impossible de supprimer cette tache');
                }

                // On supprime l'élément dans la page HTML
                taskHtmlElement.remove();

                // on affiche la notif
                document.querySelector('.notification').classList.remove('is-hidden');
            } catch (e) {
                console.error(e)
            }
        }    
    },

    /**
     * Cette fonction est appelée lors du click sur le bouton "modifier une tâche"
     * 
     * @param {Event} event 
     */
    handleEditButton: function (event) {
        // On récupére l'élément HTML de la tâche à modifier
        const taskHtmlElement = event.currentTarget.closest('.task');
        // On affiche l'input de modification
        taskHtmlElement.querySelector('.task__edit-form').style.display = 'flex';
        // On masque le titre
        taskHtmlElement.querySelector('.task__name').style.display = 'none';
    },

    /**
     * Cette fonction est appelée quand le formumaire de modification de tâche est soumis. 
     * 
     * @param {Event} event 
     */
    handleEditForm: async function (event) {
        // Bloquer l'envoie du formulaire
        event.preventDefault();

        // On récupère l'élément HTML complet de la tâche à modifier
        const taskHtmlElement = event.currentTarget.closest('.task');

        // Récupérer les données du formulaire
        const taskFormData = new FormData(event.currentTarget);

        // je récupère l'id de la tâche à modifier
        const taskId = taskFormData.get('id');

        try {
            // Envoyer les données à l'API
            const httpResponse = await fetch(`${taskManager.apiEndpoint}/tasks/${taskId}`, {
                method: 'PUT',
                body: taskFormData
            })
            if(!httpResponse){
                throw Error('Fetch error');
            }
            const data = await httpResponse.json();

            // Après confirmation de l'API modifier le nom de la tâche dans le span.task__name
            taskHtmlElement.querySelector('.task__name').textContent = data.name;

            // On affiche l'input de modification
            taskHtmlElement.querySelector('.task__edit-form').style.display = 'none';
            // On masque le titre
            taskHtmlElement.querySelector('.task__name').style.display = 'block';
        } catch (e) {
            console.error(e)
        }
        
    }

};
