import { EventEmitter } from "events";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";

export abstract class Router extends EventEmitter {
	public abstract applyRoutes(application: restify.Server);
	public render(response: restify.Response, next: restify.Next) {
		return (document) => {
			if (document) {
				this.emit("beforeRender", document);
				response.json(document);
			} else {
				throw new NotFoundError("Documento não encontrado.");
			}
			return next();
		};
	}

	public renderAll(response: restify.Response, next: restify.Next) {
		return (documents: any[]) => {
			if (documents) {
				documents.forEach((document) => {
					this.emit("beforeRender", document);
				});
				response.json(documents);
			} else {
				response.json([]);
			}
			return next();
		};
	}
}
