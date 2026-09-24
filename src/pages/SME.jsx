function SME() {
  return (
    <div className="min-h-screen bg-[#090714] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold text-cyan-300">
            AI FUTURE TAMIL
          </p>

          <h1 className="text-4xl font-black">
            SME & Assessment Studio
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400">
            Create, review, validate and manage educational content,
            questions, standards and assessments with AI.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {[
            ["📝", "Content Developer"],
            ["❓", "Question Developer"],
            ["🧠", "SME Review"],
            ["📐", "Standard Developer"],
            ["🔍", "Peer Reviewer"],
            ["✅", "Quality Reviewer"],
            ["🎓", "Tutor AI"],
            ["📚", "Curriculum Designer"],
            ["📊", "Assessment Builder"],
            ["📂", "Knowledge Base"],
            ["🗃️", "Item Bank"],
            ["📈", "Analytics"],
            ["📤", "Export Center"],
          ].map(([icon, title]) => (
            <button
              key={title}
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.04]
                p-6
                text-left
                transition
                hover:-translate-y-1
                hover:border-cyan-400/40
                hover:bg-white/[0.07]
              "
            >
              <div className="text-3xl">{icon}</div>

              <h2 className="mt-4 text-lg font-bold">
                {title}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Open {title} workspace
              </p>
            </button>
          ))}

        </div>

      </div>
    </div>
  );
}

export default SME;