const toggleButton = document.getElementsByClassName('toggle-button')[0]; // class is in navbars partial
const navbarLinks = document.getElementsByClassName('navbar-links')[0]; // class is in navbars partial
const createParty = document.querySelector('.create-party-modal'); // class is in navbars partial
const searchParty = document.querySelector('.search-party-modal'); // class is in navbars partial
const searchModal = document.querySelector('#search-modal'); 
const searchClose = document.querySelector('#search-delete');
const modalClose = document.querySelector('.delete'); // class is in dashboard
const modalBackground = document.querySelector('.modal-background');
const searchModalBackground = document.querySelector('.search-modal-background');
const modal= document.querySelector('.modal');
const modalCancel = document.getElementById('modalCancel');
const createPartyBtn = document.getElementById('createPartyBtn');
const searchPartyBtn = document.getElementById('searchPartyBtn');
const modalCancelBtn = document.querySelector('#searchModalCancelBtn');

async function searchPartyHandler(event) {
    event.preventDefault();
    // get the values from the modal inputs, radio buttons, etc
    const ispublic = document.getElementById('searchPartyPublic').checked;
    const ispublicfalse = document.getElementById('searchPartyPrivate').checked;
    const isover21 = document.getElementById('searchIsOver21True').checked;
    const isover21false = document.getElementById('searchIsOver21False').checked;
    const theme_id = document.getElementById('searchPartyTheme').value.trim();
    const searchDistance = document.getElementById('searchPartyDistance').value.trim();

    // check that there is at least one qualifying condition from the above constants
    if(! ( ispublic || ispublicfalse || isover21 || isover21false || theme_id || searchDistance)) {
        alert('Please ensure you are inputting a value for at least one field');
        return;
    }
    // console.log(ispublic, ispublicAll, isover21, isover21false, theme_id, searchDistance);
    
    const response = await fetch('/searchresults', {
        method: 'post',
        body: JSON.stringify({
          ispublic,
          isover21,
          theme_id
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if(response.ok) {
        alert('Your search is successfull!');
        modal.classList.remove('is-active');
        // after the modal is removed, refresh the page to show the search results
        document.location.replace('searchResults');
    } else {
        alert(response.statusText);
    }
}

// handle the user submitting a new party event
async function createPartyHandler(event) {
    event.preventDefault();
    // get the values from the modal inputs, radio buttons, etc
    const title = document.getElementById('createPartyTitle').value.trim(); 
    const startdate = document.getElementById('createPartyStartDate').value.trim();
    const ispublic = document.getElementById('createPartyPublic').checked;
    const ispublicfalse = document.getElementById('createPartyPrivate').checked;
    const isover21 = document.getElementById('createIsOver21True').checked;
    const isover21false = document.getElementById('createIsOver21False').checked;
    const theme_id = document.getElementById('createPartyTheme').value.trim();

    // check that all of the above constants have values and/or a 'checked' status
    if(!(title && startdate && (ispublic || ispublicfalse) && (isover21 || isover21false) && theme_id)) {
        alert('Please ensure you are inputting a value for every field, or selecting an option in every case.');
        return;
    }

    // Once we confirm we have values for all the fields in create-a-party modal,
    // make fetch() POST request to /api/parties/ to create a new party record
    const response = await fetch('/api/parties', {
        method: 'post',
        body: JSON.stringify({
          title,
          startdate,
          ispublic,
          isover21,
          theme_id
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        alert('Your party has been succesfully created!');
        modal.classList.remove('is-active');
        // after the modal is removed, refresh the dashboard so the new party shows
        document.location.replace('dashboard');
    } else {
        alert(response.statusText);
    }
}



toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
});


// ***** CREATE MODAL EVENT LISTENERS ***** // 
createParty.addEventListener('click', () => {
    modal.classList.add('is-active')
    modalBackground.classList.add('is-active');
});



// ***** SEARCH MODAL EVENT LISTENERS ***** // 
searchParty.addEventListener('click', () => {
    searchModal.classList.add('is-active')
    searchModalBackground.classList.add('is-active');
});

searchClose.addEventListener('click', () => {
    searchModal.classList.remove('is-active');
});


// ***** UTILITY MODAL EVENT LISTENERS ***** //
// close out of modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('is-active');
});

// cancel out of modal
// modalCancel.addEventListener('click', () => {
//     modal.classList.remove('is-active');
// });

modalCancelBtn.addEventListener('click', () => {
    modal.classList.remove('is-active');
});


// event listener for when the 'Search parties' button is clicked
searchPartyBtn.addEventListener('click', searchPartyHandler);
// event listener for when the 'Create Party' button is clicked
createPartyBtn.addEventListener('click', createPartyHandler);