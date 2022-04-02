const getGeoCoordinates = require('./getGeoCoordinates');

async function loginFormHandler(event) {
  event.preventDefault();
  // We need to POST the email, and password from the
  // form to our server, so go ahead and grab the data 
  // from the form. 
  const email = document.getElementById('#email-login').value.trim();
  const password = document.getElementById('#password-login').value.trim();
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
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
}

async function signupFormHandler(event){
  event.preventDefault();
  // We need to POST first name, last name, email, age, & address
  // going from our sign-up form to the server. Here we grab the data from
  // our form
  const firstName = document.getElementById('firstname-signup').value.trim();
  const lastName = document.getElementById('lastname-signup').value.trim();
  const email = document.getElementById('email-signup').value.trim();
  const age = document.getElementById('age-signup').value.trim();
  const address = document.getElementById('address-signup').value.trim();
  const password = document.getElementById('password-signup').value.trim();

  // run the function getGeoCoordinates and pass it the address value
  const coordObject = await getGeoCoordinates(address);
  console.log('coordObject is', coordObject);
  const lat = coordObject.lat;
  const long = coordObject.long;
  
  // Make a fetch() POST request to the /api/users/ endpoint
  // make sure all fields have values
  if(firstName && lastName && email && age & address & password){
      const response = await fetch('/api/users', {
          method: 'post',
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            age,
            address,
            password,
            lat,
            long
          }),
          headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to sign up.');
      }

      // check the response status
      // if(response.ok) {
      //     console.log(`Success! User has been created successfully!`);
      // } else {
      //     alert(response.statusText);
      // }
  }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);


/* async function getGeoCoordinates(address){
  const apiKey = '?access_key=25e2b1c85ca812719be65cf3c84d6081';
  const baseUrl = 'http://api.positionstack.com/v1/forward';
  // const address = document.querySelector('#user-address').value.trim();
  const apiUrl = baseUrl + apiKey + '&query=' + address + '&limit=3';
  // const apiUrl = process.env.baseUrl + process.env.apiKey + '&query=' + address + '&limit=3';
  const response = await fetch(apiUrl);
  const data = await response.json();
  let lat = data.data[0].latitude;
  let long = data.data[0].longitude;
  // console.log('lat and long are', lat, long);
  return { lat, long };
} */

/* ONLY FOR BROWSER TESTING */
// buttonEl.addEventListener('click', signupFormHandler);






/* const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in.');
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const fullname = document.querySelector('#name-signup').value.trim();
  const address = document.querySelector('#home-address').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const dateOfBirth = document.querySelector('#age-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (fullname && address && email && dateOfBirth && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ fullname, address, email, dateOfBirth, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to sign up.');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler); */
