window.addEventListener("DOMContentLoaded", () => {
  // Define active character box
  $(".word-container").first().attr("id", "current-row");
  $(".char-container").first().attr("id", "current-char");

  // Define global variables
  let userWord = "";
  let line = 1;
  const msg = $(".message-container");

  // Hide pop-up elements
  $(".popup").hide();
  $("#close").hide();

  // Database guess handler
  $(".btn").click(function () {
    // Post guess
    const num = $(this).attr("id");
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        num: num,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Show message and toggle main view
        msg.html(result.msg);
        $("#endgame").hide();
      });
  });

  // How-to button handler
  $("#howto").click(() => {
    $(".svg").toggle();
    $("#welcome").toggle();
  });

  // X button handler
  $("#close").click(function () {
    $("#recall").hide();
    $("#welcome").hide();
    $(".svg").toggle();
  });

  // Recall button handler
  $("#info").click(function () {
    // request known words from server
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recall: true,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Add words to popup view
        const left = JSON.parse(result.inDb);
        const right = JSON.parse(result.notInDb);

        $("#left > .words").html("");
        $("#right > .words").html("");

        left.forEach((word) => {
          $("#left > .words").append(`<p>${word}</p>`);
        });

        right.forEach((word) => {
          $("#right > .words").append(`<p>${word}</p>`);
        });

        // Toggle recall view
        $(".svg").toggle();
        $("#recall").toggle();
      });
  });

  // Virtual keyboard key event listner
  $(".key").click(function () {
    handleChar($(this).attr("id"));
  });

  // Actual keyboard key event listner
  $(window).keyup((event) => {
    handleChar(event.key);
  });

  // Keybord key handler
  const handleChar = function (key) {
    // Clear message box
    msg.html("");

    // A-Z
    if (key.length === 1 && key.match(/[a-z]/i) && userWord.length < 5) {
      pushChar(key);

    // Enter
    } else if (key === "Enter" || key === "⏎") {
      checkWord(userWord);
    
    // Backspace
    } else if (key === "Backspace" || key === "⌫") {
      // last character box
      if ($("#current-char").length === 0) {
        popChar(true);
      
      // Any other box
      } else if ($("#current-char").prev().length !== 0) {
        popChar(false);
      }
    }
  };

  // Add character
  const pushChar = function (key) {
    const current = $("#current-char");
    current.html(key.toUpperCase());
    current.attr("id", "");
    current.next(".char-container").attr("id", "current-char");
    userWord += key.toUpperCase();
  };
  
  // Delete character
  const popChar = function (last) {
    let current = $("#current-char");
    if (last) {
      current = $("#current-row").children().last();
    } else {
      current.attr("id", "");
      current = current.prev();
    }
    current.html("");
    current.attr("id", "current-char");
    userWord = userWord.slice(0, userWord.length - 1);
  };

  // Enter key handler
  const checkWord = function (word) {
    if (word.length < 5) {
      return null;
    }

    // Send word and line number to server
    fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: word,
        line: line,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Show message
        if (result.msg) {
          msg.html(result.msg);
        }

        // Word is in the database 
        if (result.wordInDb) {
          showResult(result);
          line++;
          userWord = "";
          
          // Right word
          if (result.done) {
            msg.html("Win!");
          }

          // Last guess
          if (result.done || line === 7) {
            // Disable database guess buttons that have already been tried
            const dbGuessed = JSON.parse(result.dbGuessed);
            $(".btn").each(function () {
              if (!dbGuessed.includes(parseInt($(this).attr("id")))) {
                $(this).addClass("used");
              }
            });
            // Disable further user keyboard input
            $("#current-char").attr("id", "");

            // Toggle database guess view
            $("#endgame").slideToggle(3300);
          }
        }
      });
  };

  // Animate checked word
  const showResult = function (result) {
    // Get first character box in row
    const row = $("#current-row");
    let char = row.children().first();

    // Animate each character
    for (let i = 0; i <= 4; i++) {
      char.attr("style", `animation-delay: ${400 * i}ms`);
      char.addClass(`rotate-${result[i]}`);
      char = char.next();

      // Color virtual keyboard keys
      const key = userWord[i];
      if ($(`#${key}`).css("background-color") != "rgb(143, 214, 148)") {
        $(`#${key}`).css("background-color", `var(--${result[i]})`);
      }
    }
    // Set next row
    row.attr("id", "");
    row.next().attr("id", "current-row");
    $("#current-row > .char-container").first().attr("id", "current-char");
  };
});
