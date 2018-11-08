import * as restify from "restify";
import { Router } from "../common/router";
import { User } from "./user.model";

class UsersRouter extends Router {
	public applyRoutes(application: restify.Server) {
		application.get("/users", (req, resp, next) => {
			User.find().then((users) => {
				resp.json(users);
				next();
			});
		});

		application.get("/users/:id", (req, resp, next) => {
			User.findById(req.params.id)
				.then((user) => {
					if (user) {
						resp.json(user);
						return next();
					}
				})
				.catch((err) => {
					resp.send(404);
					return next();
				});
		});

		application.post("/users", (req, resp, next) => {
			const user = new User(req.body);
			user.save().then((userReturn) => {
				userReturn.password = undefined;
				resp.json(userReturn);
			});
		});

		application.put("/users/:id", (req, resp, next) => {
			const options = { overwrite: true };
			User.update({ _id: req.params.id }, req.body, options)
				.exec()
				.then((result) => {
					if (result.n) {
						return User.findById(req.params.id);
					} else {
						resp.send(404);
					}
				}).then((user) => {
					resp.json(user);
					next();
				});
		});
	}
}

export const usersRouter = new UsersRouter();
