const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define(
    "genres",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
