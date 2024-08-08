import mongoose from 'mongoose'; // Import mongoose
import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import Account from "@/models/Account";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),
    events: {
        async signIn({ user, account }) {
            try {
                // Ensure database connection only if necessary
                if (mongoose.connection.readyState !== 1) {
                    console.log("Connecting to MongoDB...");
                    await mongooseConnect();
                    console.log("Connected to MongoDB");
                }

                // Try finding the account with lean to avoid creating Mongoose documents
                const existingAccount = await Account.findOne(
                    { userId: user.id, provider: account.provider, providerAccountId: account.providerAccountId },
                    '_id email'  // Only retrieve _id and email fields
                ).lean();

                if (existingAccount) {
                    // Update email if necessary using updateOne for better performance
                    if (!existingAccount.email) {
                        await Account.updateOne(
                            { _id: existingAccount._id },
                            { $set: { email: user.email } }
                        );
                        console.log("Updated existing account with email for user:", user.id);
                    }
                } else {
                    // Directly create the new account
                    await Account.create({
                        userId: user.id,
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        access_token: account.access_token,
                        expires_at: account.expires_at,
                        token_type: account.token_type,
                        scope: account.scope,
                        id_token: account.id_token,
                        email: user.email,
                    });
                    console.log("New account created for user:", user.id);
                }
            } catch (error) {
                console.error("Error during sign-in:", error);
            }
        },
    },
};

export const getAuthSession = async () => getServerSession(authOptions);
