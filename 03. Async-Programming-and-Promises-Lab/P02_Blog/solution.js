function attachEvents() {
    const KINVEY_APP_ID = "kid_SJLAJCq07";
    const BASE_URL = 'https://baas.kinvey.com/appdata/' + KINVEY_APP_ID;
    const USERNAME = 'peter';
    const PASSWORD = 'p';
    // kinvey requires that credentials are base64 encoded
    const BASE_64 = btoa(`${USERNAME}:${PASSWORD}`);
    // we have to attach a header to the GET request
    const AUTH = { 'Authorization': `Basic ${BASE_64}` };
    const POSTS = $('#posts');
    const POST_TITLE = $('#post-title');
    const BODY = $('#post-body');
    const COMMENTS = $('#post-comments');

    $('#btnLoadPosts').on('click', loadPosts);
    $('#btnViewPost').on('click', viewPosts);

    function sendRequest(method, url, data) {
        return $.ajax({
            method,
            url,
            headers: AUTH
        });
    }

    function loadPosts() {

        sendRequest('GET', `${BASE_URL}/posts`)
            .then(function (result) {
                for (const post of result) {
                    let option = $(`<option id="${post._id}" body="${post.body}">${post.title}</option>`);
                    POSTS.append(option);
                }
            }).catch(handleError);
    }

    function handleError(err) {
        console.log(err);
    }

    function viewPosts() {
        BODY.empty();
        COMMENTS.empty();
        let selectedElement = POSTS.find(':selected');
        let value = selectedElement.text();
        let body = selectedElement.attr('body');
        let postId = selectedElement.attr('id');
        POST_TITLE.text(value);
        let li = $('<li>').text(body);
        BODY.append(li);

        sendRequest('GET', `${BASE_URL}/comments/?query={"post_id":"${postId}"}`)
            .then(function (response){     
                for (const comment of response) {
                    let li = $('<li>').text(comment.text);
                    COMMENTS.append(li);
                }
            }).catch(handleError);
    }
}
