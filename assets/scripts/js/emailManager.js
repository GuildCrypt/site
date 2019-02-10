class EmailManager {
  get() {
    return localStorage.getItem('email')
  }
  set(email) {
    return localStorage.setItem('email', email)
  }
}

export default new EmailManager()
