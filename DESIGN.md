The design document discusses the project’s technical implementation details
and reasoning behind design decisions.

- Why did we decide to use Javascript/HTML/CSS for our project?

  We know for sure we wanted to work with an API and as some
  of us have already had experience with web development apps
  we decided this would be the best path forward. We did do
  research into using an API in other languages but they seemed
  to be more cumbersome compared to JS's extensive module libraries
  that could handle what we wanted to do.

- Why VSCode and not ED?

  Originally we did start in an ED workspace but that proved to be an issue when we could not install certain modules like express because of admin rights.
  Also, ED has a limited file space so we could not upload everything we wanted or create new folders as easily.
  We decided to transfer to VSCode. However, we still wanted to work together at the same time like in ED.
  Thankfully, there is an extension for VSCode called LiveShare that allows for peer to peer sharing of the workspace.
  VSCode also allowed us to install other extensions that would let us know things that we were unfamiliar with when it came to the syntax of JS, HTML, and CSS.

- How does our recommendation system work?

  Too bad we aren't Netflix senior-level programmers or we could have
  done a much better job with our recommendation system but we did the
  best we could think of with the limited experience and tools we had.

  We take the user's input and then send it into a fetch function upon
  then clicking the "recommend me something" button.

  If the user inputs an empty string we throw an error and tell them to
  refresh the page, otherwise, it'll work normally.

  We don't have a case to deal with someone inputting in gibberish as we
  could not figure out how to tell if the gibberish was what you could
  consider an invalid title since our code hinges on getting a return
  from the API.

  The input is sent into the fetch function and from there we search for
  the input in the API fullSearch() function sorting by views descending.
  This returns a list of manga that are read on the mangadex website that are the most popular,
  we do this because it is likely our client will be looking for a popular manga.
  However, if the manga is not the first
  the title returned and instead is the third or fourth this could be an issue.
  So we create a JSON object to push the covers, id (Each manga has a unique ID).

  If you look at our app.get('/display/'), you'll notice some conditions that we test for.
  Namely, if the id is less than 10 or if the title length is equal to 1 and we test to make sure that the object returned from the API is only going to send us 5 titles at max. The second condition is self-explanatory, we do not want more than 5 titles because it may crowd the webpage.
  The first condition not so much. We initially ran into a problem where the fullSearch() function, while returning us many manga, if it returned only 1, the object would split the ID and the title to better fit its array-like formatting. For example let's say we have a manga called "Test" with the ID {1234}, if there is another manga called "Test2" that is returned alongside "Test" the object will look like this:

  {id: 1234, title: "Test"
   id: 1235, title: "Test2"}

   However, if "Test" is the only manga in the return then the JSON will split like this,

   {id: 1, title: "T"
    id: 2, title: "e"
    id: 3, title: "s"
    id: 4, title: "t"}

  This would give us the wrong return and not what we wanted,
  so the condition that we placed would check to see if this split happens
  and then we instead search again using, the search() function as it simply returns the first result and if we know there is only one result,
  we cannot give the user a title they weren't expecting.

  Once we send back our JSON object, Osusume.js creates an overlay
  on the webpage that displays to the user a list of manga from here they
  select the one they intend.

  We then take the ID of the clicked manga, and send that into another
  fetch function app.js('/recommended/').

  This function scrapes the genres associated with the manga and then
  stores them into an array.

  we pass that array into another fullSearch this time with the array
  as a param to return manga that would match the genre list.

  You will also notice that we have a global array called "themeExclusion".
  Mangadex has many many tags that identify their manga, however, some tags are rather useless and make it so that the search becomes so incredibly specific that nothing at all would return. These tags would include things such as the format the manga came in or very niche genres that did not reflect the manga as a whole so we created this array to remove what we believed to be "undesirable" tags to broaden the search.

  We then did the same test condition we did in display checking to make sure there is more than 1 return. We then have a second condition. When searching manga again we can't exclude the manga that we inputted with, so as we iterated through the returned manga, if the ID ever matched the ID we started with we simply skipped it and did not add it to our own
  JSON object.

  We have another test condition as well, what if, despite our themeExclusion, the input was too specific? What if there are no other manga that matches its genre list? Then we turned the includeAll param to false.
  The includeAll param, when true, would force every manga that returns to have the same list of genres as the input, when false it just needs to have at least one. While this is not the best solution as we often return just the most popular manga, this is better than simply returning nothing to the user.

  We now send back the JSON of "recommended" manga and display that to the user. The user can then click on the manga and it will have a hyperlink to its respective mangadex website. The user can also hover over the manga to read the description.

  This is how our recommendation program works.

- CSS and website visuals

  We wanted to be as clean and clear to the user as possible. Often when using other websites/apps we find ourselves confused if the directions aren't explicit enough or aren't said implicitly well. We intentionally limited the number of things on the webpage to make sure the user did not stray away/get overwhelmed from its singular function.

  Our runtime is not the greatest and could certainly be improved but
  to distract the user from how long things were taking and to give a bit of visual feedback, our website plays a loading animation we created in After Effects to let the user know that it is doing its job.

  We also display an error to the user in the case of an empty input.

  Our overlay darkens the background so the user can focus on clicking their
  intended manga with directions telling them what to do.

  And we have a highlight on our manga divs so that user gets that feedback
  that they are indeed hovering over stuff and the website isn't broken.

  We also display the synopsis of the manga.

- JS and HTML

  We create a lot of things and access the DOM whenever we receive our JSON.
  Namely, we create manga cards that fill with the manga's covers, links, and titles. This gives a visual to the user to know what manga it is.

- Other Important Things

  When returning the synopsis to the user, mangadex has a lot of extra
  tags and things that allow for special text formatting on their website,
  this gets returned to us and looks messy so we had to learn how to use RegEx to get rid of any special tags or undesirable text.
  This is because many of the manga on mangadex are user uploaded and they decide how to format the description, it's possible
  we did not catch everything with our RegEx.