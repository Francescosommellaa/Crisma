import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
class Brand extends Model {
}
Brand.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
});
export default Brand;
