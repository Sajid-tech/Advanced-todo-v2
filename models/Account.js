import mongoose, { Schema, model, models } from "mongoose";

const AccountSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['email', 'oidc', 'oauth', 'webauthn'], required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    email: { type: String, required: true },
})

const Account = models.Account || model("Account", AccountSchema)

export default Account