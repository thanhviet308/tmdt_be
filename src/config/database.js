import { Sequelize } from "sequelize";
import "dotenv/config";

// Cho phép cấu hình qua DATABASE_URL hoặc các biến PG*
function buildConnectionString() {
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
        return process.env.DATABASE_URL;
    }

    const user = process.env.PGUSER;
    const password = process.env.PGPASSWORD;
    const host = process.env.PGHOST || "localhost";
    const port = process.env.PGPORT || "5432";
    const database = process.env.PGDATABASE;

    if (user && password && database) {
        return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
    }

    return undefined;
}

const connectionString = buildConnectionString();

export const sequelize = new Sequelize(connectionString || "", {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        // Nếu deploy Render/Heroku có SSL thì bật
        ssl: process.env.PGSSL === "true" ? { require: true, rejectUnauthorized: false } : false,
    },
});

export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected via connection string");

        await sequelize.sync();

        console.log("Synced models with database");
    } catch (err) {
        console.error("DB connect failed:", err.message || err);
        throw err;
    }
}
