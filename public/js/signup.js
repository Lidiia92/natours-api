/* eslint-disable no-undef */

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/signup/',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('#formSignUp').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  signup(name, email, password, passwordConfirm);
});
