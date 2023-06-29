const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            document: DataTypes.STRING,
            document_type: DataTypes.STRING,
            username: DataTypes.STRING,
            enc_pass: DataTypes.STRING,
            last_login: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        }, {
            sequelize,
            underscored: true,
            tableName: 'users'
        });
    }
}

module.exports = User;