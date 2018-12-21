$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let source = $.get('template.hbs')
            .then(file => {
                let template = Handlebars.compile(file);

                $('#allCats').html(template({cats}));

                let buttons = $('button');

                for (const btn of buttons) {
                    $(btn).on('click', displayInfo);
                }
            });

            function displayInfo(){
                let btn = $(this);
                if(btn.text() === 'Show status code'){
                    btn.next().show();
                    btn.text('Hide status code');
                } else{
                    btn.next().hide();
                    btn.text('Show status code');
                }
            }
    }
});
