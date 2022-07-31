// default page
const DEFAULT_PAGE = 'form';

// menu button color variables
const ACTIVE = 'turquoise';
const INACTIVE = 'gainsboro';

// get csrf token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getPage() {
    // get the current browser URL
    const url = window.location.href;
    const url_list = url.split('/');
    const page = url_list[url_list.length - 1];
    return page;
}

function colorMenu(id) {
    // reset all menu buttons
    document.querySelectorAll('.menu').forEach(button => {
        button.style.background = INACTIVE;
    });
    // color clicked menu button
    document.querySelector(`#${id}`).style.background = ACTIVE;
}

function hidePages() {
    const pages = document.querySelectorAll('.pages');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
}

function showPage(page) {
    hidePages();
    // show requested page
    document.querySelector(`#${page}_page`).style.display = 'block';

    if (page === 'list') {
        // clear existing list page
        if (document.querySelector('#listing')) {
            const parent = document.querySelector('#list_page');
            const child = document.querySelector('#listing');
            parent.removeChild(child);
        }
        
        // create ul for entries
        const ul = document.createElement('ul');
        ul.id = 'listing'
        const button = document.createElement('button');
        document.querySelector('#list_page').append(ul)

        // fetch entries from api
        fetch('api/entries')
        .then(response => response.json())
        .then(data => {
            Object.entries(data.entries).forEach(entry => {
                const [key, value] = entry;
                console.log(`${key}: ${value}`);
                // create and append li and button elements
                const li = document.createElement('li');
                const button = document.createElement('button');
                li.id = `entry_${key}`
                li.innerHTML = value;
                button.id = key;
                button.className = 'list_button';
                button.innerHTML = 'Delete';
                document.querySelector('#listing').append(li);
                document.querySelector(`#entry_${key}`).append(button);
            });
        })
        .catch(error => {
            console.log("error :", error)
        });
    }
}

// when user hits browser back button
window.onpopstate = (event) => {
    showPage(event.state.page);
    colorMenu(event.state.page)
}

// set browser history state to current page or DEFAULT_PAGE
const current_page = getPage();
console.log(current_page);
if (current_page === '') {
    history.pushState({page: DEFAULT_PAGE}, "", DEFAULT_PAGE);
} else {
    history.pushState({page: current_page}, "", current_page);
}

document.addEventListener('DOMContentLoaded', () => {
    // get csrf token from cookie
    const csrftoken = getCookie('csrftoken');

    hidePages();
    showPage(history.state.page);
    colorMenu(history.state.page);

    // add event listeners on menu buttons
    document.querySelectorAll('.menu').forEach(button => {
        button.onclick = function () {
            const page = this.id
            history.pushState({page: page}, "", page);
            showPage(page);
            colorMenu(page);
        }
    });

    // add event listeners on list buttons
    document.querySelectorAll('.list_button').forEach(button => {
        button.onclick = function () {
            fetch(`api/delete/${this.id}`, {
                method: 'DELETE',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            })
            // .then(response => response.json())
            // .then(message => {
            //     console.log(message)
            // })
            .catch(error => {
                console.log('Error: ', error);
            });
        }
    });
})