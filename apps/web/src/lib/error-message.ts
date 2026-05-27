const fallbackMessage = "Something went wrong. Please try again.";

function getRawMessage(error: unknown) {
  if (!error) return "";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }

  return "";
}

function parseValidationMessage(message: string) {
  try {
    const parsed = JSON.parse(message) as unknown;
    const firstIssue = Array.isArray(parsed) ? parsed[0] : parsed;

    if (!firstIssue || typeof firstIssue !== "object") return null;

    const issue = firstIssue as {
      message?: string;
      path?: Array<string | number>;
      minimum?: number;
    };
    const field = issue.path?.join(".").toLowerCase() ?? "";

    if (field.includes("email")) return "Enter a valid email address.";
    if (field.includes("password")) {
      return `Password must be at least ${issue.minimum ?? 6} characters.`;
    }
    if (field.includes("title")) return "Form title must be at least 3 characters.";
    if (field.includes("label")) return "Field label is required.";
    if (field.includes("options")) return "Add at least one option for this field.";

    return issue.message ?? null;
  } catch {
    return null;
  }
}

export function getFriendlyErrorMessage(error: unknown, fallback = fallbackMessage) {
  const rawMessage = getRawMessage(error).trim();
  const message = rawMessage || fallback;
  const normalized = message.toLowerCase();

  const validationMessage = parseValidationMessage(message);
  if (validationMessage) return validationMessage;

  if (
    normalized.includes("user not found") ||
    normalized.includes("invalid password") ||
    normalized.includes("invalid email or password")
  ) {
    return "Invalid email or password.";
  }

  if (normalized.includes("user already exists") || normalized.includes("account with this email")) {
    return "An account with this email already exists.";
  }

  if (
    normalized === "unauthorized" ||
    normalized.includes("unauthorized") ||
    normalized.includes("please log in to continue")
  ) {
    return "Please log in to continue.";
  }

  if (
    normalized === "forbidden" ||
    normalized.includes("forbidden") ||
    normalized.includes("do not have permission")
  ) {
    return "You do not have permission to do that.";
  }

  if (normalized.includes("form not found") || normalized.includes("not found or unauthorized")) {
    return "We could not find that form.";
  }

  if (normalized.includes("field not found")) {
    return "We could not find that field.";
  }

  if (
    normalized.includes("failed to create response") ||
    normalized.includes("unable to submit your response")
  ) {
    return "We could not submit your response. Please try again.";
  }

  if (normalized.includes("failed") || normalized.includes("bad_request")) {
    return fallback;
  }

  return message;
}
