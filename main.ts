import {Server} from "./server/server";
import {usersRouter} from "./users/users.router";
import { serverRouter } from "./server/server.router";

const server = new Server();
server.bootstrap([serverRouter, usersRouter]).then(server=>{
    console.log(`Server is listening on localhost:${server.application.address().port}`)
}).catch(error=>{
    console.log("Server failed to start.");
    console.error(error);
    process.exit(1);
})