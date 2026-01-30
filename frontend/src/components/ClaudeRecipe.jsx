import ReactMarkdown from "react-markdown";

export default function ClaudeRecipe({ recipe }) {
  return (
    <section className="mt-10 p-8 bg-canvas rounded-2xl border border-linen shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold border-b border-linen pb-4 mb-6 text-clay">
        SauceIt Recommends:
      </h2>
      <article
        className="prose prose-stone max-w-none text-ink
        prose-headings:text-ink prose-headings:font-poppins
        prose-strong:text-clay prose-li:marker:text-clay"
      >
        <ReactMarkdown>{recipe}</ReactMarkdown>
      </article>
    </section>
  );
}
