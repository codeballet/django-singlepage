// default page
const DEFAULT_PAGE = 'form';

// menu button color variables
const ACTIVE = 'turquoise';
const INACTIVE = 'gainsboro';

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
}

// when user hits browser back button
window.onpopstate = (event) => {
    showPage(event.state.page);
    colorMenu(event.state.page)
}

// set browser history state to current page or DEFAULT_PAGE
const current_page = getPage();
if (current_page === '') {
    history.pushState({page: DEFAULT_PAGE}, "", DEFAULT_PAGE);
} else {
    history.pushState({page: current_page}, "", current_page);
}

document.addEventListener('DOMContentLoaded', () => {
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
})