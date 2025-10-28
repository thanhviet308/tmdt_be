export default function OrderModel(sequelize, DataTypes) {
    return sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "pending",
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            shippingAddress: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            recipientPhone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            recipientName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "orders",
            timestamps: true,
        }
    );
}