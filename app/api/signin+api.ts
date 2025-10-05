import { accountOperations } from "@/lib/account";
import { tokenOperations } from "@/lib/token";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get user from in-memory storage
    const user = accountOperations.findByEmail(email);

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = tokenOperations.generate({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      success: true,
      message: "Sign-in successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
