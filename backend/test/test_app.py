import pytest
from ..app import app  # Relative import from backend/app.py

@pytest.fixture
def client():
    """
    Pytest fixture to create a test client for the Flask app.
    Sets the app in testing mode and yields the client for use in tests.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_questions(client):
    """
    Test the /questions endpoint.
    Ensures the response is a list of questions with required fields.
    """
    response = client.get('/questions')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert 'question' in data[0]
    assert 'options' in data[0]

def test_validate_correct_answer(client):
    """
    Test the /validate endpoint with a correct answer.
    Expects the response to indicate the answer is correct.
    """
    response = client.post('/validate', json={
        'question_id': 0,
        'answer': '8'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['correct'] is True

def test_validate_incorrect_answer(client):
    """
    Test the /validate endpoint with an incorrect answer.
    Expects the response to indicate the answer is incorrect.
    """
    response = client.post('/validate', json={
        'question_id': 0,
        'answer': '6'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['correct'] is False

def test_validate_invalid_question(client):
    """
    Test the /validate endpoint with an invalid question ID.
    Expects a 400 Bad Request response.
    """
    response = client.post('/validate', json={
        'question_id': 999,
        'answer': 'Anything'
    })
    assert response.status_code == 400
