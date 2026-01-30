import { useEffect, useRef, useState } from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipe } from "../utils/ai";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const recipeSection = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function generateRecipe() {
    setIsLoading(true);
    setError(null);
    setRecipe(""); // Clear previous recipe

    try {
      const recipeMarkdown = await getRecipe(ingredients);
      setRecipe(recipeMarkdown);
    } catch (err) {
      console.error("Recipe generation error:", err);
      setError(err.message || "Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAction(formData) {
    const newIngredient = formData.get("ingredient");
    if (!newIngredient?.trim()) return;

    setIngredients((prev) => [...prev, newIngredient.trim()]);
    formRef.current.reset();
  }

  function clearList() {
    setIngredients([]);
    setRecipe("");
    setError(null);
  }

  return (
    <main className="space-y-8">
      <form ref={formRef} action={handleAction} className="flex gap-2 h-12">
        <input
          className="grow px-4 rounded-lg border border-linen bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-clay/50 shadow-sm"
          type="text"
          name="ingredient"
          placeholder="e.g. Eggs, Flour, Milk"
          aria-label="Add ingredient"
          disabled={isLoading}
        />
        <button
          className="bg-clay hover:bg-burnt-clay text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          + Add
        </button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={generateRecipe}
          ingredientsRef={recipeSection}
          clearList={clearList}
          isLoading={isLoading}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay"></div>
          <p className="text-ink/60">Generating your recipe...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={() => generateRecipe()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Recipe Display */}
      {recipe && !isLoading && (
        <div ref={recipeSection} className="pt-4">
          <ClaudeRecipe recipe={recipe} />
        </div>
      )}
    </main>
  );
}
