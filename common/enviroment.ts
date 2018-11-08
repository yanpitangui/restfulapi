export const enviroment = {
	db: { url: process.env.DB_URL || "mongodb://localhost/meat-api" },
	server: { port: process.env.SERVER_PORT || 3000 }
};
