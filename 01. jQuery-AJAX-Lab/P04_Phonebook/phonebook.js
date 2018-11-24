const BASE_URL = 'https://phonebook-6ad7a.firebaseio.com/phonebook';
const TABLE = $('#phonebook');
const PERSON = $('#person');
const PHONE = $('#phone');


$('#btnLoad').on('click', loadContacts);
$('#btnCreate').on('click', createContact);


function loadContacts(){
    $.ajax({
        method: 'GET',
        url: BASE_URL + '.json'
    }).then(appendContacts)
      .catch(handleError);
}

function appendContacts(contacts){
    TABLE.empty();
    //sort the concacts by name
    let keys = Object.keys(contacts);
    keys.sort((a, b) => contacts[a].name.localeCompare(contacts[b].name));

    for (const id of keys) {
        let li = $('<li>');
        li.text(`${contacts[id].name}: ${contacts[id].phone} `);
        let delBtn = $('<button class="btn btn-warning">Delete</button>');
        delBtn.on('click', function(){
            $.ajax({
                method: 'DELETE',
                url: BASE_URL + '/' + id + '.json'
            }).then(function() {
                li.remove();
            }).catch(handleError);
        });
        li.append(delBtn);
        TABLE.append(li);
    }
}  

function createContact(){
    let name = PERSON.val(); 
    let phone = PHONE.val();
    if(name.trim() !== '' && phone.trim() !== ''){
        $.ajax({
            method: 'POST',
            url: BASE_URL + '.json',
            data: JSON.stringify({name, phone})
        }).then(function() {
            PERSON.val('');
            PHONE.val('');
        }).catch(handleError);
    }
}

function handleError(err){
    console.error(err);
}