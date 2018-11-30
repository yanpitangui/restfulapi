import "jest";
import * as mongoose from "mongoose";
import * as request from "supertest";
import {enviroment} from "../common/enviroment";
import {Server} from "../server/server";
import {User} from "../users/user.model";
import {usersRouter} from "../users/users.router";

let address: string;
let server: Server;
beforeAll(async () => {
	enviroment.db.url = process.env.DB_URL || "mongodb://localhost/meat-api-test-db";
	enviroment.server.port = process.env.SERVER_PORT || 3001;
	address = `http://localhost:${enviroment.server.port}`;
	server = new Server();
	return server
		.bootstrap([usersRouter])
		.then(() => User.remove({}).exec())
		.catch(console.error);
});

test("get /users", async () => {
	return request(`${address}`)
		.get("/users")
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body.items).toBeInstanceOf(Array);
		}).catch(fail);
});

test("post /users", async () => {
	return request(`${address}`)
		.post("/users")
		.send({
			name: "usuario1",
			email: "usuario1@email.com",
			password: "teste123",
			cpf: "347.678.193-34"
		})
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe("usuario1");
			expect(response.body.email).toBe("usuario1@email.com");
			expect(response.body.cpf).toBe("347.678.193-34");
			expect(response.body.password).toBeUndefined();
		}).catch(fail);
});

afterAll(async () => {
	return server.shutdown();
});
