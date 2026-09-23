import { apiError } from "@/lib/api-error";
import { searchInput, searchRepos, searchUsers } from "@/lib/github";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const type = params.get("type");
    if (type !== "users" && type !== "repositories") {
      return Response.json(
        { error: "Choose users or repositories.", kind: "validation" },
        { status: 400 },
      );
    }
    const { query, page } = searchInput(
      params.get("q") ?? "",
      params.get("page"),
    );
    return Response.json(
      type === "users"
        ? await searchUsers(query, page)
        : await searchRepos(query, page),
    );
  } catch (error) {
    return apiError(error);
  }
}
