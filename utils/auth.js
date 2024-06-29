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
        async signIn(message) {
            const { user, account } = message;

            try {
                // Ensure database connection
                console.log("Connecting to MongoDB...");
                await mongooseConnect();
                console.log("Connected to MongoDB");

                // Log the user and account information
                console.log("User:", user);
                console.log("Account:", account);

                // Check if account already exists
                const existingAccount = await Account.findOne({
                    userId: user.id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                });

                if (existingAccount) {
                    console.log("Account already exists for user:", user.id);
                    // Update the email field if it doesn't exist
                    if (!existingAccount.email) {
                        existingAccount.email = user.email;
                        await existingAccount.save();
                        console.log("Updated existing account with email for user:", user.id);
                    }
                } else {
                    console.log("Creating new account for user:", user.id);
                    // Create new account entry
                    const newAccount = new Account({
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
                    await newAccount.save();
                    console.log("New account saved for user:", user.id);
                }
            } catch (error) {
                console.error("Error in signIn event:", error);
            }
        },
    },
};

export const getAuthSession = async () => getServerSession(authOptions);
