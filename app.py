from flask import Flask, request, render_template, jsonify, session, redirect
from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

app = Flask(__name__)

app.config['SECRET_KEY'] = "testingflask"
debug = DebugToolbarExtension(app)


boggle_game = Boggle()

@app.route("/")
def home():
    """Layout our board and load the main page."""

    session['boggle_board'] = boggle_game.make_board()

    if not session['user_scores']:
         session['user_scores'] = []
   
    if not session['game_count']:
        session['game_count'] = 0

    board_size = len(session['boggle_board'])

    return render_template("home.html", board=session['boggle_board'], board_size=board_size)


@app.route("/eval-guess", methods=["POST"])
def eval_guess():
    """Evaluate our user guess and return message in json."""
    user_guess = request.args.get('user_guess')
    
    check_word_result = boggle_game.check_valid_word(session['boggle_board'], user_guess)

    return jsonify({ "result": check_word_result })


@app.route("/update-stats", methods=["POST"])
def update_stats():
    """Update our users cookie with stats."""
    current_game_total_score = request.args.get("score")

    user_scores = session['user_scores']
    user_scores.append(current_game_total_score)
    session['user_scores'] = user_scores

    session['game_count'] += 1

    return "User data updated!"
  