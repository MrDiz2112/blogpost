function getPosts() {
    $.ajax({
        url: "/api/posts",
        type: "GET",
        contentType: "application/json",
        success: function (posts) {
            var divs = "";
            $.each(posts, function (index, post) {
                console.log(post);
                var newDiv = div(post);
                divs += newDiv;
            });

            $(".content").append(divs);
        }
    })
}

function getPost(id) {
    $.ajax({
        url: "/api/posts/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (post) {
            var form = document.forms["postForm"];
            form.elements["id"].value = post._id;
            form.elements["title"].value = post.title;
            form.elements["text"].value = post.text;
        }
    })
}

function createPost(postTitle, postText) {
    $.ajax({
        url: "api/posts/",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            title: postTitle,
            text: postText
        }),
        success: function (post) {
            reset();
            updateDivs();
        }
    })
}

function editPost(postID, postTitle, postText) {
    $.ajax({
        url: "api/posts/",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: postID,
            title: postTitle,
            text: postText
        }),
        success: function (post) {
            reset();
            console.log(post);
            $("content[data-postid='" + post._id + "']").replaceWith(div(post));
            updateDivs();
        }

    })
}

function deletePost(id) {
    $.ajax({
        url: "api/posts/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (post) {
            console.log(post);
            updateDivs();
        }
    })
}

function searchPost(postTitle) {
    $.ajax({
        url: "/api/search/" + postTitle,
        type: "GET",
        contentType: "application/json",
        success: function (posts) {
            var divs = "";
            $.each(posts, function (index, post) {
                console.log(post);
                var newDiv = div(post);
                divs += newDiv;
            });
            $(".content").empty();
            $(".content").append(divs);
        }
    })
}

function reset() {
    var form = document.forms["postForm"];
    form.reset();
    form.elements["id"].value = 0;
}

var div = function (post) {
    return `<div class="post" data-postid="` + post._id + `">` +
        `<h4>${post.title}</h4>` +
        `<p>${post.text}</p>` +
        `<p class="text-right">Дата публикации:${post.date}</p>` +
        `<p class="text-right"><a class='editLink' data-id='` + post._id + `'>Изменить</a> | ` +
        `<a class='removeLink' data-id='` + post._id + `'>Удалить</a></p>` +
        `</div>`;
};

var updateDivs = function () {
    $(".content").empty();
    getPosts();
};

$('form[name="searchForm"').submit(function (e) {
    e.preventDefault();

    var title = this.elements['search'].value;

    searchPost(title);
});

$("#all-posts").click(function (e) {
    e.preventDefault();
    var form = document.forms["searchForm"];
    form.reset();

    $(".content").empty();

    getPosts();
});

$("#reset").click(function (e) {
    e.preventDefault();
    reset();
});

$('form[name="postForm"]').submit(function (e) {
    e.preventDefault();

    var id = this.elements['id'].value;
    var title = this.elements['title'].value;
    var text = this.elements['text'].value;

    if (id == 0)
        createPost(title, text);
    else
        editPost(id, title, text);
});

$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    getPost(id);
});

$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    deletePost(id);
});

getPosts();