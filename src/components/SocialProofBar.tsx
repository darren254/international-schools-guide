export default function SocialProofBar() {
  return (
    <section className="bg-white border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-7">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 border-l-[3px] border-hermes pl-5">
            <p className="text-sm italic text-gray-500 leading-relaxed mb-1.5">
              "We visited six schools in Jakarta. ISG's fee breakdowns and honest reviews saved us weeks of research — and probably $10K in the wrong school."
            </p>
            <cite className="text-xs text-gray-400 not-italic block">
              — Sarah M., British expat family relocating from London
            </cite>
          </div>
          <div className="flex gap-10">
            <div className="text-center">
              <span className="block font-display text-3xl text-hermes">66</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Honest Reviews</span>
            </div>
            <div className="text-center">
              <span className="block font-display text-3xl text-hermes">200+</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Data Points per School</span>
            </div>
            <div className="text-center">
              <span className="block font-display text-3xl text-hermes">100%</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Independent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
