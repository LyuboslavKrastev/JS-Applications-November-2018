function attachEvents(){
    const BASE_URL = 'https://phonebook-6ad7a.firebaseio.com/phonebook';
    const TABLE = $('#phonebook');
    const PERSON = $('#person');
    const PHONE = $('#phone');
    
    
    $('#btnLoad').on('click', loadContacts);
    $('#btnCreate').on('click', createContact);
    
    
    function loadContacts(){
        TABLE.empty();
        $.ajax({
            method: 'GET',
            url: BASE_URL + '.json'
        }).then(appendContacts)
          .catch(handleError);
    }
    
    function appendContacts(contacts) {
        for (let key in contacts) {
          let person = contacts[key]['person'];
          let phone = contacts[key]['phone'];
          let li = $("<li>");
          li.text(person + ': ' + phone + ' ');
          $("#phonebook").append(li);
          li.append($("<button>Delete</button>")
            .click(deleteContact.bind(this, key)));
        }
      }
      
    
    function createContact(){
        let person = PERSON.val(); 
        let phone = PHONE.val();
        if(person.trim() !== '' && phone.trim() !== ''){
            $.ajax({
                method: 'POST',
                url: BASE_URL + '.json',
                data: JSON.stringify({person, phone})
            }).catch(handleError);

            PERSON.val('');
            PHONE.val('');
        }
    }

    function deleteContact(id){
        let request = {
                method: 'DELETE',
                url: BASE_URL + '/' + id + '.json'
            };
        $.ajax(request)
            .then(loadContacts)
            .catch(handleError);
    }
    
    function handleError(err){
        console.error(err);
    }	
}