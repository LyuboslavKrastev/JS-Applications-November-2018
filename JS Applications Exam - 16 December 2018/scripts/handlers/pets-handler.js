handlers.getDashboard = function (ctx){
    const userId = sessionStorage.getItem('userId');
    petsService.getAll()
        .then(function (data){       
            ctx.pets = data;
            ctx.partial('../../templates/dashboard.hbs');
    });
}

handlers.getByCategory = function (ctx){
    let text = ctx.path.split('/');
    let category = text.slice(-1)[0];
    if(category === 'All'){
        ctx.redirect('#/dashboard');
    } else{
        petsService.getByCategory(category)
            .then(function (data){
                ctx.pets = data;
                ctx.partial('../../templates/dashboard.hbs');
        });
    }
}

handlers.petPet = async function(ctx){
    const petId = ctx.params.id;

    await petsService.petPet(petId);
    
    notify.showInfo('Pet petted successfully!');
    ctx.redirect('#/dashboard');
}

handlers.deletePet = function (ctx){
    const petId = ctx.params.id;

    petsService.remove(petId)
        .then(() => {
            notify.showInfo('Pet removed successfully!');
            ctx.redirect('/');
        }).catch(notify.handleError);
};

handlers.getAddForm = function (ctx){
    ctx.partial('../../templates/forms/create-form.hbs');
};

handlers.addPet = function (ctx){
    let name = ctx.params.name;
    let description = ctx.params.description;
    let image = ctx.params.imageURL;
    let category = ctx.params.category;

    petsService.addPet(name, description, image, category)
        .then(function (){
            notify.showInfo('Pet created.');
            ctx.redirect('/');
        });
}

handlers.getMyPets = function (ctx) {
    const userId = sessionStorage.getItem('userId');
    petsService.getMyPets(userId)
        .then(function (data){
            ctx.pets = data;
            ctx.partial('../../templates/pets/my-pets.hbs');
        });
};

handlers.getPetDetails = function (ctx) {

    const petId = ctx.params.id;

    petsService.getById(petId)
        .then(function (data){
            ctx.id = data._id;
            ctx.name = data.name;
            ctx.description = data.description;
            ctx.imageURL = data.imageURL;
            ctx.likes = data.likes;
            ctx.partial('../../templates/pets/details.hbs');
    });
};

handlers.getEditPet = function (ctx) {
    const petId = ctx.params.id;
    petsService.getById(petId)
        .then(function (data){
            ctx.id = data._id;
            ctx.name = data.name;
            ctx.category = data.category;
            ctx.description = data.description;
            ctx.imageURL = data.imageURL;
            ctx.likes = data.likes;
            ctx.partial('../../templates/pets/edit.hbs');
    });
};

handlers.postEditPet = function (ctx) {
    const id = $('input[name=petId]').val();
    const name = $('input[name=name]').val();
    const likes = $('input[name=likes]').val();
    const imageURL = $('input[name=image]').val();
    const category = $('input[name=category]').val();
    const description = ctx.params.description;

    petsService.editPet(id, name, likes, imageURL, category, description)
        .then(function (){
            notify.showInfo('Updated successfuly');
            ctx.redirect('#/dashboard');
    });
};