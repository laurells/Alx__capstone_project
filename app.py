from flask import Flask, render_template, request, redirect, flash, session, jsonify
from functools import wraps
from datetime import datetime
import psycopg2
import os

secret_key = os.urandom(24)
app = Flask(__name__)
app.secret_key = secret_key  # replace abcd with your secret key 

conn = psycopg2.connect(
    
    # Replace abcd with your respective database values...

    host="http://localhost:5050",
    database="budget",
    user="postgres",
    password="L@urels81156537."
)

mail = ''

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function


@app.route('/', methods=['GET', 'POST'])
def login():
    global mail
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE (username = %s AND password = %s) or (email = %s AND password = %s)",
            (username, password, username, password)
        )
        user = cursor.fetchone()
        cursor.close()

        if user: 
            mail = str(user[2])
            session['username'] = username
            return redirect('/dashboard')
        else:
            flash('Invalid username or password!', 'credentialError')
            return render_template('login.html', error_message='Invalid username or password')

    response = app.make_response(render_template('login.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/logout')
def logout():
    session.clear()
    response = app.make_response(redirect('/'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']

        if password == confirm_password:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM users WHERE email = %s",
                (email,)
            )
            existing_user = cursor.fetchone()

            if existing_user:
                flash('Email already exists!', 'mailError')
                return render_template('signup.html', error_message='Email already exists')
            else:
                cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                           (username, email, password))
                conn.commit()
                cursor.close()
                print("success")
                flash('Resgistration Successful!', 'success')

                return render_template('login.html', error_message='success')

        else:
            flash('Passwords do not match!', 'passwordError')
            return render_template('signup.html', error_message='Passwords do not match')

    response = app.make_response(render_template('signup.html'))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/dashboard')
@login_required
def dashboard():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions where email = %s ORDER BY date", (mail,))
    transactions = cursor.fetchall()
    cursor.close()
    return render_template('index.html', transactions=transactions)

@app.after_request
def add_cache_control_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

if __name__ == '__main__':
    app.run(debug=True)