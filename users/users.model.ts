import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { environment } from "../common/environment";
import { validateCPF } from "../common/validators";
export interface User extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	cpf: string;
	gender: string;
	profiles: string[];
	matches(password: string): boolean;
	hasAny(...password: string[]): boolean;
}

export interface UserModel extends mongoose.Model<User> {
	findByEmail(email: string, projection?: string): Promise<User>;
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
	},
	profiles: {
		type: [String],
		required: false,
		default: ["user"]
	}
}, { versionKey: false });

// tslint:disable-next-line:only-arrow-functions
userSchema.statics.findByEmail = function(email: string, projection: string) {
	return this.findOne({email}, projection);
};

// tslint:disable-next-line:only-arrow-functions
userSchema.methods.matches = function(password: string): boolean {
	return bcrypt.compareSync(password, this.password);
};

// tslint:disable-next-line:only-arrow-functions
userSchema.methods.hasAny = function(...profiles: string[]): boolean {
	return profiles.some((profile) => this.profiles.indexOf(profile) > 0);
};

const hashPassword = (obj, next) => {
	bcrypt.hash(obj.password, environment.security.saltRounds).then((hash) => {
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
	const user: User = this;
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
export const User = mongoose.model<User, UserModel>("User", userSchema);
