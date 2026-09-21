import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import type { CmsFoundingMember } from "@/lib/cms";

export function FoundingTeam({ members }: { members: CmsFoundingMember[] }) {
  if (!members.length) return null;

  return (
    <section className="section-y border-t border-ink/10 bg-[#fbfaf6]">
      <div className="container-v">
        <Reveal>
          <p className="eyebrow mb-4">The founding team</p>
          <h2 className="font-display max-w-xl text-[clamp(1.85rem,6vw,3.15rem)] font-medium leading-[1.18]">
            The people behind Veloria.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <article>
                <div className="overflow-hidden bg-[#ece6da]">
                  {member.imageUrl ? (
                    <Photo
                      src={member.imageUrl}
                      alt={member.name}
                      className="aspect-[3/4] w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-end bg-forest-900 p-5 text-cream">
                      <p className="font-display text-2xl">{member.name}</p>
                    </div>
                  )}
                </div>
                <h3 className="font-display mt-4 text-[1.35rem] font-medium leading-tight tracking-tight">
                  {member.name}
                </h3>
                {member.role ? (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                    {member.role}
                  </p>
                ) : null}
                {member.bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{member.bio}</p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
