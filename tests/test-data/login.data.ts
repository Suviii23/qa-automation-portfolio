export const loginTestData = {
  standardUser: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'secret_sauce',
  },
  invalidPassword: {
    username: 'standard_user',
    password: 'wrong_password',
  },
  expectedErrors: {
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    invalidCredentials: 'Username and password do not match any user in this service',
  },
};
