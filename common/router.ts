import { EventEmitter } from "events";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";

export abstract class Router extends EventEmitter {
	public abstract applyRoutes(application: restify.Server);

	public envelope(document: any): any {
		return document;
	}

	public render(response: restify.Response, next: restify.Next) {
		return (document) => {
			if (document) {
				this.emit("beforeRender", document);
				response.json(this.envelope(document));
			} else {
				throw new NotFoundError("Documento não encontrado.");
			}
			return next();
		};
	}

	public renderAll(response: restify.Response, next: restify.Next) {
		return (documents: any[]) => {
			if (documents) {
				documents.forEach((document, index, array) => {
					this.emit("beforeRender", document);
					array[index] = this.envelope(document);
				});
				response.json(documents);
			} else {
				response.json([]);
			}
			return next();
		};
	}
}
