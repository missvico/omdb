const S = require("sequelize")
const {Model} = require("sequelize")
const {validatePassword} = require("../utils/functionsUser")
const sequelize = require("../db")
const crypto = require("crypto")

class User extends Model {}
User.init({
  email: {
    type: S.STRING,
    allowNull: false,
    unique: true,
    validate: {
        isEmail: true
    }
  },
  username: {
    type: S.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        args: true,
        msg: "Username required"
      },
      max: {
          args: [20],
          msg: "The username must have less than 8 characters"
      }
    }
  },
  password: {
    type: S.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Password required"
      },
      min: {
        args: [8],
        msg: "The password must be a least 8 characters long"
      },
    }
  },
  firstName: {
    type: S.STRING,
    allowNull: false,
    validate: {
      isAlpha: {
        args: true,
        msg: "The First Name should only contain letters"
      }
    }
  },
  lastName: {
    type: S.STRING,
    allowNull: false,
    validate: {
      isAlpha: {
        args: true,
        msg: "The Last Name should only contain letters"
      }
    }
  },
  salt: {
    type: S.STRING
  }
}, {
  sequelize,
  modelName: 'user'
});

User.beforeCreate(function(user){
  if(!(validatePassword(user.password))) throw new Error("The password must contain at least an upper case letter, a lower case letter and a number")
})

User.belongsToMany(User, {
  through: "Following",
  as: 'follower',
  foreignKey: 'following_id',
});

User.belongsToMany(User, {
  through: "Following",
  as: 'following',
  foreignKey: 'follower_id',
});


User.addHook('beforeCreate', (user) => {
  user.salt = crypto.randomBytes(20).toString('hex');
  user.password = user.hashPassword(user.password);
})

User.prototype.hashPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

User.prototype.validPassword = function (password) {
  return this.password === this.hashPassword(password);
}



module.exports = User