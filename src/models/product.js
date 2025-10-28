export default function ProductModel(sequelize, DataTypes) {
    return sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            cost: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            profitPercent: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            weight: {
                type: DataTypes.DECIMAL(8, 3),
                allowNull: true,
            },
        },
        {
            tableName: "products",
            timestamps: true,
        }
    );
}