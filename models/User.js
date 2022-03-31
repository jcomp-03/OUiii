// import Model class and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
/*     checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    } */
}

// Initialize User model's data and configuration with .init
User.init(
    {
        // define an id column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // define a firstname column
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define a lastname column
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // define an age column
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        // define an address column
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [4]
            }
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }
    },
    {
        //  hooks: {
        //     async beforeCreate(newUserData) {
        //     newUserData.password = await bcrypt.hash(newUserData.password, 10);
        //     return newUserData;
        //     },
        // },
        // pass in imported sequelize connection
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;