import * as mongoose from "mongoose";
import * as restify from "restify";
import { environment } from "../common/environment";
import { Router } from "../common/router";
import { handleError } from "./error.handler";
import {mergePatchBodyParser} from "./merge-patch.parser";
import { tokenParser } from "../security/token.parser";
export class Server {
	public application: restify.Server;

	public initializeDb() {
		(mongoose as any).Promise = global.Promise;
		return mongoose.connect(
			environment.db.url,
			{
				useMongoClient: true
			}
		);
	}

	public initRoutes(routers: Router[]): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				this.application = restify.createServer({
					name: "meat-api",
					version: "1.0.0"
				});
				this.application.use(restify.plugins.queryParser());
				this.application.use(restify.plugins.bodyParser());
				this.application.use(mergePatchBodyParser);
				this.application.use(tokenParser);
				// routes
				for (const router of routers) {
					router.applyRoutes(this.application);
				}

				this.application.listen(environment.server.port, () => {
					resolve(this.application);
				});

				this.application.on("restifyError", handleError);
			} catch (error) {
				reject(error);
			}
		});
	}
	public bootstrap(routers: Router[] = []): Promise<Server> {
		return this.initializeDb().then(() =>
			this.initRoutes(routers).then(() => this)
		);
	}

	public shutdown() {
		return mongoose
		.disconnect()
		.then(() => this.application.close());
	}
}
