let petsService = (() => {
    function getAll(userId) {
        const endpoint = `pets?query={}&sort={"likes": -1}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }
    

    function addPet(name, description, image, category) {
        console.log(image);
        let data = {
            name,
            description,
            imageURL: image,
            category,
            likes: 0
        }

        return remote.post('appdata', 'pets', 'kinvey', data);
    }

    function getMyPets(userId) {
        const endPoint = `pets?query={"_acl.creator":"${userId}"}`;
        return remote.get('appdata', endPoint, 'kinvey');
    }

    function getById(petId) {
        const endpoint = `pets/${petId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function petPet(petId){
        getById(petId).then(function (data){
            let likes = +(data.likes) + 1;
            data.likes = likes;
            const endpoint = `pets/${petId}`;
            return remote.update('appdata', endpoint, 'kinvey', data);
        });    
    }

function editPet(id, name, likes, imageURL, category, description){
        let data = {
            name,
            likes,
            imageURL,
            category,
            description
        };

        const endpoint = `pets/${id}`;
        return remote.update('appdata', endpoint, 'kinvey', data);
}

    
    function getByCategory(category) {
        const endpoint = `pets?query={"category":"${category}"}&sort={"likes": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function remove(petId) {
        const endpoint = `pets/${petId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }
    
    return {
        getAll,
        addPet,
        getById,
        getMyPets,
        getByCategory,
        remove,
        petPet,
        editPet,
    };
})();