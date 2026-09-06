import { CalendarCheck, Flame, MessageSquareText, Target, Users, WandSparkles } from 'lucide-react';

const stats = [
  { label: 'New leads', value: '18', detail: '+6 vs yesterday', icon: Users },
  { label: 'Hot leads', value: '7', detail: 'Need action now', icon: Flame },
  { label: 'Appointments', value: '9', detail: '6 confirmed', icon: CalendarCheck },
  { label: 'Reply rate', value: '42%', detail: '+8% this week', icon: MessageSquareText },
];

const leads = [
  { name: 'Marcus Reed', source: 'Facebook', vehicle: '2021 Honda Accord', score: 94, action: 'Call now', status: 'Hot' },
  { name: 'Brianna Cole', source: 'CarGurus', vehicle: '2020 Chevy Malibu', score: 88, action: 'Confirm 3:00 PM', status: 'Hot' },
  { name: 'Derrick Jones', source: 'Capital One', vehicle: 'SUV under $25k', score: 81, action: 'Send 3 matches', status: 'Warm' },
  { name: 'Tasha Williams', source: 'Website', vehicle: '2019 Nissan Altima', score: 73, action: '2nd follow-up', status: 'Warm' },
];

export function TodayPage() {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Super Bee Command Center</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Today&apos;s money moves</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">The system ranks the leads most likely to book, show, and buy so follow-up time goes where it can create revenue.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700">
          <WandSparkles size={18} /> Run AI lead sweep
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <Icon className="text-violet-600" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.75fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Priority lead queue</h2>
              <p className="text-sm text-slate-500">AI-ranked by intent, urgency, response behavior, and appointment probability.</p>
            </div>
            <Target className="text-violet-600" />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => (
              <div key={lead.name} className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_90px_120px] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.source} · {lead.vehicle}</p>
                </div>
                <div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">{lead.status}</span>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{lead.action}</p>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{lead.score}/100</div>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Open lead</button>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 shadow-sm dark:border-violet-900 dark:from-violet-950/40 dark:to-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Head AI Agent</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Focus report</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>1.</strong> Call Marcus before sending another text. His score is high enough that another automated touch adds little value.</p>
            <p><strong>2.</strong> Brianna&apos;s appointment is the nearest revenue event. Confirm it before chasing colder leads.</p>
            <p><strong>3.</strong> Derrick needs inventory choices, not another generic “still interested?” message.</p>
          </div>
          <div className="mt-6 rounded-xl bg-slate-950 p-4 text-white dark:bg-black">
            <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Guardrail</p>
            <p className="mt-2 text-sm">Agents may draft, score, and recommend. Customer-facing sends remain supervised until explicit autonomy rules are enabled.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
