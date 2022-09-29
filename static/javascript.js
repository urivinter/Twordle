window.addEventListener("DOMContentLoaded", () => {
    $(".word-container").first().attr("id", "current-row")
    $(".char-container").first().attr("id", "current-char")
    let userWord = "";
    let line = 1
    const msg = $(".message-container");
    $(".popup").toggle()

    $(".btn").click(function() {
        const num = $(this).attr("id")
        fetch('/api', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            body: JSON.stringify({
              "num": num,
            })
        })
        .then ((response) => response.json())
        .then ((result) => {
            msg.html(result.msg);
            $("#endgame").toggle();
        })
    
    })

    $(window).keyup((event) => {
        msg.html("")
        const key = event.key
         
          
        if (key.length === 1 && key.match(/[a-z]/i) && userWord.length < 5) {
            pushChar(key)

        } else if (key === "Enter") {
            checkWord(userWord);

        } else if (key === "Backspace") {

            if ($("#current-char").length === 0) {  
                popChar(true);

            } else if ($("#current-char").prev().length !== 0) {
                popChar(false);
            }
        }
    })

    const pushChar = function(key) {
        const current = $("#current-char");
        current.html(key.toUpperCase());
        current.attr("id", "");
        current.next(".char-container").attr("id", "current-char");
        userWord += key.toUpperCase();
    }

    const popChar = function(last) {
        let current = $("#current-char");
        if (last) {
            current = $("#current-row").children().last(); 
        } else {
            current.attr("id", "");
            current = current.prev();
        }
        current.html("");
        current.attr("id", "current-char")
        userWord = userWord.slice(0, userWord.length - 1);
    }

    const checkWord = function(word) {
        if (word.length < 5) {
            return null
        }
        fetch('', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            body: JSON.stringify({
              "word": word,
              "line": line,
            })
        })
        .then ((response) => response.json())
        .then ((result) => {
            if (result.msg) {
                msg.html(result.msg);
            } 
            if (result.wordInDb) {
                if (!result.done) {
                    showResult(result)
                    line ++;
                    userWord = ''
                } else {
                    msg.html("Win!");
                    $("#current-char").attr("id", "");
                    $("#endgame").slideToggle(3300)
                }
            }
        })
    }

    const showResult = function(result) {
        const row = $("#current-row");
        let char = row.children().first();
        for (let i = 0; i <= 4; i++) {
            char.attr("style", `animation-delay: ${500 * i}ms`)
            char.addClass(`rotate-${result[i]}`);
            char = char.next();
            const key = userWord[i]
            if ($(`#${key}`).css('background-color') != "rgb(143, 214, 148)") {
                $(`#${key}`).css('background-color', `var(--${result[i]})`)
            }

        }
        row.attr("id", "");
        row.next().attr("id", "current-row");
        $("#current-row > .char-container").first().attr("id", "current-char");
    }
})
