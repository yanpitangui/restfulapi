import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { Router } from "../common/router";
import { User } from "./user.model";

class UsersRouter extends Router {

	constructor() {
		super();
		this.on("beforeRender", (document) => {
			document.password = undefined;
		});
	}

	public applyRoutes(application: restify.Server) {
		application.get("/users", (req, resp, next) => {
			User.find().then(this.render(resp, next)).catch(next);
		});

		application.get("/users/:id", (req, resp, next) => {
			User.findById(req.params.id)
				.then(this.render(resp, next)).catch(next);
		});

		application.post("/users", (req, resp, next) => {
			const user = new User(req.body);
			user.save().then(this.render(resp, next)).catch(next);
		});

		application.put("/users/:id", (req, resp, next) => {
			const options = { overwrite: true, runValidators: true };
			User.update({ _id: req.params.id }, req.body, options)
				.exec()
				.then((result) => {
					if (result.n) {
						return User.findById(req.params.id);
					} else {
						throw new NotFoundError("Documento não encontrado.");
					}
				}).then(this.render(resp, next)).catch(next);
		});

		application.patch("/users/:id", (req, resp, next) => {
			const options = {new: true, runValidators: true};
			User.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next);
		});

		application.del("/users/:id", (req, resp, next) => {
			User.remove({_id: req.params.id}).exec().then((cmdResult: any) => {
				if (cmdResult.result.n) {
					resp.send(204);
				} else {
					throw new NotFoundError("Documento não encontrado.");
				}
				return next();
			}).catch(next);
		});
	}
}

export const usersRouter = new UsersRouter();
