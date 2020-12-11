Though the structure of your user guide is entirely up to you,
it should be clear to the staff how and where, if applicable, to compile, configure, and use your project.
It should not be necessary for us to contact you with questions regarding your project after its submission.
Hold our hand with this documentation: be sure to answer in your documentation any questions
that you think we might have while testing your work.

- What is Osusume?

  Osusume is a web recommendation app for comics (manga).
  We take in your inputed manga (singular) and then return to you
  manga (multiple) that you may enjoy based on the input!

- How do you configure/compile Osusume?

  Osusume was written in the VSCode text editor, we used JavaScript
  HTML, and CSS to create the whole app.
  Modules used include: express, mangadex-full-api, node.js, npm,
  http-server, nodemon, eslint, stylelint, @linthtml, and git for windows/gitbash to 
  run the terminal in VSCode.

  To start the webapp, open a terminal in vscode with a path to the osusume folder,
  when in the terminal make sure all the modules are installed, (you may
  have to install node.js and npm with their installers on their respective
  webpages).

  Install the modules as shown above with this syntax in the terminal npm install [module].
  Once everything is installed, in the terminal type in nodemon app.js to start the webpage.
  From here open your browser and in the browser web address bar type in localhost:8080/osusume.html
  The webapp should now be functional.

- How do you use Osusume?

  Osusume will have a bar indicating a submit manga.
  Here type in a manga title, for example: Solo Leveling.
  If you leave the bar blank, the website will throw an error
  at you and tell you to refresh the page.
  Do not type in giberish or you may run into a infinite load
  and will need to refresh the page.

  Type in your manga title and then click "Recommend me something!".
  The webpage will then retrieve possible manga that you intended to
  use. A loading screen will play until an overlay of possible manga is displayed.
  From here select the manga that you intended by clicking on the manga card.

  Another loading screen will play until recommended manga will display on the bottom
  of the webpage. From here you can hover to the manga to get a synosis of the manga,
  click the manga or right click it to be sent to the mangadex webpage of the manga/get the link,
  or again input another manga to start the process over.
  
  Here is a video on how Osusume works: https://youtu.be/wFnnr7CejQM

- Other important information
  As we understand, the API that we use is actually not the official mangadex api.
  The api interfaces with the actual mangadex api to provide more functionality however
  there are some things that are concerning. It is possible that after submission
  the API breaks as the official mangadex devs are creating a new api to replace the
  current official one and it will be on a new server.

  Our video will demonstrate full functionality on our end however we cannot promise
  that this code will still work after 12/9/2020.

