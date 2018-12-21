const handlers = {};

$(() => {
    // Define routes here using Sammy.js
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.before({except: {}}, function() {
            let user = sessionStorage.getItem('username');

            if(!!user){
                $('#welcome-message').text(`Welcome, ${user}`);
                $('.first-bar').show();
                $('.second-bar').show();
                $('.navbar-anonymous').hide();
                
            }else{
                $('.first-bar').hide();
                $('.second-bar').hide();
                $('.navbar-anonymous').show();
            }
        });

        this.get('/', handlers.getHomePage);
        this.get('/index.html', handlers.getHomePage);
        this.get('#/login', handlers.getLoginPage);
        this.get('#/register', handlers.getRegisterPage);
        this.post('#/login', handlers.loginUser);
        this.post('#/register', handlers.registerUser);
        this.get('#/logout', handlers.logout);
        this.get('#/dashboard', handlers.getDashboard);
        this.get('#/add', handlers.getAddForm);
        this.post('#/add', handlers.addPet);
        this.get('#/mypets', handlers.getMyPets);
        this.get('#/pets/details/:id', handlers.getPetDetails);
        this.get('#/dashboard/:category', handlers.getByCategory);
        this.get('#/mypets/delete/:id', handlers.deletePet);
        this.get('#/pets/pet/:id', handlers.petPet);
        this.get('#/mypets/edit/:id', handlers.getEditPet);
        this.post('#/mypets/edit', handlers.postEditPet);

    });

    app.run();
});