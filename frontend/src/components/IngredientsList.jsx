export default function IngredientsList({
  ingredients,
  getRecipe,
  ingredientsRef,
  clearList,
  isLoading,
}) {
  const ingredientsListItems = ingredients.map((ingredient) => (
    <li
      key={ingredient}
      className="py-2 border-b border-linen last:border-0 text-ink capitalize"
    >
      {ingredient}
    </li>
  ));

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Ingredients on hand:
      </h2>
      <ul
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 bg-canvas p-6 rounded-xl border border-linen shadow-sm"
      >
        {ingredientsListItems}
      </ul>
      <button
        className="bg-clay hover:bg-burnt-clay text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md active:scale-95"
        onClick={clearList}
      >
        Clear List
      </button>

      {ingredients.length > 3 && (
        <div className="flex items-center justify-between bg-parchment p-6 rounded-xl border border-clay/20 shadow-inner">
          <div ref={ingredientsRef} className="space-y-1">
            <h3 className="text-lg font-semibold text-ink">
              Ready for a recipe?
            </h3>
            <p className="text-sm text-ash">
              Generate a culinary masterpiece from your list.
            </p>
          </div>
          <button
            onClick={getRecipe}
            disabled={isLoading}
            className="bg-clay hover:bg-burnt-clay text-white px-5 py-2.5 rounded-lg font-semibold shadow transition-all hover:scale-105 active:scale-95"
          >
            {isLoading ? "Generating..." : "Get a recipe"}
          </button>
        </div>
      )}
    </section>
  );
}
