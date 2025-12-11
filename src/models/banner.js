export default function BannerModel(sequelize, DataTypes) {
    return sequelize.define(
        "Banner",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "Tiêu đề banner",
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: "Đường dẫn hình ảnh",
            },
            link: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: "Link khi click vào banner",
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "Mô tả ngắn",
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "Thứ tự hiển thị (số nhỏ hiển thị trước)",
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: "Trạng thái hiển thị",
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "Ngày bắt đầu hiển thị",
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "Ngày kết thúc hiển thị",
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "main",
                comment: "Loại banner: main (chính), side (bên), popup, etc.",
            },
        },
        {
            tableName: "banners",
            timestamps: true,
        }
    );
}

