import { account, ID } from "@/lib/appwrite";

export async function loginAction(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, data: session };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || "Login failed. Please check your credentials.",
    };
  }
}

export async function signupAction(email, password, name) {
  try {
    // Create the user account
    await account.create(ID.unique(), email, password, name);

    // Important: Create a session after signup
    await account.createEmailPasswordSession(email, password);

    // Get the current user data (which includes session info)
    const currentUser = await account.get();

    return { success: true, data: currentUser };
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific Appwrite errors
    let errorMessage = "Signup failed. Please try again.";

    if (error.code === 409) {
      errorMessage = "An account with this email already exists.";
    } else if (error.code === 400) {
      if (error.message.includes("password")) {
        errorMessage = "Password must be at least 8 characters long.";
      } else if (error.message.includes("email")) {
        errorMessage = "Please enter a valid email address.";
      } else {
        errorMessage = "Invalid input. Please check your details.";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function logoutAction() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error.message || "An error occurred logging out.",
    };
  }
}

// logoutAction();

// export async function passwordRecovery() {
//   try {
//     await account.createRecovery(email, "http://localhost:3000/recovery");
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function updateRecovery() {
//   try {
//     await account.updateRecovery(email, "http://localhost:3000/recovery");
//   } catch (error) {
//     console.error(error);
//   }
// }
