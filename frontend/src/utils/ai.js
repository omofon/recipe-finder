const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getRecipe(ingredientsArr) {
  const response = await fetch(`${API_URL}/api/recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients: ingredientsArr }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch recipe");
  }

  const data = await response.json();
  return data.recipe;
}