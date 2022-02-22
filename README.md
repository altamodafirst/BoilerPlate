I used dotenv package to have a place to store my secret code for authentication. 

1. npm install dotenv
2. create a .env file in the root directory and make sure to add .env to your .gitignore file (otherwise it's not private!!)
3. In the files you need to access what's in your .env file, use require('dotenv').config()
    - this example, the following is in my .env file:
        SECRET_SIGNING_PHRASE = 'handsomebob'
4. Use process.env to access what's in the file
    - In this example, I used const secretSigningPhrase = process.env.SECRET_SIGNING_PHRASE

