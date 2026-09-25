"use client";

import { useState } from "react";
import { Photo } from "@/components/site/photo";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import type { CmsFoundingMember } from "@/lib/cms";

const FACE_FOCUS: Record<string, string> = {
  "fm-himanshu-arya": "50% 10%",
  "himanshu-arya": "50% 10%",
  "fm-divyam-gaur": "50% 10%",
  "divyam-gaur": "50% 10%",
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

function pad(order: number) {
  return String(order).padStart(2, "0");
}

function MemberCard({
  member,
  delay,
  featured = false,
}: {
  member: CmsFoundingMember;
  delay: number;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const bio = member.bio?.trim();

  return (
    <Reveal delay={delay}>
      <article
        className={cn(
          "team-card",
          featured && "team-card-featured",
          open && "is-open",
        )}
        onClick={() => bio && setOpen((v) => !v)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="team-card-frame">
          {member.imageUrl ? (
            <Photo
              src={member.imageUrl}
              alt={member.name}
              className="team-card-photo"
              style={{ objectPosition: faceFocus(member) }}
            />
          ) : (
            <div className="team-card-fallback">
              <p className="font-display text-2xl">{member.name}</p>
            </div>
          )}
          <div className="team-card-veil" aria-hidden />
          {bio ? (
            <div className="team-card-bio">
              <span className="team-card-rule" aria-hidden />
              <p>{bio}</p>
            </div>
          ) : null}
        </div>
        <div className="team-card-meta">
          <h3>{member.name}</h3>
          {member.role ? <p>{member.role}</p> : null}
        </div>
      </article>
    </Reveal>
  );
}

export function FoundingTeam({ members }: { members: CmsFoundingMember[] }) {
  if (!members.length) return null;

  const sorted = [...members].sort((a, b) => a.order - b.order);
  const founders = sorted.slice(0, 2);
  const associates = sorted.slice(2);

  return (
    <section
      id="team"
      className="section-y border-t border-ink/10 bg-[#fbfaf6]"
    >
      <div className="container-v">
        <Reveal>
          <p className="eyebrow mb-4">The people behind Veloria</p>
          <h2 className="font-display max-w-2xl text-[clamp(1.85rem,6vw,3.15rem)] font-medium leading-[1.18]">
            Founding team
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            The partners who set the standard. Hover a portrait to read a brief
            note on their work.
          </p>
        </Reveal>
        {founders.length ? (
          <div className="mx-auto mt-12 grid max-w-[44rem] grid-cols-2 gap-x-5 gap-y-10 lg:max-w-[52rem] lg:gap-x-10">
            {founders.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                delay={i * 0.08}
                featured
              />
            ))}
          </div>
        ) : null}

        {associates.length ? (
          <div className="mt-16 border-t border-ink/10 pt-12 sm:mt-20 sm:pt-14">
            <Reveal>
              <h2 className="font-display max-w-xl text-[clamp(1.85rem,6vw,3.15rem)] font-medium leading-[1.18]">
                Our associates
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                The bench that carries the work through — records, contracts,
                research and follow-through.
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {associates.map((member, i) => (
                <MemberCard key={member.id} member={member} delay={i * 0.06} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
