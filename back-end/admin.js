document.addEventListener('DOMContentLoaded', function() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            posts.forEach(post => {
                const li = document.createElement('li');
                li.textContent = post.title;
                const editLink = document.createElement('a');
                editLink.href = `admin/html/edit_post.html?id=${post.id}`;
                editLink.textContent = 'Modifier';
                li.appendChild(editLink);
                postList.appendChild(li);
            });
        });
});
