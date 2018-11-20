import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { enviroment } from "../common/enviroment";
import { validateCPF } from "../common/validators";
export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 80,
		minlength: 3
	},
	email: {
		type: String,
		unique: true,
		// tslint:disable-next-line:max-line-length
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		required: true
	},
	password: {
		type: String,
		select: false,
		required: true
	},
	gender: {
		type: String,
		required: false,
		enum: ["Male", "Female"]
	},
	cpf: {
		type: String,
		required: false,
		validate: {
			validator: validateCPF,
			message: "{PATH}: Invalid CPF ({VALUE})"
		}
	}
}, { versionKey: false });

const hashPassword = (obj, next) => {
	bcrypt.hash(obj.password, enviroment.security.saltRounds).then((hash) => {
			obj.password = hash;
			next();
		}).catch(next);
};

const updateMiddleware = function(next) {
	if (!this.getUpdate().password) {
		next();
	} else {
		hashPassword(this.getUpdate(), next);
	}
};

const saveMiddleware = function(next) {
	const user: IUser = this;
	if (!user.isModified("password")) {
		next();
	} else {
		hashPassword(user, next);
	}
};

userSchema.pre("save", saveMiddleware);

userSchema.pre("findOneAndUpdate", updateMiddleware);

userSchema.pre("update", updateMiddleware);

// problemas ao utilizar a interface IUser
export const User = mongoose.model<IUser>("User", userSchema);
