// Use any valid CSS colour:
export const titleColor = '#004586';
export const headerColor = '#0066cc';
export const backgroundColor = '#dcecfc';

export const name = "Matthew Brown";

export const contact = {
  github: {
    url: "https://github.com/matthew-e-brown",
    display: "github.com/matthew-e-brown"
  },
  email: {
    url: "mailto:matthew.e.brown.17@gmail.com",
    display: "matthew.e.brown.17@gmail.com"
  },
  linkedin: {
    url: "https://www.linkedin.com/in/matthewebrown17/",
    display: "/in/matthewebrown17"
  },
  mobile: {
    url: "tel:+16138498270",
    display: "+1 (613) 849-8270"
  },
  // stackoverflow: {
  //   url: "https://stackoverflow.com/users/10549827/matthew-e-brown",
  //   display: "/matthew-e-brown"
  // },
  // website: {
  //   url: "https://matthew-brown.net",
  //   display: "matthew-brown.net",
  //   icon: 'fa-globe',
  //   iconStyle: 'far'
  // }
};

export const content = {
  "Working Experience": {
    "Full-Time": {
      "Intern / Co-op &mdash; TD Wealth Technology Solutions": `
      Tech support for Wealth Money Movement team. Worked primarily with
      Splunk Enterprise for data monitoring and creating dashboards.
      - September 2019 to December 2019
      `,
      "Cybersecurity Rover &mdash; Trent University": `
        Working with Trent IT to improve cybersecurity measures for both staff
        and students during the COVID-19 remote-learning transition.
        - July 2020 to September 2020
      `,
    },
    "Part-Time": {
      "Work-Study Position &mdash; Trent University": `
        Assitant to the lab demonstrator. TA-ing and creating lab content for
        the *Web Application Development* (COIS-3420H) course.
        - January 2020 to April 2020
      `,
      "Course Content Creator &mdash; Trent University": `
        Created lab content for *Digital World* (COIS-1010H), introduced a
        web-based format for Trent COIS labs.
        - July 2019 to August 2019
      `,
      "Course Marker &mdash; Trent University": `
        Marked for *Programming for Computer Systems* (COIS-1020H).
        - January 2019 to April 2019
      `,
      "Technology Sales Associate &mdash; Staples Canada": `
        Sold laptops, desktops, printers, tablets, and smartphones with
        warranties, services, and accessories.
        - August 2016 to August 2018
      `,
    }
  },
  "Skills": {
    "Programming": {
      "Web Development Specific": `
        - Expert with HTML, CSS, and JavaScript
          - Experienced with Flexbox and CSS Grid
          - ECMAScript ES7+ knowhow and understanding
        - Experienced with VueJS (this resume is a PDF print of
          [a Vue app](https://github.com/matthew-e-brown/Resume)!)
        - Experienced with JavaScript for NodeJS/Server-side (ExpressJS)
        - Familiar with vanilla PHP
      `,
      "General": `
        - Two most skilled languages are JavaScript and Python
        - Intermediate experience working with Python for scripting
        - Experience with Bash/Shell scripting
        - Moderately experienced with C and C#
        - Beginner experience and moderate familiarity with Java
      `,
    },
    "Software": {
      "Linux, Git and Github": `
        - Experience Linux VMs/webservers (Ubuntu, CentOS 7, LAMP)
        - Very comfortable on the command line, including with Git
        - Experience working with GitHub for collaboration
      `,
      "Other Software": `
        - Atlassian, Microsoft Office, and Creative Cloud suites
      `,
    }
  },
  "Education": {
    "2018-pres.": {
      "Trent University": `
        B.Sc (Hon): Computer Science with Co-op &mdash; 86.25% average
        - *Systems Programming* (COIS-3380H)
          - C programming and bash scripting
        - *Web Application Development* (COIS-3420H)
          - Backend, front-end, no-framework web-dev (full-stack)
        - *Modelling and Simulation* (COIS-4470H)
          - Discrete-event and Monte-Carlo simulations in Python
        - *Database Management* (COIS-3400H)
          - RDBMS, SQL, query optimization, relational algebra
      `,
    },
  },
  "Other Achievements": {
    "Languages": {
      "__no-header__": `
        **English** &mdash; Native language, full comprehension and speaking  
        **French** &mdash; Good comprehension and speaking  
        <!-- **Japanese** &mdash; Basic reading comprehension -->
      `,
    },
    "Awards": {
      "D.E.L.F. / D.A.L.F. B1 Certified": `
        Officially bilingual, certified by the <span lang="fr">ministère de
        l'Éducation et de la Jeunesse</span> in France.
      `,
    },
  },
};

export default { name, contact, content };