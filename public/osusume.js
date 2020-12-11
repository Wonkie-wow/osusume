"use strict";
let synopsisArray = [];

(function() {
    window.addEventListener("load", init);
    /**
     * Handles the intial loading process
     * of the page.
     */
    function init() {
        var button = document.getElementById("recommend_button");
        button.addEventListener("click", getUserSelect);
    }

    // Takes in the input that the user provided
    // uses input to search for the most viewed manga
    // that matches the user's input.
    // Search will return the manga's cover source, id, and title.
    function getUserSelect() {
        let warningText = document.getElementById("warning");
        let userManga = userInput();
        if (userManga == "") {
            warningText.innerHTML = "Your search input is empty, refresh the page and try again.";
            warningText.style.display = "block";
        } else {
            synopsisArray = [];
            warningText.style.display = "hidden";
            document.getElementById("recommendations").innerHTML = "";
            document.getElementById("overlay").style.display = "block";
            document.getElementById("loading").style.display = "block";
            fetch('/display/' + userManga)
            .then(resp => resp.json())
            .then(createOverlay)
            .catch(console.error);
        }
    }

    // Returns the user's text input from the website.
    //
    function userInput() {
        let input = document.getElementById("manga_input").value;
        if (input != null) {
            return input;
        }
        document.getElementById("manga_input").value = "";
    }

    // Creates an empty card-like template that will
    // contain basic manga information and returns
    // the created card
    function createCard() {
        const image = document.createElement("img");
        image.setAttribute("class", "input_cover");

        const container = document.createElement("div");
        container.setAttribute("class", "container");
        container.appendChild(document.createElement("h4"));

        const card = document.createElement("a");
        card.setAttribute("class", "card");
        card.appendChild(image);
        card.appendChild(container);
        return card;
    }

    // Creates an overlay that will display a set of manga using cards
    // function will fill cards with cover images, titles, and a hidden id tag
    // overlay is intended to protect client from searching again.
    function createOverlay(json) {
        document.getElementById("instruction").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        var i;
        for (i = 0; i < Object.keys(json).length; i++) {
            const card = createCard();
            document.getElementById("overlay_contents").appendChild(card);
            card.setAttribute("id", json[i].id);
            card.getElementsByClassName("container")[0].getElementsByTagName("h4")[0].appendChild(document.createTextNode(json[i].title));
            card.getElementsByTagName("img")[0].setAttribute("src", "http://mangadex.org" + json[i].cover);
            card.addEventListener("click", getRecommended);
        }
        document.getElementById("loading").style.display = "none";
    }

    // Returns JSON File with
    // Title of manga, Hyperlinks to manga, Cover links to manga
    function getRecommended() {
        document.getElementById("loading").style.display = "block";
        document.getElementsByTagName("h2")[0].style.display = "none";
        document.getElementById("overlay_contents").innerHTML = "";
        fetch('/recommended/' + this.id)
            .then(resp => resp.json())
            .then(createResult)
            .catch(console.error);
    }

    // Fills a card template with the recommended manga's
    // cover images, titles, and a hyperlink to the manga site
    function createResult(json) {
        var i;
        for (i = 0; i < Object.keys(json).length; i++) {
            const card = createCard();
            document.getElementById("recommendations").appendChild(card);

            card.setAttribute('id', i);
            card.getElementsByClassName("container")[0].getElementsByTagName("h4")[0].appendChild(document.createTextNode(json[i].title));
            card.setAttribute('href', json[i].url); card.setAttribute('target', "_blank"); card.setAttribute('rel', "noopener noreferrer");
            card.getElementsByTagName("img")[0].setAttribute("src", "https://mangadex.org" + json[i].cover);

            synopsisArray.push(editSynopsis(json[i].description));
            card.addEventListener("mouseover", createSynopsis);
        }
        document.getElementById("loading").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }

    // When a manga result's card is hovered over,
    // function will create an overlay that display's the manga's synopsis
    // provided by the mangadex site.
    function createSynopsis() {
        const otherCards = document.getElementsByClassName("card");
        var i;
        for (i = 0; i < otherCards.length; i++) {
            otherCards[i].style.visibility = "hidden";
        }
        document.getElementById("overlay").style.display = "block";
        const card = document.getElementById(this.id);
        card.style.visibility = "visible";

        if (Number(this.id) < 2) {  //align synopsis left or right
            document.getElementById("synopsis").style.removeProperty("left");
            document.getElementById("synopsis").style.right = "10px";
            document.getElementById("synopsis_text").style.float = "right";
            document.getElementById("synopsis_text").style.textAlign = "right";
        } else {
            document.getElementById("synopsis").style.removeProperty("right");
            document.getElementById("synopsis").style.left = "10px";
            document.getElementById("synopsis_text").style.float = "left";
            document.getElementById("synopsis_text").style.textAlign = "left";
        }
        document.getElementById("synopsis_text").appendChild(document.createTextNode(synopsisArray[Number(this.id)]));
        card.addEventListener("mouseout", removeSynopsis);

    }

    // Function will remove manga synopsis and overlay
    // when card is no longer hovered over
    function removeSynopsis() {
        document.getElementById("synopsis_text").innerHTML = "";

        const otherCards = document.getElementsByClassName("card");
        for (var i = 0; i < otherCards.length; i++) {
            otherCards[i].style.visibility = "visible";
        }
        document.getElementById("overlay").style.display = "none";
    }

    // Function will clean markup texts from synopsis,
    // removing text like [b] or &quot; from the synopses
    // for user readability.
    // Given that synopses are written by all kinds of users,
    // there is no guarantee that this function will remove all markup text
    function editSynopsis(synopsis) {
        synopsis = synopsis.replaceAll("&lt;", "<");
        synopsis = synopsis.replaceAll("&gt;", ">");
        synopsis = synopsis.replaceAll("&quot;", "\"");
        synopsis = synopsis.replaceAll("&ldquo;", "\"");
        synopsis = synopsis.replaceAll("&rdquo;", "\"");
        synopsis = synopsis.replaceAll("&hellip;", "...")
        synopsis = synopsis.replaceAll("&lsquo;", "'");
        synopsis = synopsis.replaceAll("&rsquo;", "'");
        synopsis = synopsis.replaceAll("zwnj", "");
        synopsis = synopsis.replace(/^.*[[*]].*$/mg, "");
        synopsis = synopsis.replace(/^.*[[hr]].*$/mg, "");
        synopsis = synopsis.replace(/^.*[(].*$/mg, "");
        synopsis = synopsis.replace(/^.*[[].*$/mg, '"');
        synopsis = synopsis.trim();
        return synopsis;
    }
})();