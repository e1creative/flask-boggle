from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    # def setUp(self):
    #     """Stuff to do before every test"""
    #     self.client = app.test_client()
    #     app.config['TESTING'] = True


    def test_home(self):
        """should return our home page html"""
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn( "<h1>Let's Play Boggle</h1>", html)


    # def test_eval_guess(self):
    #     """should return a json object"""
    #     with app.test_client() as client:
    #         res = client.post("/eval-guess")

    #         self.assert(eval_guess(word), returns json)


    # def test_update_stats(self):
    #     """should return an ok response"""
    #     with app.test_client() as client:
    #         res = client.post("/update-stats")

    #         self.assert(update_stats(), "User data updated!")