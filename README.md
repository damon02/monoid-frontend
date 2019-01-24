# Network Intrusion Detection System
This repository contains the frontend of the Network Intrusion Detection System.  

## Setup and deployment

The following guide is how to setup the frontend using a Linux powered server.

### Requirements

1.  NodeJS
2.  npm

### Getting started

1.  Clone the repository
```$ git clone [url] ```

2.  Install NodeJS and npm globally

### Development

1.  Go to your project
```$ cd frontend```

2.  Install the dependencies of the project
```$ npm install```

3.  Run the server locally
```$ npm start```

4.  Start development, all code is inside of the `src` folder

### Deployment

This frontend can be statically hosted on any web server. It runs completely client-side.

1.  Build the project
``` $ npm run build```

This will generate a folder called `build` containing the built application which is now ready for deployment.

From here on you have free range to deploy it to any server you'd like. For this tutorial we will focus on deploying the frontend to a Linux server running Ubuntu with a domain name of your choosing.

2.  Make sure the server is running Ubuntu >= 16.04 and has Nginx installed.

3.  Update the server
``` $ sudo apt-get update```

4.  Install NodeJS and npm
``` $ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - sudo apt-get install -y nodejs ```

5.  Clone the repository on the machine and install all dependencies. For this tutorial we will clone it into /var/www
``` $ sudo mkdir /var/www```
``` $ cd /var/www```
``` $ git clone [url]```
``` $ cd frontend```
``` $ sudo npm install```
``` $ sudo npm run build```

6.  Configure Nginx' default file
``` $ cd /etc/nginx/sites-available```

7.  Open the default file into your favorite text editor and change the file to the following:
```json
server {
   listen 80 default_server;
   root /var/www/frontend/build;
   server_name [your.domain.com] [your other domain if you want to];
   index index.html index.htm;
   location / {
   }
}
```

8.  Start nginx
``` $ sudo service nginx start```

### Updating after deployment

If you have made changes to the project/repository post initial deployment, there is a quick way to make the project up to date and running again.

1.  Go to the project folder
``` $ cd /var/www/frontend```

2.  Execute the `npm run update` command
``` $ npm run update```

This will make sure the latest commits are pulled, new libraries are installed, a new build is made of the static website and that the nginx server is restarted.

## Structure

This project is built up from React components, which make up the entire application.
Inside the root folder there are several folders.

- public
  - Contains favicons and general public files
- node_modules
  - Contains all libraries and dependencies of the project
- src
  - All components and project functionality is located here

### src

Inside `/src` all logic and application functionality is located.

- components
  - Contains all major and minor components which make up the application.
  - These components are mostly sorted by page, where every folder is a page inside the project. Only the `/html` folder contains components which are used more than once.
  - App is the main component from which the entire application is accessed from once you are logged in.
- fontawesome
  - Files of the [fontawesome](https://fontawesome.com/) icon library, used throughout the project
- statics
  - Contains static functionality, such as type declarations, constant variables and initial redux reducers.
- style
  - Contains all main style and image related files.
- translations
  - Translation files, currently only English is supported but this can be expanded to other languages easily.
- utils
  - Utility functions which are used throughout the project more than once.
- index.scss
  - Styling used throughout the whole project
- index.tsx
  - Main file from which the application is started
- setupTests.js
  - File from which tests are started from

### Project dependencies

Inside the `/package.json` all project dependencies are defined. 

The majors ones are:

- `react`
  - React is the framework which is used to develop the application.
- `typescript`
  - React can be used with Javascript and Typescript, this project uses Typescript.
- `tslint`
  - Linter used in combination with Typescript to maintain code quality.
- `redux`, `react-redux`
  - State management library, used to maintain a single overhead state which can be accessed from any component if it is connected to the overhead state.
- `react-redux-i18n`
  - Translations management, ensures no raw strings have to be put inside code.
- `node-sass`
  - Advanced CSS library, uses `*.scss` files to give the developer more features and freedom than normal `*.css` files.
- `react-router`
  - Routing library which transforms the single page application to an application with actual traversable routes.
- `react-table`
  - Library which shows a table which can be sorted, filtered and styled easily.
- `recharts`
  - Charts library used to display graphs, charts throughout the application.
- `react-datepicker`
  - Datepicker to manage the data fetching range throughout the application.
- `lodash`
  - Library containing a lot of minor helpful functions which gives less headaches during development.

  