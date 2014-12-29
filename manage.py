from app import app

if __name__ == "__main__":
    app.run(debug=True)

app.config['SECRET_KEY'] = '123456790'
# app.config['MONGODB_SETTINGS'] = {'DB': 'testing'}