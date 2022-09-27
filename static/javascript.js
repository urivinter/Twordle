window.addEventListener("DOMContentLoaded", () => {
    let i = 0
    const targetWord = "CRANE"
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
        const result = submit(word);
        const row = $("#current-row");
        if (result) {
            console.log(result)
            
        }  
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
        console.log(result);
        const row = $("#current-row");
        let char = row.children("div").first();
        for (let i = 0; i <= 5; i++) {
            char.attr("style", `animation-delay: ${500 * i}ms`)
            char.addClass(`rotate-${result[i]}`);
            char = char.next("div");
        }
        row.attr("id", "");
        row.next("div").attr("id", "current-row");
        $("#current-row > div").first().attr("id", "current-char");
    }
})
