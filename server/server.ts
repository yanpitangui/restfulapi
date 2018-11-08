import * as mongoose from "mongoose";
import * as restify from "restify";
import { enviroment } from "../common/enviroment";
import { Router } from "../common/router";
import {mergePatchBodyParser} from "./merge-patch.parser";
export class Server {
	public application: restify.Server;

	public initializeDb() {
		(mongoose as any).Promise = global.Promise;
		return mongoose.connect(
			enviroment.db.url,
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
				// routes
				for (const router of routers) {
					router.applyRoutes(this.application);
				}

				this.application.listen(enviroment.server.port, () => {
					resolve(this.application);
				});
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
}
