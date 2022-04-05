
async function editPartyHandler(event) {
    event.preventDefault();
    // We need to POST the email, and password from the
    // form to our server, so go ahead and grab the data 
    // from the form.
    console.log('inside loginFormHandler');
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();
    // Once we have the email and password, make a 
    // fetch() POST request to the /api/users/logins
    // make sure all fields have values
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('dashboard');
      } else {
        alert(response.statusText);
      }
    }
}

async function deletePartyHandler(event) {
    event.preventDefault();
    console.log('inside deletePartyHandler');
    let UriArray = (window.location.pathname).split('/');
    const partyId = UriArray[UriArray.length - 1];
    // Once we have the party id value, make a
    // fetch() DELETE request to the /api/parties/:id
      const response = await fetch(`/api/parties/${partyId}`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
}

async function goToDashboardHandler(event) {
    event.preventDefault();
    console.log('inside goToDashboardHandler');
    document.location.replace('/dashboard');
}

document.getElementById('editPartyBtn').addEventListener('click', editPartyHandler);
document.getElementById('deletePartyBtn').addEventListener('click', deletePartyHandler);
document.getElementById('goToDashboardBtn').addEventListener('click', goToDashboardHandler);
