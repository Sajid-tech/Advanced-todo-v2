import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    title: { type: String, required: true },
    email: { type: String, required: true },
    images: [{ type: String }],
})

const User = models.User || model("User", UserSchema)

export default User