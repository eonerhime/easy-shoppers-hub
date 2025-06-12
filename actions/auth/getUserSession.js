// Remove "use server" and make this a client-side function
import { account } from "@/lib/appwrite";

export default async function getUserSession() {
  try {
    const user = await account.get();
    const session = await account.getSession("current");

    if (!session || !user) {
      return null;
    }

    return { user, session };
  } catch (error) {
    // Check if it's actually an authentication error (no session)
    if (
      error.code === 401 ||
      error.message.includes("missing scope") ||
      error.type === "general_unauthorized_scope"
    ) {
      console.log("No active session - user needs to log in");
      return null;
    }

    // Log other errors that aren't related to authentication
    console.error("Failed to retrieve user session:", error.message);
    return null;
  }
}
