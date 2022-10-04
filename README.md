# Twordle
##### A two-stage wordle-like concept game.
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)	![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

---

### Game Flow
*Twordle* is a two stage text guessing game.
As a game session begins, the app randomly picks a source text out of a few,  pre-defined files, and from that text the app randomly picks a word.

**Stage 1 - Guess the word**
The player gets six turns at guessing the word, each is checked and response is accordingly:
1. Word is not in source text: message is shown and turn is not done.
2. Word is wrong: animated annotation of characters hinting to the right word.
3. Word is right: all-green animation, toggle 2nd stage.
4. Word is wrong *and* 6th turn: target word is shown, toggle 2nd stage. 

**Stage 2 - Guess the database**
All source-text names are shown for the player to pick one.
a wrong choice leads back to stage 1 with a fresh word, and a right choice restarts the session. both require refreshing the page.

**Additional views**
1. A short introduction under "?" symbol.
2. A table of all words tried this session under "i" symbol.

### Screenshots

##### Stage 1 - Guess the word

<img src="https://github.com/urivinter/Twordle/blob/main/static/screenshot0.jpg" width="200"/>
<img src="https://github.com/urivinter/Twordle/blob/main/static/screenshot1.jpg" width="200"/>

##### Stage 2 - Guess the database

<img src="https://github.com/urivinter/Twordle/blob/main/static/screenshot2.jpg" width="200"/>
<img src="https://github.com/urivinter/Twordle/blob/main/static/screenshot3.jpg" width="200"/>

### How to install
1. Fork this repo. ([learn how](https://docs.github.com/en/get-started/quickstart/fork-a-repo))
2. Get a virtual environment going. ```python3 -m venv venv```
3. Activate venv. ```source venv/bin/activate```
4. Get dependencies. ```pip install -r requirements```
5. Run app. ```flask run```
 
### Make it your own
This app is designed to be customizable.

**Change source text files:**
1. Delete all ```.txt``` files from ```static``` directory
2. Put your own files. (up to 10, seriallicly named, comma/space/new line seperated)
3. On ```app.py```, change ```DATABASE_NAMES``` global list to fit your new files. 

**Customize return messages:**
On ```app.py```, add / remove message strings from ```MESSAGES``` global dictionary. mind that dictionary keys represent the number of turns played.

**Modify animation speed:**
On ```static/javascript.js```, change the value of ```FLIPTIME``` global constant to the desired time (in ms) for a single character flip.

**Set new color theme:**
On ```static/styles.css```, set new values for any variable of the ```body``` tag, except ```--flip-time``` which is overriden by ```javascript.js```.

### Future development

**Hard mode:**
Stage 2 is only toggled by the player. only one try is allowed.
wrong pick results in new session.
The idea is to use long, well known texts for sources, and have the player get a good sense of the source text before going to stage 2.
This will require a way to store session state. probably cookies.

**Message delay:**
Make messages show after animation ends.
