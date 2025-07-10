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

    // Optional: treat network issues the same if you want
    if (error.message.includes("Failed to fetch")) {
      console.warn(
        "Could not reach Appwrite. Possibly offline or misconfigured."
      );
      return null;
    }

    console.error("Failed to retrieve user session:", error.message);
    return null;
  }
}
