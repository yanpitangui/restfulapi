import "jest";
import * as request from "supertest";

const address = (global as any).address;

test("get /reviews", async () => {
	return request(address)
		.get("/reviews")
		.then((response) => {
			expect(response.status).toBe(200);
			expect(response.body.items).toBeInstanceOf(Array);
		}).catch(fail);
});

test("get /reviews/aaaaa - not found", async () => {
	return request(address)
		.get("/reviews/aaaaa")
		.then((response) => {
			expect(response.status).toBe(404);
		}).catch(fail);
});
