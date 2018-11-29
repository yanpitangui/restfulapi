import * as mongoose from "mongoose";
import * as restify from "restify";
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewRouter extends ModelRouter<Review> {
	constructor() {
		super(Review);
	}

	public envelope(document: any): any {
		const resource = super.envelope(document);
		const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
		resource._links.restaurant = `/restaurants/${restId}`;
		return resource;
	}

	public applyRoutes(application: restify.Server) {
		application.get(`${this.basePath}`, this.findAll);
		application.get(`${this.basePath}/:id`, this.findById);
		application.post(`${this.basePath}`, this.save);
	}

	protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
		return query
			.populate("user", "name")
			.populate("restaurant", "name");
	}
}

export const reviewRouter = new ReviewRouter();
