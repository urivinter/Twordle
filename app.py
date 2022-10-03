""" This app is a two-level Wordle game.
    Every round the user tries to guess the word.
    at the end of each round, the user can guess the database from which the words are generated.
    Upon a successful database guess, the game continues with another random database. """

from flask import Flask, request, render_template
from random import choice
import json

app = Flask(__name__)

# Global variables

# Use up to 10 for best appearence
DATABASE_NAMES = [
    (0, "Week 0 Scratch"), 
    (1, "Week 1 C"), 
    (2, "Week 2 Arrays"), 
    (3, "Week 3 Algorithms"), 
    (4, "Week 4 Memory"), 
    (5, "Week 5 Data Structures"), 
    (6, "Week 6 Python"), 
    (7, "Week 7 SQL"), 
    (8, "Week 8 HTML, CSS, JavaScript"), 
    (9, "Week 9 Flask")
]

MESSAGES = {
    1: ["WOW!",     "AWSOME!",      "(Ͼ˳Ͽ)..!!!" ], 
    2: ["Superb",   "Genius",       "( •_•)>⌐■-■ (⌐■_■)" ], 
    3: ["Good",     "Nice",         "\m/_(>_<)_\m/" ], 
    4: ["Cool",     "Classy",       "(‾⌣‾)" ], 
    5: ["Got it!",  "Good job",     "٩( ᐛ )و" ],
    6: ["Phew",     "By a thread",  "¯\_(ツ)_/¯" ]
}

class Db:
    """
    An object to contain the current database, guess states and more 
    """
    def __init__(self):
        self.words = []                                   # All words in the database
        self.known_words_in = set()                       # Words known to be in the database (guessed by user this session)
        self.known_words_out = set()                      # Words known to not be in the database (guessed by user this session)
        self.db_guessed = {i for i, _ in DATABASE_NAMES}  # Database file numbers not yet guessed
        self.database_number = choice(DATABASE_NAMES)[0]  # Random database file number
        self.word = ""                                    # The word for the user to guess
        self.counter = {}                                 # Character dictionary. helper for check_word

        # Get all words from file
        with open(f"{self.database_number}.txt", "r") as f:
            for word in f:
                self.words.append(word[:5])

        self.reset_word()

    def reset_word(self):
        self.word = choice(self.words)
        self.reset_counter()

    def reset_counter(self):
        """ Set dictionary: keys are a-z, values are each character's appearance count in target word """
        self.counter = {chr(i): self.word.count(chr(i)) for i in range(65, 91)}
    
    def remember(self, word):
        """ Keep words guessed by user in memory. return True if word is in database """
        if word in self.words:
            self.known_words_in.add(word)
            return True
        else:
            self.known_words_out.add(word)
            return False

# Create databade object
db = Db()


@app.route("/api", methods=["POST"])
def api():
    # Handle database guess
    if (num := request.json.get('num')):
        database_guess = int(num)

        if database_guess == db.database_number:
            msg = f"Yay! {len(db.known_words_in) + len(db.known_words_out)} word total"
            db.__init__()

        else:
            msg = "Nah. Try again!"
            db.db_guessed.discard(database_guess)
            db.reset_word

        return {"msg": msg}
    
    # Handle recall request
    elif request.json.get('recall'):
        return {"inDb": json.dumps(list(db.known_words_in)), "notInDb": json.dumps(list(db.known_words_out))}


@app.route("/", methods=["GET", "POST"])
def index():

    # Main view
    if request.method == "GET":
        db.reset_word()
        return render_template("index.html", msg='', names=DATABASE_NAMES)

    # Handle word guess
    else:
        word_guess = request.json['word'].upper()

        # Guessed word not in database 
        if not (word_in_db := db.remember(word_guess)):
            return {"msg": "Word not in database"}

        # Compare to target word
        colors, done = check_word(word_guess)

        msg = ""
        # Sixth guess wrong
        if request.json['line'] == 6 and not done:
            msg = f'The word was {db.word.capitalize()}'

        # Guessed right
        elif done:
            msg = choice(MESSAGES[request.json['line']])
            db.reset_word()

        return {"0": colors[0], 
                "1": colors[1], 
                "2": colors[2], 
                "3": colors[3], 
                "4": colors[4], 
                "done": done,
                "msg": msg, 
                "wordInDb": word_in_db, 
                "dbGuessed": json.dumps(list(db.db_guessed)),
                }


def check_word(word):
    """ Calculate response colors """

    db.reset_counter()
    done = True
    colors = [None for _ in range(5)]
    
    # Greens first
    for i in range(5):
        if word[i] == db.word[i]:
            colors[i] = "green"
            db.counter[word[i]] -= 1
    
    # Yellows and grays
    for i in range(5):
        if colors[i]:
            continue

        if db.counter[word[i]]:
            colors[i] = "yellow"
            db.counter[word[i]] -= 1
            done = False

        else:
            colors[i] = "gray"
            done = False

    return colors, done
