function attachEvents() {
    $('#btnLoadTowns').on('click', getTownsInfo);

    function getTownsInfo() {
        let townsObj = {'towns': []};
        let townsArr= $('#towns').val().split(', ');
        for (const town of townsArr) {
            townsObj.towns.push({town});
        }
        renderTowns(townsObj);
    }

    function renderTowns(townsObj) {
        $.get('template.hbs')
            .then((file) => {
                let template = Handlebars.compile(file);
                $('#root').html(template(townsObj));
                $('#towns').val("");
            }).catch((err) => console.log(err));   
    }
}