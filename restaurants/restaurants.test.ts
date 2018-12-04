import "jest";
import * as request from "supertest";

const address = (global as any).address;

test("get /restaurants", async () => {
	return request(address)
		.get("/restaurants")
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body.items).toBeInstanceOf(Array);
		})
		.catch(fail);
});

test("post /restaurants", async () => {
	return request(address)
		.post("/restaurants")
		.send({
			name: "Teste restaurante"
		})
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe("Teste restaurante");
			expect(response.body.menu).toBeInstanceOf(Array);
		})
		.catch(fail);
});

test("post /restaurants - name validation error", async () => {
	return request(address)
		.post("/restaurants")
		.send({
			name: ""
		})
		.then((response) => {
			expect(response.status).toBe(400);
		})
		.catch(fail);
});

test("post /restaurants - menu validation error", async () => {
	return request(address)
		.post("/restaurants")
		.send({
			name: "",
			menu: [
				{ name: "", price: -500 }
			]
		})
		.then((response) => {
			expect(response.status).toBe(400);
		})
		.catch(fail);
});

test("get /restaurants/aaaaa - not found", async () => {
	return request(address)
		.get("/restaurants/aaaaa")
		.then((response) => {
			expect(response.status).toBe(404);
		})
		.catch(fail);
});

test("patch /restaurants/:id", async () => {
	return request(address)
		.post("/restaurants")
		.send({
			name: "Teste Restaurante - Patch"
		})
		.then((response) =>
			request(address)
				.patch(`/restaurants/${response.body._id}`)
				.send({
					name: "Teste Restaurante - Patch - Retorno"
				})
		)
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body._id).toBeDefined();
			expect(response.body.name).toBe("Teste Restaurante - Patch - Retorno");
		})
		.catch(fail);
});

test("put /restaurants/:id/menu", async () => {
	return request(address)
		.post("/restaurants")
		.send({
			name: "Teste Restaurante - Put"
		})
		.then((response) =>
			request(address)
				.put(`/restaurants/${response.body._id}/menu`)
				.send([{ name: "Biscoito de baunilha", price: 500 }])
		)
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body[0]._id).toBeDefined();
			expect(response.body).toBeInstanceOf(Array);
		})
		.catch(fail);
});
