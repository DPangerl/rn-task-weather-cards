import { accountOperations } from "@/lib/account";
import { tokenOperations } from "@/lib/token";

export async function POST(request: Request) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return Response.json({ error: "Token missing" }, { status: 401 });
    }

    // Verify token
    const payload = tokenOperations.verify(token);

    if (!payload) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user data
    const user = accountOperations.findById(payload.userId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    // Return success with user data
    return Response.json({
      success: true,
      message: "Authorized",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
