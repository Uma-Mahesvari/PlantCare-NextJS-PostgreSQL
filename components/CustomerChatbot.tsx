"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Action = { label: string; href: string };
type Message = { role: "assistant" | "user"; text: string; actions?: Action[] };
type ChatResponse = { reply?: string; error?: string; actions?: Action[]; suggestions?: string[] };

const openingSuggestions = ["Track my latest order", "Delivery information", "Recommend a plant", "Return policy"];

export function CustomerChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState(openingSuggestions);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hi! I’m the PlantCare assistant. Ask me about plants, delivery, returns or your order status." }]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { inputRef.current?.focus(); endRef.current?.scrollIntoView(); } }, [open, messages]);
  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput(""); setBusy(true); setSuggestions([]);
    try {
      const response = await fetch("/api/chatbot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message }) });
      const result = await response.json() as ChatResponse;
      setMessages((current) => [...current, { role: "assistant", text: result.reply ?? result.error ?? "I could not answer that right now. Please try again.", actions: result.actions }]);
      setSuggestions(result.suggestions ?? openingSuggestions);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I’m temporarily unavailable. Please use the contact page if your question is urgent.", actions: [{ label: "Contact support", href: "/contact" }] }]);
      setSuggestions(openingSuggestions);
    } finally { setBusy(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(input); }

  return <>
    {open && <section role="dialog" aria-modal="false" aria-label="PlantCare customer assistant" className="fixed bottom-24 right-4 z-50 flex h-[min(620px,calc(100vh-8rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-2xl sm:right-6">
      <header className="flex items-center justify-between bg-emerald-950 px-5 py-4 text-white"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-lime-300 text-xl text-emerald-950">❧</span><div><h2 className="font-bold">PlantCare Assistant</h2><p className="text-xs text-white/60">Products, care and order help</p></div></div><button onClick={() => setOpen(false)} aria-label="Close customer assistant" className="grid size-9 place-items-center rounded-full bg-white/10 text-xl">×</button></header>
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f6f8f1] p-4" aria-live="polite">{messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-emerald-900 text-white" : "rounded-bl-md border border-emerald-950/8 bg-white text-emerald-950"}`}><p>{message.text}</p>{message.actions?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => <Link key={action.href + action.label} href={action.href} onClick={() => setOpen(false)} className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-900">{action.label} →</Link>)}</div> : null}</div></div>)}{busy && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-emerald-950/55">PlantCare is typing…</div></div>}<div ref={endRef}/></div>
      {suggestions.length > 0 && <div className="flex gap-2 overflow-x-auto border-t bg-white px-4 py-3">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => void send(suggestion)} disabled={busy} className="shrink-0 rounded-full border border-emerald-900/15 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">{suggestion}</button>)}</div>}
      <form onSubmit={submit} className="flex gap-2 border-t bg-white p-3"><label className="flex-1"><span className="sr-only">Ask PlantCare</span><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={500} placeholder="Type your question…" className="w-full rounded-full border border-emerald-950/15 px-4 py-3 text-sm outline-none focus:border-emerald-700"/></label><button disabled={busy || !input.trim()} aria-label="Send message" className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-900 font-bold text-white disabled:opacity-40">↑</button></form>
      <p className="bg-white px-4 pb-3 text-center text-[10px] text-emerald-950/40">Never share passwords, OTPs or card details in chat.</p>
    </section>}
    <button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close PlantCare assistant" : "Open PlantCare assistant"} className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3.5 font-bold text-white shadow-2xl transition hover:-translate-y-0.5 sm:right-6"><span className="text-lg">✦</span><span>{open ? "Close" : "Need help?"}</span></button>
  </>;
}
