function attachEvents (){
    const BASE_URL = 'https://messanger-8ed7e.firebaseio.com/messanger/';

    let messageArea = $('#messages');
    let refreshBtn = $('#refresh');
    let submitBtn = $('#submit');
    let authorInput = $('#author');
    let contentInput = $('#content');

    refreshBtn.on('click', getMessages);
    submitBtn.on('click', createMessage);

    function getMessages(){
        messageArea.empty();
        let request = {
            method: 'GET',
            url: BASE_URL + '.json'
        };
        $.ajax(request)
            .then(appendMessages)
            .catch(handleError);
    }

    function appendMessages(messages){
        let keys = Object.keys(messages);
        keys.sort((a, b) => messages[a].timestamp - messages[b].timestamp);
		let result = '';
        for (const key of keys) {
            let message = messages[key].content;
            let author = messages[key].author;
            result += `${author}: ${message}\n`;          
        }
		messageArea.append(result);
		$(messageArea).animate({
            scrollTop:$(messageArea)[0].scrollHeight - $(messageArea).height()
        });     
    }

    function createMessage(){
        let author = authorInput.val();
        let content = contentInput.val();

        if(author && content){
            let timestamp = Date.now();

            let request = {
                method: 'POST',
                url: BASE_URL + '.json',
                data: JSON.stringify({author, content, timestamp})
            }
    
            $.ajax(request)
                .then(getMessages);
            
            authorInput.val('');
            contentInput.val('');
        }        
    }
}
