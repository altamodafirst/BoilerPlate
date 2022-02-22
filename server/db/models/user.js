require('dotenv').config();
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../db');
const secretSigningPhrase = process.env.SECRET_SIGNING_PHRASE

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,

  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}
)


// instance methods
User.prototype.correctPassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.user.password)
};

User.prototype.generateToken= function () {
  return jwt.sign({ userId: this.user.id }, secretSigningPhrase);
};

// class methods
User.authenticate = function ({username, password}) {
  const user = User.findOne({where: username})
  if (!user) {
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const correctOrNot = user.correctPassword(password);
  
  if(correctOrNot) {
    const token = user.generateToken();
    return token
  }

  const error = Error('bad credentials');
  error.status = 401;
  throw error;

};

User.findByToken = function (token) {
  // verify the id on the token and find the corresponding user, otherwise throw an error
  try {
    const unscrambledToken = jwt.verify(token, secretSigningPhrase);
    //token = {userId: this.user.id}
    const user = User.findByPk(unscrambledToken.userId);
    if(user) {
      return user
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
    
  } catch (error) {
    next(error)
  }
};


// hooks 
function hashPassword (password) {
  return bcrypt.hashSync(password, 10)
}

User.beforeSave(async (user) => {
  const hashedPassword = hashPassword(user.password);
  user.password = hashedPassword
}

)

module.exports = User;