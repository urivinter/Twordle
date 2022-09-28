window.addEventListener("DOMContentLoaded", () => {
    $(".word-container").first().attr("id", "current-row")
    $(".char-container").first().attr("id", "current-char")
    let userWord = "";
    const msg = $(".message-container");

    $(window).keyup((event) => {
        msg.html("")
        let div = $("#current-row").find("#current-char");
        if (event.key.length === 1 && event.key.match(/[a-z]/i) && userWord.length < 5) {
            div.html(event.key.toUpperCase());
            div.attr("id", "");
            div.next(".char-container").attr("id", "current-char");
            userWord += event.key.toUpperCase();
        } else if (event.key === "Enter") {
            checkWord(userWord);
        } else if (event.key === "Backspace") {
            if ($("#current-char").length === 0) {
                div = $("#current-row").children().last();
                div.html("");
                div.attr("id", "current-char")
                userWord = userWord.slice(0, userWord.length - 1);
            } else if (div.prev().length !== 0) {
                div.attr("id", "");
                div = div.prev();
                div.html("");
                div.attr("id", "current-char")
                userWord = userWord.slice(0, userWord.length - 1);
            }
        }
    })

    const checkWord = function(word) {
        if (word.length < 5) {
            return null
        }
        submit(word);
    }

    const submit = function(word) {
        fetch('', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            body: JSON.stringify({
              "word": word,
            })
        })
        .then ((response) => response.json())
        .then ((result) => {
            if (result.msg) {
                msg.html(result.msg);
            } else {
                showResult(result)
                userWord = ''
            }
        })
    }

    const showResult = function(result) {
        const row = $("#current-row");
        let char = row.children("div").first();
        for (let i = 0; i <= 4; i++) {
            char.attr("style", `animation-delay: ${500 * i}ms`)
            char.addClass(`rotate-${result[i]}`);
            char = char.next("div");
            const key = userWord[i].toLowerCase()
            $(`#${key}`).attr('style', `background-color: var(--${result[i]})`)

        }
        row.attr("id", "");
        row.next("div").attr("id", "current-row");
        $("#current-row > div").first().attr("id", "current-char");
    }
})
