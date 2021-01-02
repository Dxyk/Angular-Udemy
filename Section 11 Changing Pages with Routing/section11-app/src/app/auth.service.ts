export class AuthService {
  loggedIn = false;

  isAuthenticated() {
    // returns a promise that executes the resolve method after 1 second
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loggedIn);
      }, 1000);
    });
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
