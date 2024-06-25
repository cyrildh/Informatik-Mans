document.addEventListener('DOMContentLoaded', function() {
    let isAuthenticated = false;

    // Vérification de l'authentification
    fetch('http://localhost:3001/check-auth', {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            isAuthenticated = data.authenticated;
            if (isAuthenticated) {
                loadPosts();
            } else {
                alert('Vous devez être connecté pour gérer les articles.');
                window.location.href = '/login'; // Rediriger vers la page de connexion
            }
        })
        .catch(error => console.error('Erreur:', error));

    // Soumettre le formulaire d'ajout de post
    document.getElementById('add-post-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const image = document.getElementById('image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        fetch('http://localhost:3001/posts', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Post ajouté avec succès!');
                    document.getElementById('add-post-form').reset();
                    loadPosts();
                } else {
                    alert('Échec de l\'ajout du post');
                }
            })
            .catch(error => console.error('Erreur:', error));
    });

    // Charger les posts
    function loadPosts() {
        fetch('http://localhost:3001/posts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(posts => {
                const articlesContainer = document.getElementById('articles');
                articlesContainer.innerHTML = ''; // Clear any existing content
                posts.forEach(post => {
                    const postItem = document.createElement('div');
                    postItem.className = 'card';
                    let postContent = `
                        <img src="http://localhost:3001${post.imageUrl}" alt="${post.title}" width="100%">
                        <div class="card-content">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                            <button onclick="editPost('${post._id}')">Modifier</button>
                        </div>
                    `;
                    postItem.innerHTML = postContent;
                    articlesContainer.appendChild(postItem);
                });
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Ouvrir le modal pour éditer un post
    window.editPost = function(postId) {
        fetch(`http://localhost:3001/posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                document.getElementById('edit-id').value = post._id;
                document.getElementById('edit-title').value = post.title;
                document.getElementById('edit-content').value = post.content;
                document.getElementById('edit-modal').style.display = 'block';
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Fermer le modal d'édition
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('edit-modal').style.display = 'none';
    });

    // Soumettre le formulaire de modification de post
    document.getElementById('edit-post-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('edit-title').value;
        const content = document.getElementById('edit-content').value;
        const image = document.getElementById('edit-image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        fetch(`http://localhost:3001/posts/${id}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Post modifié avec succès!');
                    document.getElementById('edit-modal').style.display = 'none';
                    loadPosts();
                } else {
                    alert('Échec de la modification du post');
                }
            })
            .catch(error => console.error('Erreur:', error));
    });

    // Fermer le modal en cliquant en dehors de celui-ci
    window.onclick = function(event) {
        const modal = document.getElementById('edit-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});
