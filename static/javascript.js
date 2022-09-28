window.addEventListener("DOMContentLoaded", () => {
    $(".word-container").first().attr("id", "current-row")
    $(".char-container").first().attr("id", "current-char")
    let userWord = ""

    $(window).keyup((event) => {
        if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            const div = $("#current-row").find("#current-char");
            div.html(event.key.toUpperCase());
            div.attr("id", "");
            div.next(".char-container").attr("id", "current-char");
            userWord += event.key.toUpperCase();
        } else if (event.key === "Enter") {
            checkWord(userWord);
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
            showResult(result)
            userWord = ''
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
