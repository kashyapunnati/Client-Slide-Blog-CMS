const postIdInput = document.getElementById("postId");
const postTitleInput = document.getElementById("postTitle");
const postContentInput = document.getElementById("postContent");
const postStatusInput = document.getElementById("postStatus");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const filterStatus = document.getElementById("filterStatus");
const postsContainer = document.getElementById("postsContainer");

let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];


function savePosts() {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}

function displayPosts() {

    const selectedStatus = filterStatus.value;

    const filteredPosts = posts.filter(function (post) {

        if (selectedStatus === "all") {
            return true;
        }

        return post.status === selectedStatus;
    });

    postsContainer.innerHTML = "";

    if (filteredPosts.length === 0) {

        postsContainer.innerHTML = `
            <p class="empty-message">
                No posts available.
            </p>
        `;

        return;
    }

    filteredPosts.forEach(function (post) {

        const postCard = document.createElement("div");

        postCard.className = "post-card";

        postCard.innerHTML = `
            <h3>${escapeHTML(post.title)}</h3>

            <p class="post-content">
                ${escapeHTML(post.content)}
            </p>

            <div class="post-meta">

                <span>
                    ${formatDate(post.createdAt)}
                </span>

                <span class="status ${post.status}">
                    ${post.status.toUpperCase()}
                </span>

            </div>

            <div class="post-actions">

                <button
                    class="preview-btn"
                    onclick="previewPost('${post.id}')"
                >
                    👁️ Preview
                </button>

                <button
                    class="edit-btn"
                    onclick="editPost('${post.id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deletePost('${post.id}')"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        postsContainer.appendChild(postCard);
    });
}

saveBtn.addEventListener("click", function () {

    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    const status = postStatusInput.value;

    if (title === "" || content === "") {

        alert("Please enter both title and content.");

        return;
    }

    const existingId = postIdInput.value;

    if (existingId) {

        const post = posts.find(function (item) {
            return item.id === existingId;
        });

        if (post) {
            post.title = title;
            post.content = content;
            post.status = status;
            post.updatedAt = new Date().toISOString();
        }

        alert("Post updated successfully!");

    } else {

        const newPost = {

            id: Date.now().toString(),

            title: title,

            content: content,

            status: status,

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()
        };

        posts.unshift(newPost);

        alert("Post created successfully!");
    }

    savePosts();

    clearForm();

    displayPosts();
});

clearBtn.addEventListener("click", function () {

    clearForm();

});


function clearForm() {

    postIdInput.value = "";

    postTitleInput.value = "";

    postContentInput.value = "";

    postStatusInput.value = "draft";

    saveBtn.textContent = "Save Post";
}


function editPost(id) {

    const post = posts.find(function (item) {
        return item.id === id;
    });

    if (!post) {
        return;
    }

    postIdInput.value = post.id;

    postTitleInput.value = post.title;

    postContentInput.value = post.content;

    postStatusInput.value = post.status;

    saveBtn.textContent = "Update Post";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deletePost(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
        return;
    }

    posts = posts.filter(function (post) {
        return post.id !== id;
    });

    savePosts();

    displayPosts();
}


function previewPost(id) {

    const post = posts.find(function (item) {
        return item.id === id;
    });

    if (!post) {
        return;
    }

    alert(
        "POST PREVIEW\n\n" +
        "Title: " + post.title +
        "\n\n" +
        "Status: " + post.status.toUpperCase() +
        "\n\n" +
        post.content
    );
}


filterStatus.addEventListener("change", function () {

    displayPosts();

});


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();
}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

displayPosts();