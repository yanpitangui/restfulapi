import * as mongoose from "mongoose";
export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		select: false
	}
});

// problemas ao utilizar a interface IUser
export const User = mongoose.model<any>("User", userSchema);
