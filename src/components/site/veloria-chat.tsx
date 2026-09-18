"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, X } from "lucide-react";
import { SUGGESTED_PROMPTS, splitBotMessage } from "@/lib/veloria-bot";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "I’m We. I can help with Veloria — services, readiness, the Veloria Score, and how we prepare a business for capital or a serious counterparty.";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function WeFace({ size, className = "" }: { size: number; className?: string }) {
  return (
    <img
      src="/we.png"
      alt=""
      width={size}
      height={size}
      className={`veloria-chat-face ${className}`}
      style={{ objectPosition: "center" }}
      draggable={false}
    />
  );
}

export function VeloriaChat() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [hover, setHover] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const scroller = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (open) {
      setHint(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hide: number;
    const pop = () => {
      if (hoverRef.current) return;
      setHint(true);
      hide = window.setTimeout(() => {
        if (!hoverRef.current) setHint(false);
      }, 3400);
    };

    const first = window.setTimeout(pop, 900);
    const loop = window.setInterval(pop, 8600);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hide);
      window.clearInterval(loop);
    };
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: ChatMessage = { id: uid(), role: "user", content };
    const assistantId = uid();
    const history = [...messages, userMsg].filter((m) => m.id !== "welcome");

    setInput("");
    setError(null);
    setLoading(true);
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "We could not reply just now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const next = acc;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: next } : m)),
        );
      }
      if (!acc.trim()) {
        throw new Error("We could not reply just now.");
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : "We could not reply just now.";
      setError(message);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: m.content || "We could not reply just now. Please try again." }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  const started = messages.some((m) => m.role === "user");
  const showHint = !open && (hint || hover);

  return (
    <div className="veloria-chat">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="veloria-chat-title"
            className="veloria-chat-panel"
            initial={{ opacity: 0, y: 22, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="veloria-chat-head">
              <div className="veloria-chat-identity">
                <span className="veloria-chat-head-face">
                  <WeFace size={44} />
                  <span className="veloria-chat-online" />
                </span>
                <div>
                  <h2 id="veloria-chat-title" className="font-display">
                    We
                  </h2>
                  <p>Veloria guide</p>
                </div>
              </div>
              <button
                type="button"
                data-cursor
                className="veloria-chat-icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </header>

            <div ref={scroller} className="veloria-chat-thread">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {loading ? (
                <div className="veloria-chat-typing">
                  <WeFace size={22} />
                  <span>We is writing</span>
                  <span className="veloria-chat-dots" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              ) : null}
              {error ? <p className="veloria-chat-error">{error}</p> : null}

              {!started ? (
                <div className="veloria-chat-prompts">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      data-cursor
                      className="veloria-chat-chip"
                      onClick={() => send(prompt)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.04, duration: 0.35 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              className="veloria-chat-compose"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <textarea
                rows={1}
                value={input}
                maxLength={800}
                placeholder="Ask We about Veloria…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
              />
              <button
                type="submit"
                data-cursor
                disabled={loading || !input.trim()}
                className="veloria-chat-send"
                aria-label="Send"
              >
                <ArrowUp size={17} />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className="veloria-chat-dock"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence>
          {showHint ? (
            <motion.div
              key="hint"
              className="veloria-chat-tip"
              initial={{ opacity: 0, x: 18, scale: 0.86 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.9 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <strong>Chat with me</strong>
              <span>We</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          data-cursor
          className="veloria-chat-orb"
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Chat with We"}
          onClick={() => setOpen((v) => !v)}
          animate={
            open
              ? { scale: 1 }
              : showHint
                ? { scale: 1.08 }
                : { scale: [1, 1.04, 1] }
          }
          transition={
            open || showHint
              ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span className="veloria-chat-orb-ring" aria-hidden />
          <WeFace size={64} />
          <AnimatePresence>
            {open ? (
              <motion.span
                className="veloria-chat-orb-close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <X size={18} />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="veloria-chat-row veloria-chat-row-user">
        <div className="veloria-chat-bubble veloria-chat-bubble-user">
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  const { body, ctas } = splitBotMessage(message.content);
  return (
    <div className="veloria-chat-row veloria-chat-row-bot">
      <WeFace size={28} />
      <div className="veloria-chat-bubble veloria-chat-bubble-bot">
        {body ? <p>{body}</p> : <span className="veloria-chat-caret" aria-hidden />}
        {ctas.length ? (
          <div className="veloria-chat-ctas">
            {ctas.map((cta) => (
              <Link key={cta.href} href={cta.href} data-cursor className="veloria-chat-cta">
                {cta.label}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
