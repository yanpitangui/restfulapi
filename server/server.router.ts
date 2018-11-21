import * as restify from "restify";
import { Router } from "../common/router";

class ServerRouter extends Router {
	public applyRoutes(application: restify.Server) {
		application.get("/", (req, resp, next) => {
			resp.json({
				routes:
				{
					get: {
						"/users": {
							"/users": `Returns all users registered.`,
							"/users/:id": `Return the user associated with the id parameter.`
						}
					}
				}
			});
		});
	}
}

export const serverRouter = new ServerRouter();
