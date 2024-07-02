import Account from "@/models/Account";

// Helper function to get user ID
export async function getUserId(email) {
    const accounts = await Account.find({ email });
    const userIds = accounts.map(account => account.userId);
    // Assuming the user ID is stored as a string in the database
    // console.log("shaka", userIds.toString())
    return userIds.toString()
}
