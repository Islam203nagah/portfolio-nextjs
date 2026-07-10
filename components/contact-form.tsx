"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string; errors?: any } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.ok) {
        setStatus({ ok: true, message: "Thank you! Your message has been sent successfully." });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          ok: false,
          message: data.message || data.error || "Unable to send your message. Please try again.",
          errors: data.errors,
        });
      }
    } catch {
      setLoading(false);
      setStatus({ ok: false, message: "A network error occurred. Please try again later." });
    }
  }

  return (
    <form id="contact" onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/40 p-6 shadow-lg shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Send a message and I will reply as soon as possible.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-name">Name</Label>
          <Input 
            id="contact-name" 
            name="name" 
            placeholder="Your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {status && !status.ok && status.errors?.name && <p className="mt-1 text-sm text-red-500">{status.errors.name[0]}</p>}
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input 
            id="contact-email" 
            name="email" 
            type="text" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {status && !status.ok && status.errors?.email && <p className="mt-1 text-sm text-red-500">{status.errors.email[0]}</p>}
        </div>
        <div>
          <Label htmlFor="contact-message">Message</Label>
          <Textarea 
            id="contact-message" 
            name="message" 
            placeholder="How can I help you?" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {status && !status.ok && status.errors?.message && <p className="mt-1 text-sm text-red-500">{status.errors.message[0]}</p>}
        </div>
      </div>

      <div>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2 flex items-center justify-center">
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </div>

      {status && status.ok && (
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl animate-fade-in">
          <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
          {status.message}
        </div>
      )}

      {status && !status.ok && !status.errors && (
        <div className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl animate-fade-in">
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          {status.message}
        </div>
      )}
    </form>
  );
}
