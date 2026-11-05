import { privacyNotice } from '@/config/privacy'

export function PrivacyNotice() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <p role="note" className="rounded-2xl border-2 border-warning/60 bg-warning/10 p-4 text-lg font-semibold text-foreground">
        {privacyNotice.draftNotice}
      </p>
      <p className="text-lg leading-relaxed text-muted-foreground">{privacyNotice.law}</p>
      {privacyNotice.sections.map((section) => (
        <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="flex flex-col gap-3">
          <h2 id={`privacy-${section.id}`} className="text-2xl font-bold text-foreground">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-foreground">
              {paragraph}
            </p>
          ))}
          {section.items && (
            <ul className="list-disc space-y-1 pl-6 text-lg leading-relaxed text-foreground">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.id === 'contacto' && (
            <a
              href={privacyNotice.contactUrl}
              className="inline-flex min-h-11 items-center self-start text-lg font-semibold text-primary underline underline-offset-4 outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
            >
              {privacyNotice.contactLabel}
            </a>
          )}
        </section>
      ))}
    </div>
  )
}
