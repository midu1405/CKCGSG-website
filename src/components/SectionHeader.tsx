const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      {Icon && <Icon className="text-gold" size={24} />}
      <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold">CKCGSG</span>
    </div>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold serif mb-4">{title}</h2>
    {subtitle && <p className="text-white/50 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

export default SectionHeader;