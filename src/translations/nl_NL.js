export default {
  title: 'Project NIDS',
  title_short: 'NIDS',
  title_long: 'Network Intrusion Detection System',
  code: 'nids',
  copyright: `© Monoid Inc | 2018-2019`,

  
  login: {
    title: 'Inloggen',
    username: 'Gebruikersnaam',
    email: 'E-mail',
    password: 'Wachtwoord',
    submit: 'Log in',
    register: 'Registreer',
    forgot: 'Wachtwoord vergeten?',
  },

  register: {
    title: 'Registreer',
    username: 'Gebruikersnaam',
    email: 'E-mail',
    password: 'Wachtwoord',
    repeatpassword: 'Herhaal uw wachtwoord',
    submit: 'Registreer',
    backLogin: 'Ga terug naar login',

    minimal: 'Minimaal',
    uppercase: 'Minimaal 1 hoofdletter',
    lowercase: 'Minimaal 1 kleine letter',
    symbols: 'Minimaal 1 symbool',
    digits: 'Minimaal 1 getal',
    length: 'Minimaal 10 karakters lang',
    matching: 'Uw wachtwoorden komen overeen.',
    repeating: 'Uw wachtwoord mag niet 3 of meer dezelfde karakters achter elkaar bevatten.',
    success: 'Registratie is gelukt! U kunt nu inloggen met uw gebruikersnaam en wachtwoord.',
  },

  terminal: {
    alreadyLoggedIn: 'U bent al reeds ingelogd',
    loginSuccess: '%{user} is met succes ingelogd',
    loggedOut: 'U heeft uitgelogd',
    notLoggedIn: 'U moet ingelogd zijn om deze actie uit te voeren',
    loginError: 'Er ging iets fout met inloggen, probeer het nog eens.',
  },
  
  error: {
    loginError: 'Er ging iets fout met inloggen, probeer het nog eens.',
    passNotStrong: 'Uw wachtwoord is niet sterk genoeg.',
    passMatch: 'Uw wachtwoorden komen niet overeen',
    userInvalid: 'Uw gebruikersnaam klopt niet.',
    emailInvalid: 'Uw e-mail adres klopt niet.',
    mailError: 'Er ging iets mis met het resetten van het password, probeer het nog eens.'
  },

  settings: {
    title: 'Instellingen',
    theme: 'Thema',
    dark: 'Donker',
    light: 'Licht'
  },

  recover: {
    sendMail: 'Wachtwoord vergeten',
    email: 'E-mail adres',
    send: 'Vraag een nieuw wachtwoord aan',
    mailSuccess: 'Als het e-mail adres overeenkomt in onze database, is er een e-mail verstuurd',
    checkMail: 'Bekijk uw mailbox voor een e-mail met verdere instructies.',
  }
}