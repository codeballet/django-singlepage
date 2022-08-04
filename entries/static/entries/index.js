///////////////
// constants //
///////////////

// default page
const DEFAULT_PAGE = 'form';

// menu button colors
const ACTIVE = 'turquoise';
const INACTIVE = 'gainsboro';

///////////////
// functions //
///////////////

// set correct color for navigation menu
function colorMenu(id) {
    // reset all menu buttons
    document.querySelectorAll('.menu').forEach(button => {
        button.style.background = INACTIVE;
    });
    // color clicked menu button
    document.querySelector(`#${id}`).style.background = ACTIVE;
}

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

// get the current browser URL
function getPage() {
    const url = window.location.href;
    const url_list = url.split('/');
    const page = url_list[url_list.length - 1];
    return page;
}

// hide all pages function
function hidePages() {
    const pages = document.querySelectorAll('.pages');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
}

// event listeners on menu buttons
function menuButtons() {
    document.querySelectorAll('.menu').forEach(button => {
        button.onclick = function () {
            const page = this.id;
            pushPage(page);
            showPage(page);
            // colorMenu(page);
        }
    });
}

// event listeners on delete buttons for list entries
function onDelete() {
    // get csrf token
    const csrftoken = getCookie('csrftoken');

    buttons = document.querySelectorAll('.list_button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            fetch(`api/delete/${this.id}`, {
                method: 'DELETE',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            })
            .then(response => response.json())
            .then(message => {
                console.log(message)
                // reload page with refreshed list
                showPage('list');
            })
            .catch(error => {
                console.log('Error: ', error);
            });
        }
    }
}

// event listener on form submit button
// not working fully when submitting!!!!
function onSubmit() {
    // get csrf token
    const csrftoken = getCookie('csrftoken');

    // event listener
    document.querySelector('#form_entry').onsubmit = (event) => {
        // prevent form from submitting
        event.preventDefault();

        const entry = document.querySelector('#form_name').value;
        console.log(entry);

        document.querySelector('#form_name').value = '';

        // show list page
        pushPage('list');
        showPage('list');
    }
}

// push new state to browser history
function pushPage(page) {
    history.pushState({page: page}, "", page);
}

// set browser history state to current page or DEFAULT_PAGE
function setHistory() {
    const current_page = getPage();
    if (current_page === '') {
        pushPage(DEFAULT_PAGE);
        // history.pushState({page: DEFAULT_PAGE}, "", DEFAULT_PAGE);
    } else {
        pushPage(current_page);
        // history.pushState({page: current_page}, "", current_page);
    }
}

// show requested page
function showPage(page) {
    hidePages();
    colorMenu(page);

    document.querySelector(`#${page}_page`).style.display = 'block';

    if (page === 'list') {
        createList();
    } else {
        createForm();
    }
}

///////////
// Pages //
///////////

// build the form page
function createForm() {
    // clear existing form page
    if (document.querySelector('#form_entry')) {
        const parent = document.querySelector('#form_page');
        const child = document.querySelector('#form_entry');
        parent.removeChild(child);
    }

    // create form element
    const form = document.createElement('form');
    form.id = 'form_entry';
    form.className = 'pages';

    // text input element in form
    const input = document.createElement('input');
    input.id = 'form_name';
    input.name = 'entry';
    input.type = 'text';
    input.placeholder = 'Entry';

    // submit element in form
    const submit = document.createElement('input');
    submit.id = 'form_submit';
    submit.type = 'submit';

    // append elements to page
    document.querySelector('#form_page').append(form);
    document.querySelector('#form_entry').append(input);
    document.querySelector('#form_entry').append(submit);

    // focus on form text input
    document.querySelector('#form_name').focus();

    // disable/enable submit button depending on text input
    document.querySelector('#form_submit').disabled = true;
    document.querySelector('#form_name').onkeyup = () => {
        if (document.querySelector('#form_name').value.length > 0) {
            document.querySelector('#form_submit').disabled = false;
        } else {
            document.querySelector('#form_submit').disabled = true;
        }
    }

    // add event listener to submit input
    onSubmit();
}

// build the list page
function createList() {
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

        // add event listeners to delete buttons
        onDelete();
    })
    .catch(error => {
        console.log("error :", error)
    });
}

/////////////////////
// browser actions //
/////////////////////

// browser back button action
window.onpopstate = (event) => {
    showPage(event.state.page);
}

////////////////
// DOM loaded //
////////////////

document.addEventListener('DOMContentLoaded', () => {
    menuButtons();
    setHistory();
    showPage(history.state.page);
    // colorMenu(history.state.page);
})