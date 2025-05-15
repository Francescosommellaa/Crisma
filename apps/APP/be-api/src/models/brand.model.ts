import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Brand extends Model {
  public id!: number;
  public nome!: string;
  public abbreviazione!: string;
  public dataCreazione!: Date;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviazione: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dataCreazione: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
  }
);

export default Brand;
