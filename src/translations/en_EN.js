export default {
  title: 'Project NIDS',
  title_short: 'NIDS',
  title_long: 'Network Intrusion Detection System',
  code: 'nids',
  copyright: `© Monoid Inc | 2018-2019`,

  
  login: {
    title: 'Login',
    username: 'Username',
    email: 'E-mail address',
    password: 'Password',
    submit: 'Log in',
    register: 'Register',
    forgot: 'Forgot your password?',
  },

  header: {
    home: 'Home',
    udp: 'UDP',
    tcp: 'TCP',
    uip: 'IP statistics',
    daily: 'Daily statistics'
  },

  register: {
    title: 'Registration',
    username: 'Username',
    email: 'E-mail address',
    password: 'Password',
    repeatpassword: 'Repeat your password',
    submit: 'Register',
    backLogin: 'Go back to login',

    minimal: 'At least',
    uppercase: 'At least 1 uppercase letter',
    lowercase: 'At least 1 lowercase letter',
    symbols: 'At least 1 symbol',
    digits: 'At least 1 number',
    length: 'At least 10 characters long',
    matching: 'Your passwords match.',
    repeating: 'Your password is not allowed to have 3 repeating characters in succession.',
    success: 'Registration succesfull! Please check your e-mail for further instructions.',
  },

  terminal: {
    alreadyLoggedIn: 'You are already logged in',
    loginSuccess: '%{user} has successfully logged in',
    loggedOut: 'You have logged out',
    notLoggedIn: 'You have to be logged in to execute this command',
    loginError: 'Something went wrong while logging in, please try again.',
  },
  
  error: {
    loginError: 'Something went wrong while logging in, please try again',
    passNotStrong: 'Your password is not strong enough',
    passMatch: 'Your passwords do not match',
    userInvalid: 'Your username is invalid',
    emailInvalid: 'Your e-mail address is invalid.',
    mailError: 'Something went wrong while resetting your password, please try again.',
    tokenFetchError: 'Something went wrong while trying to fetch a token',
    localMailError: 'Fill in your e-mail address',
    getSettingsError: 'Unable to fetch user settings'
  },

  settings: {
    title: 'Settings',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    refreshToken: 'Token',
    safetyToken: 'Regenerating your token could potentially break the entire system, please only use this if you know what you are doing.',
    refresh: 'Regenerate token',
    enabledNotifications: 'Notifications',
    disabled: 'Disabled',
    enabled: 'Enabled',
    recipients: 'Notification recipients',
    addRecipient: 'Add recipient',
    saveChanges: 'Save changes',
  },

  recover: {
    sendMail: 'Forgot password',
    email: 'E-mail address',
    send: 'Request a new password',
    mailSuccess: 'If your e-mail matches in our system, an e-mail has been sent with further instructions.',
    checkMail: 'View your e-mail for further instructions.',
    backToLogin: 'Go back to login',
  },

  activateAccount: {
    title: 'Account activation',
    activated: 'Your account has been activated!',
    activating: 'Activating...',
    failedToActivate: 'We were unable to activate your account, please retry by refreshing the page.'
  },

  dashboard: {
    graphs: {
      httpMethods: 'HTTP methods',
      protocols: 'Protocols',
    }
  }
}