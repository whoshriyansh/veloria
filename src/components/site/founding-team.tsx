import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import type { CmsFoundingMember } from "@/lib/cms";

const FACE_FOCUS: Record<string, string> = {
  "fm-himanshu-arya": "50% 10%",
  "himanshu-arya": "50% 10%",
  "fm-divyam-gaur": "50% 16%",
  "divyam-gaur": "50% 16%",
  "fm-tanishq-garg": "50% 8%",
  "tanishq-garg": "50% 8%",
  "fm-farishq-shidique": "50% 12%",
  "farishq-shidique": "50% 12%",
  "fm-preeti-garg": "50% 22%",
  "preeti-garg": "50% 22%",
  "fm-rupesh": "50% 12%",
  rupesh: "50% 12%",
};

function faceFocus(member: CmsFoundingMember) {
  return (
    FACE_FOCUS[member.id] ??
    (member.slug ? FACE_FOCUS[member.slug] : undefined) ??
    "50% 12%"
  );
}

export function FoundingTeam({ members }: { members: CmsFoundingMember[] }) {
  if (!members.length) return null;

  return (
    <section id="team" className="section-y border-t border-ink/10 bg-[#fbfaf6]">
      <div className="container-v">
        <Reveal>
          <p className="eyebrow mb-4">The founding team</p>
          <h2 className="font-display max-w-xl text-[clamp(1.85rem,6vw,3.15rem)] font-medium leading-[1.18]">
            The people behind Veloria.
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.05}>
              <article>
                <div className="overflow-hidden bg-[#ece6da]">
                  {member.imageUrl ? (
                    <div className="relative aspect-3/4 w-full">
                      <Photo
                        src={member.imageUrl}
                        alt={member.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                          objectPosition: faceFocus(member),
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-3/4 items-end bg-forest-900 p-5 text-cream">
                      <p className="font-display text-2xl">{member.name}</p>
                    </div>
                  )}
                </div>
                <h3 className="font-display mt-4 text-[1.15rem] font-medium leading-tight tracking-tight sm:text-[1.28rem]">
                  {member.name}
                </h3>
                {member.role ? (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink-soft sm:text-[11px] sm:tracking-[0.16em]">
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
