const userModel = include('models/web_user');
const { Sequelize, DataTypes } = require('sequelize');
const databaseConnectionString = require('../databaseConnectionSequelize');
const sequelize = new Sequelize(databaseConnectionString);
const petModel = sequelize.define('pet',
    {
        pet_id: {
            type: Sequelize.INTEGER, autoIncrement: true,
            primaryKey: true
        },
        web_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'web_user',
                key: 'web_user_id'
            }
        },
        name: { type: Sequelize.STRING, allowNull: false },
        pet_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'pet_type',
                key: 'pet_type_id'
            }
        },
    },
    {
        tableName: 'pet',
        timestamps: false,
        singular: 'pet',
        plural: 'pet'
    }
);


petModel.belongsTo(userModel, {
    as: 'owner', timestamps: false, foreignKey:
        'web_user_id'
});
userModel.hasMany(petModel, {
    as: 'pets', timestamps: false, foreignKey:
        'web_user_id'
});
module.exports = petModel;