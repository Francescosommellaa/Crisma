import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class File extends Model {
  public id!: number;
  public brandAbbreviazione!: string;
  public stagione!: 'SS' | 'FW';
  public anno!: string;
  public nome!: string;
  public createdAt!: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brandAbbreviazione: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stagione: {
      type: DataTypes.ENUM('SS', 'FW'),
      allowNull: false,
    },
    anno: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        is: /^\d{1,2}$/, // massimo 2 cifre
      },
    },
    nome: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: false, // createdAt gestito manualmente
  }
);

export default File;
