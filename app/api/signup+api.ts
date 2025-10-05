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

    // Check if user already exists
    if (accountOperations.emailExists(email)) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password and create user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = accountOperations.create(email, passwordHash);

    // Create JWT token for immediate login
    const token = tokenOperations.generate({
      userId: newUser.id,
      email: newUser.email,
    });

    return Response.json({
      success: true,
      message: "Account created successfully",
      token,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
