from flask import Flask, request, render_template, jsonify
from random import choice

app = Flask(__name__)

class Word:
    def __init__(self, word):
        self.word = word
        self.counter = {chr(i): self.word.count(chr(i)) for i in range(97, 123)}
    def reset(self):
        self.counter = {chr(i): self.word.count(chr(i)) for i in range(97, 123)}


words = []
with open("4.txt", "r") as f:
    for word in f:
        words.append(word[:5])

target = Word(choice(words).lower())
print(target.word)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    else:
        user_word = request.json['word']
        if user_word not in words:
            return {"msg": "Word not in database"}
        res = check_word(user_word)
        return {"0": res[0], 
                "1": res[1], 
                "2": res[2], 
                "3": res[3], 
                "4": res[4], 
                "done": res[5],
                }

def check_word(word):
    word = word.lower()
    target.reset()
    res = [None for _ in range(7)]
    for i in range(5):
        if word[i] == target.word[i]:
            res[i] = "green"
            target.counter[word[i]] -= 1
        elif target.counter[word[i]]:
            res[i] = "yellow"
            target.counter[word[i]] -= 1
        else:
            res[i] = "gray"
    res[5] = "yellow" not in res[:4] and "gray" not in res[:4]
    res[6] = True

    return res

@app.template_filter()
def qwerty(i):
    return "qwertyuiop⌫asdfghjkl⏎zxcvbnm"[i]