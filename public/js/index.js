/* eslint-disable */

import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';

//DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('#formLogin');
const signupForm = document.querySelector('#formSignUp');
const logOutBtn = document.querySelector('.nav__el--logout');

//VALUES

//DELEGATION
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
