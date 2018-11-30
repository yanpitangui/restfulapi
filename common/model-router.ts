import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";
import { Router } from "./router";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

	protected basePath: string;

	protected pageSize: number = 4;

	constructor(protected model: mongoose.Model<D>) {
		super();
		this.basePath = `/${model.collection.name}`;
	}

	public envelope(document: any): any {
		const resource = Object.assign({ _links: {} }, document.toJSON(document));
		resource._links.self = `${this.basePath}/${resource._id}`;
		return resource;
	}

	public envelopeAll(documents: any[], options: any = {}): any {
		const resource: any = {
			_links: {
				self: `${options.url}`
			},
			items: documents
		};
		if (options.page && options.count && options.pageSize) {
			if (options.page > 1) {
				resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
			}
			const remaining = options.count - (options.page * options.pageSize);
			if (remaining > 0) {
				resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
			}
		}
		return resource;

	}

	public validateId = (req, resp, next) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			next(new NotFoundError("Document not found"));
		} else {
			next();
		}
	}

	public findAll = (req, resp, next) => {
		let page = parseInt(req.query._page || 1, 10);
		page = page > 0 ? page : 1;
		const skip = (page - 1) * this.pageSize;
		this.model.count({})
			.exec()
			.then((count) =>
				this.model.find()
					.skip(skip)
					.limit(this.pageSize)
					.then(this.renderAll(resp, next, { page, count, pageSize: this.pageSize, url: req.url })))
					.catch(next);
	}

	public findById = (req, resp, next) => {
		this.prepareOne(this.model.findById(req.params.id))
			.then(this.render(resp, next)).catch(next);
	}

	public save = (req, resp, next) => {
		const document = new this.model(req.body);
		document.save().then(this.render(resp, next)).catch(next);
	}

	public replace = (req, resp, next) => {
		const options = { overwrite: true, runValidators: true };
		this.model.update({ _id: req.params.id }, req.body, options)
			.exec()
			.then((result) => {
				if (result.n) {
					return this.model.findById(req.params.id).exec();
				} else {
					throw new NotFoundError("Documento não encontrado.");
				}
			}).then(this.render(resp, next)).catch(next);
	}

	public update = (req, resp, next) => {
		const options = { new: true, runValidators: true };
		this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next);
	}

	public delete = (req, resp, next) => {
		this.model.remove({ _id: req.params.id }).exec().then((cmdResult: any) => {
			if (cmdResult.result.n) {
				resp.send(204);
			} else {
				throw new NotFoundError("Documento não encontrado.");
			}
			return next();
		}).catch(next);
	}

	protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
		return query;
	}

}
