from flask import Flask, request, render_template, jsonify, redirect
from random import choice, randint

app = Flask(__name__)

class Word:
    def __init__(self, word):
        self.word = word
        self.counter = {}
    def reset(self):
        self.counter = {chr(i): self.word.count(chr(i)) for i in range(65, 91)}

class Db:
    def __init__(self):
        self.words = []
        self.lecture = randint(0, 9)
        with open(f"{self.lecture}.txt", "r") as f:
            for word in f:
                self.words.append(word[:5])

db = Db()

target = Word(choice(db.words))
 

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        target.word = choice(db.words)
        target.reset()
        return render_template("index.html", msg="")
    elif request.form:
        msg = "Right!" if int(request.form['num']) == db.lecture else "Wrong. Try again!"
        if msg == "Right!":
            db.__init__()
        return render_template("index.html", msg=msg) 
    else:
        user_word = request.json['word'].upper()
        if user_word not in db.words:
            return {"msg": "Word not in database"}
        res = check_word(user_word)
        word = ""
        if request.json['line'] == 6 and not res[5]:
            word = f'The word was {target.word.capitalize()}'
        return {"0": res[0], 
                "1": res[1], 
                "2": res[2], 
                "3": res[3], 
                "4": res[4], 
                "done": res[5],
                "word": word 
                }

def check_word(word):
    word = word
    target.reset()
    done = True
    res = [None for _ in range(6)]
    for i in range(5):
        if word[i] == target.word[i]:
            res[i] = "green"
            target.counter[word[i]] -= 1
        elif target.counter[word[i]]:
            res[i] = "yellow"
            target.counter[word[i]] -= 1
            done = False
        else:
            res[i] = "gray"
            done = False
    res[5] = done
    return res

@app.template_filter()
def qwerty(i):
    return "QWERTYUIOP⌫ASDFGHJKL⏎ZXCVBNM"[i]