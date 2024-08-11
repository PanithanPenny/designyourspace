document.addEventListener('DOMContentLoaded', function () {
    loadPosts();
});


async function loadPosts() {
    try {
        const response = await fetch("/api/listPosts");
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const postsContainer = document.getElementById("posts");
        if (postsContainer) {
            let postsHTML = "";
            data.reverse().forEach((url) => {
                postsHTML += `<img src="${url}" alt="Uploaded Image" class="posted-image"/>`;
            });
            postsContainer.innerHTML = postsHTML;
        } else {
            console.error('Posts container element not found');
        }
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}
