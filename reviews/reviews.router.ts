import * as mongoose from "mongoose";
import * as restify from "restify";
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewRouter extends ModelRouter<Review> {
	constructor() {
		super(Review);
	}

	public applyRoutes(application: restify.Server) {
		application.get("/reviews", this.findAll);
		application.get("/reviews/:id", this.findById);
		application.post("/reviews", this.save);
	}

	protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
		return query
			.populate("user", "name")
			.populate("restaurant", "name");
	}
}

export const reviewRouter = new ReviewRouter();
