import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Capo extends Model {
  public id!: number;

  // Obbligatori
  public categoria!: string;
  public base!: string;
  public descrizione!: string;
  public tm!: string;
  public prezzo!: number;
  public taglia!: string;

  // Facoltativi
  public tm2?: string;
  public fornitoreTex?: string;
  public fornitore?: string;
  public prezzo2?: number;
  public codiceColoreCampione?: string;
  public varianti?: string;
  public pacchetto?: string;

  // Generati
  public brand!: string;
  public abbreviazione!: string;
  public gestionale!: string;
  public marka!: string;

  // Relazioni
  public fileId!: number;

  public createdAt!: Date;
}

Capo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // Obbligatori
    categoria: { type: DataTypes.STRING(3), allowNull: false },
    base: { type: DataTypes.STRING, allowNull: false },
    descrizione: { type: DataTypes.STRING, allowNull: false },
    tm: { type: DataTypes.STRING, allowNull: false },
    prezzo: { type: DataTypes.FLOAT, allowNull: false },
    taglia: { type: DataTypes.STRING, allowNull: false },

    // Facoltativi
    tm2: { type: DataTypes.STRING, allowNull: true },
    fornitoreTex: { type: DataTypes.STRING, allowNull: true },
    fornitore: { type: DataTypes.STRING, allowNull: true },
    prezzo2: { type: DataTypes.FLOAT, allowNull: true },
    codiceColoreCampione: { type: DataTypes.STRING, allowNull: true },
    varianti: { type: DataTypes.STRING, allowNull: true },
    pacchetto: { type: DataTypes.STRING, allowNull: true },

    // Generati
    brand: { type: DataTypes.STRING, allowNull: false },
    abbreviazione: { type: DataTypes.STRING, allowNull: false },
    gestionale: { type: DataTypes.STRING, unique: true },
    marka: { type: DataTypes.STRING, unique: true },

    fileId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'Capo',
    tableName: 'capi',
    timestamps: false
  }
);

export default Capo;
