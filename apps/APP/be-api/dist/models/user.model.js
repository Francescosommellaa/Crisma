import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
class User extends Model {
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});
export default User;
