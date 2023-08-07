# web.py

from flask import Flask, render_template, request, redirect, session
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect

web = Flask(__name__)
web.config['SECRET_KEY'] = 'your-secret-key'  # Replace with your secret key
csrf = CSRFProtect(web)
bcrypt = Bcrypt(web)

# Mock database to store user information
users = []

@web.route('/')
def index():
    return render_template('index.html')

@web.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the username is already taken
        if any(user['username'] == username for user in users):
            return "Username already exists. Please choose a different username."

        # Hash the password and create a new user
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = {'username': username, 'password': hashed_password}
        users.append(user)

        # Set user session and redirect to a success page or perform any other necessary actions
        session['username'] = username
        return redirect('/success')

    return render_template('signin.html')

@web.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the user exists
        user = next((user for user in users if user['username'] == username), None)
        if user is None:
            return "Invalid username or password."

        # Verify the password
        if not bcrypt.check_password_hash(user['password'], password):
            return "Invalid username or password."

        # Set user session and redirect to a success page or perform any other necessary actions
        session['username'] = username
        return redirect('/index.html')

    return render_template('signin.html')

@web.route('/success')
def success():
    # Access the username from the session
    username = session.get('username')
    if username is None:
        return redirect('/signin')

    return f"Welcome, {username}!"

if __name__ == '__main__':
    web.run()


