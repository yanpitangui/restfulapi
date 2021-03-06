import { restaurantRouter } from "./restaurants/restaurants.router";
import { reviewsRouter } from "./reviews/reviews.router";
import { Server } from "./server/server";
import { serverRouter } from "./server/server.router";
import { usersRouter } from "./users/users.router";

const server = new Server();
server.bootstrap([serverRouter, usersRouter, restaurantRouter, reviewsRouter]).then((serverReturned) => {
	console.log(`Server is listening on localhost:${serverReturned.application.address().port}`);
}).catch((error) => {
	console.log("Server failed to start.");
	console.error(error);
	process.exit(1);
});
