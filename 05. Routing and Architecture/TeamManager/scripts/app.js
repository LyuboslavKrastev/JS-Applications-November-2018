$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('/index.html', displayHome);
        this.get('#/home', displayHome);

        this.get('#/about', function (context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs'
            }).then(function (){
                this.partial('../templates/about/about.hbs');
            });
        });

        this.get('#/login', function(context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                loginForm: '../templates/login/loginForm.hbs'
            }).then(function (){
                this.partial('../templates/login/loginPage.hbs');
            });
        });

        this.post('#/login', function(context){
            let username = this.params.username;
            let password = this.params.password;

            auth.login(username, password)
                .then(function(userInfo){
                    auth.saveSession(userInfo);
                    auth.showInfo('Hello, ' + username);
                    displayHome(context);
                }).catch(auth.handleError);
        });

        this.get('#/logout', function(context){
            auth.logout()
                .then(function (){
                    sessionStorage.clear();
                    auth.showInfo('Bye!');
                    displayHome(context);
                });
        });
        
        this.get('#/register', function(context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                registerForm: '../templates/register/registerForm.hbs'
            }).then(function (){
                this.partial('../templates/register/registerPage.hbs');
            });
        });

        this.post('#/register', function (context){
            let username = this.params.username;
            let password = this.params.password;
            let repeatPassword = this.params.repeatPassword;

            if(password !== repeatPassword){
                auth.showError('The provided passwords do not match');
            } else{
                auth.register(username, password)
                    .then(function(userInfo){
                        auth.saveSession(userInfo);
                        auth.showInfo('You have successfully created an account!');
                        displayHome(context);
                    }).catch(auth.handleError);
            }
        });

        this.get('#/catalog', displayCatalog);

        this.get('#/create', function(context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');

            this.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                createForm: '../templates/create/createForm.hbs'
            }).then(function (){
                this.partial('../templates/create/createPage.hbs');
            });
        });

        this.post('#/create', function(context){
            let teamName = context.params.name;
            let teamComment = context.params.comment;

            teamsService.createTeam(teamName, teamComment)
                .then(function (teamInfo){
                    teamsService.joinTeam(teamInfo._id)
                        .then(function (userInfo){
                            auth.saveSession(userInfo);
                            auth.showInfo(`Successfuly created team ${teamName}!`);
                            displayCatalog(context);
                        }).catch(auth.handleError);
                }).catch(auth.handleError);
        });

        // Team Details Page
        this.get('#/catalog/:id', function(context){
            let teamId = context.params.id.substr(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo){
                    context.loggedIn = sessionStorage.getItem('authtoken') !== null;
                    context.username = sessionStorage.getItem('username');
                    context.teamId = teamId;
                    context.name = teamInfo.name;
                    context.comment = teamInfo.comment;
                    context.isAuthor = teamInfo._acl.creator === sessionStorage.getItem('userId');
                    context.isOnTeam = teamInfo._id === sessionStorage.getItem('teamId');
                    
                    context.loadPartials({
                        header: '../templates/common/header.hbs',
                        footer: '../templates/common/footer.hbs',
                        teamControls: '../templates/catalog/teamControls.hbs'
                    }).then(function (){
                        this.partial('../templates/catalog/details.hbs');
                    });
                }).catch(auth.handleError);      
        });

        this.get('#/leave', function(context){
            teamsService.leaveTeam()
                .then(function (userInfo){
                    auth.saveSession(userInfo);
                    auth.showInfo('You have left the team');
                    displayCatalog(context);
                }).catch(auth.handleError);
        });

        this.get('#/join/:id', function(context){
            let teamId = context.params.id.substr(1);

            teamsService.joinTeam(teamId)
                .then(function (userInfo){
                    auth.saveSession(userInfo);
                    auth.showInfo('You have joined the team!');
                    displayCatalog(context);
                });
        });

        this.get('#/edit/:id', function(context){
            let teamId = context.params.id.substr(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo){
                    context.teamId = teamId;
                    context.name = teamInfo.name;
                    context.comment = teamInfo.comment;

                    context.loadPartials({
                        header: '../templates/common/header.hbs',
                        footer: '../templates/common/footer.hbs',
                        editForm: '../templates/edit/editForm.hbs'
                    }).then(function (){
                        this.partial('../templates/edit/editPage.hbs');
                    });
                }).catch(auth.handleError);
        });

        this.post('#/edit/:id', function(context){
            let teamId = context.params.id.substr(1);
            let teamName = context.params.name;
            let teamComment = context.params.comment;

            teamsService.edit(teamId, teamName, teamComment)
                .then(function (){
                    auth.showInfo(`Team ${teamName} edited`);
                    displayCatalog(context);
                }).catch(auth.handleError);
        });

        function displayHome(context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');
            context.teamId = sessionStorage.getItem('teamId') !== 'undefined' || sessionStorage.getItem('teamId') !== null;

            context.loadPartials({
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs'
            }).then(function (){
                this.partial('../templates/home/home.hbs');
            });
        }

        function displayCatalog(context){
            context.loggedIn = sessionStorage.getItem('authtoken') !== null;
            context.username = sessionStorage.getItem('username');

            teamsService.loadTeams()
                .then(function (teams){
                    context.hasNoTeam = sessionStorage.getItem('teamId') === 'undefined' || sessionStorage.getItem('teamId') === 'undefined' ;
                    context.teams = teams;
                    context.loadPartials({
                        header: '../templates/common/header.hbs',
                        footer: '../templates/common/footer.hbs',
                        team: '../templates/catalog/team.hbs'
                    }).then(function (){
                        this.partial('/templates/catalog/teamCatalog.hbs')
                    });
                });
			
        }
    });

    app.run();
});