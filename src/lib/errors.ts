type DbError = { code?: string; message?: string; details?: string | null };

/** Turns raw Postgres/Supabase errors into messages a business owner can act on. */
export function friendlyDbError(error: DbError): string {
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  switch (error.code) {
    case "23505":
      if (text.includes("product_code")) return "This product code is already in use. Choose another or leave it blank.";
      if (text.includes("slug")) return "An item with this name already exists. Change the name slightly.";
      if (text.includes("code_prefix")) return "This code prefix belongs to another category.";
      return "An item with the same name already exists.";
    case "23503":
      return "This category still has products. Move or delete those products first.";
    case "23514":
      if (text.includes("published_requires_image")) return "Add a main image before publishing this product.";
      return "Some values are not allowed. Check the form and try again.";
    case "42501":
      return "You do not have permission to do this. Please sign in again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
