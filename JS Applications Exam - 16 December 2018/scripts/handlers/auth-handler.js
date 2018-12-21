handlers.getHomePage = function (ctx) {
    ctx.partial('../../templates/home.hbs');
};

handlers.getLoginPage = function (ctx) {
    ctx.partial('../../templates/forms/login-form.hbs');
};

handlers.getRegisterPage = function (ctx) {
    ctx.partial('../../templates/forms/register-form.hbs');
};

handlers.registerUser = function (ctx) {
    const username = ctx.params.username;
    const password = ctx.params.password;

    if(username.length < 3){
        notify.showError('Username must be at least 3 symbols');
    } else if (password.length < 6) {
        notify.showError('Password must be at least 6 symbols');
    } else {
        auth.register(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notify.showInfo('User registration successful.');
                ctx.redirect('/');
            })
            .catch(notify.handleError);
    }
};
handlers.loginUser = function (ctx) {
    const username = ctx.params.username;
    const password = ctx.params.password;

   
    if(username.length < 3){
        notify.showError('Username must be at least 3 symbols');
    } else if (password.length < 6) {
        notify.showError('Password must be at least 6 symbols');
    } else {
        auth.login(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notify.showInfo('Login successful.');
                ctx.redirect('/');
            })
            .catch(notify.handleError);
    }
};
handlers.logout = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notify.showInfo('Logout successful.');
            ctx.redirect('/');
        })
};