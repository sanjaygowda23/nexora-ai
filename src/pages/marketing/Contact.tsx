import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CalendarCheck, CheckCircle2, Clock, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { usePageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { industries } from "@/data/industries";
import { solutions } from "@/data/solutions";
import { cn } from "@/lib/utils";
import { motionEase } from "@/styles/tokens";

const FREE_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "proton.me", "aol.com"];
const BUDGETS = ["< $50k", "$50k – $150k", "$150k – $500k", "$500k +"] as const;

const todayISO = () => new Date().toISOString().slice(0, 10);

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(80, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.")
    .refine((v) => !FREE_DOMAINS.includes(v.split("@")[1]?.toLowerCase() ?? ""), "Please use your business email."),
  company: z.string().trim().min(2, "Company name is required."),
  industry: z.string().min(1, "Select an industry."),
  requirements: z.string().trim().min(30, "Tell us a little more — at least 30 characters.").max(2000, "Please keep it under 2,000 characters."),
  budget: z.enum(BUDGETS, { message: "Choose an estimated budget." }),
  date: z.string().min(1, "Pick a preferred date.")
    .refine((v) => v >= todayISO(), "Choose a date from today onward.")
    .refine((v) => { const d = new Date(v + "T12:00:00").getDay(); return d !== 0 && d !== 6; }, "Consultations run Monday–Friday."),
});
type FormValues = z.infer<typeof schema>;

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "success"; ref: string; values: FormValues };

export default function Contact() {
  usePageMeta("Book a consultation", "Book a consultation with Alder to scope agents, automation and integration for your business.");
  const [params] = useSearchParams();
  const topic = solutions.find((s) => s.id === params.get("topic"));
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [simulateError, setSimulateError] = useState(false);

  const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "", email: "", company: "", industry: "", date: "",
      requirements: topic ? `We're interested in ${topic.title}. ` : "",
    },
  });
  const reqLen = watch("requirements")?.length ?? 0;

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: "idle" });
    await new Promise((r) => setTimeout(r, 1400)); // simulated network
    if (simulateError) {
      setStatus({ kind: "error", message: "Our scheduling service didn't respond. Your details are still here — please try again." });
      toast.error("Submission failed", { description: "Nothing was lost. Try again in a moment." });
      return;
    }
    const ref = `NX-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setStatus({ kind: "success", ref, values });
    toast.success("Consultation requested", { description: `Reference ${ref}` });
  };

  return (
    <section className="relative overflow-hidden pb-28 pt-32 md:pt-40">
      <div className="grid-guides pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_20%_0%,black,transparent)]" aria-hidden />
      <div className="container relative grid gap-14 lg:grid-cols-[1fr_1.35fr]">
        <aside>
          <p className="eyebrow flex items-center gap-3"><span className="h-px w-6 bg-white/20" aria-hidden />Contact</p>
          <h1 className="mt-6 text-display-lg font-medium text-white">Book a consultation.</h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-300">
            Tell us about the process you want to change. A solutions architect — not a sales script — will come prepared with ideas.
          </p>
          <ul className="mt-10 space-y-5">
            {[
              [Clock, "Reply within one business day", "We'll confirm a slot that works across time zones."],
              [CalendarCheck, "45-minute working session", "Walk through your process, data and constraints."],
              [ShieldCheck, "NDA on request", "Share specifics safely from the first call."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Clock;
              return (
                <li key={t as string} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-electric-400"><I className="h-[18px] w-[18px]" /></span>
                  <span><span className="block text-[15px] font-medium text-white">{t as string}</span><span className="text-[14px] text-ink-400">{d as string}</span></span>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 flex items-center gap-2 text-[13px] text-ink-500"><Mail className="h-4 w-4" /> Demo site — submissions are simulated and not sent anywhere.</p>
        </aside>

        <div className="relative rounded-2xl border border-white/[.08] bg-ink-900/80 p-6 backdrop-blur md:p-10">
          <AnimatePresence mode="wait">
            {status.kind === "success" ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: motionEase }}
                className="flex min-h-[520px] flex-col items-center justify-center text-center" role="status">
                <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="relative grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                  <span className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring" aria-hidden />
                  <CheckCircle2 className="relative h-8 w-8" />
                </motion.span>
                <h2 className="mt-6 text-3xl font-medium tracking-[-0.03em] text-white">Request received, {status.values.fullName.split(" ")[0]}.</h2>
                <p className="mt-3 max-w-sm text-[15px] text-ink-400">
                  We'll confirm your session for <span className="text-white">{new Date(status.values.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span> at {status.values.email}.
                </p>
                <p className="mt-6 rounded-full border border-white/10 px-3 py-1 font-mono text-[12px] text-ink-300">Reference {status.ref}</p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                  <Button variant="secondary" onClick={() => { reset(); setStatus({ kind: "idle" }); }}>Submit another request</Button>
                  <Button asChild signal><Link to="/app/dashboard">Explore the console</Link></Button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" aria-label="Consultation request">
                {status.kind === "error" && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-[14px] text-ink-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" /> {status.message}
                  </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField id="fullName" label="Full name" required error={errors.fullName?.message}>
                    <Input autoComplete="name" placeholder="Jordan Lee" {...register("fullName")} />
                  </FormField>
                  <FormField id="email" label="Business email" required error={errors.email?.message}>
                    <Input type="email" autoComplete="email" placeholder="jordan@company.com" {...register("email")} />
                  </FormField>
                  <FormField id="company" label="Company name" required error={errors.company?.message}>
                    <Input autoComplete="organization" placeholder="Company Inc." {...register("company")} />
                  </FormField>
                  <Controller control={control} name="industry" render={({ field }) => (
                    <FormField id="industry" label="Industry" required error={errors.industry?.message}>
                      <Select value={field.value} onValueChange={(v) => { field.onChange(v); field.onBlur(); }}>
                        <SelectTrigger onBlur={field.onBlur}><SelectValue placeholder="Select industry" /></SelectTrigger>
                        <SelectContent>
                          {industries.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  )} />
                </div>

                <FormField id="requirements" label="Project requirements" required error={errors.requirements?.message}
                  hint={`What process, what volume, what systems? ${reqLen}/2000`}>
                  <Textarea rows={5} placeholder="e.g. We handle ~30k support tickets/month in Zendesk and want to automate tier-1 resolution…" {...register("requirements")} />
                </FormField>

                <Controller control={control} name="budget" render={({ field }) => (
                  <fieldset aria-describedby={errors.budget ? "budget-error" : undefined}>
                    <legend className="text-[13px] font-medium text-foreground">Estimated budget<span className="ml-0.5 text-electric-400" aria-hidden>*</span></legend>
                    <div role="radiogroup" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {BUDGETS.map((b) => (
                        <label key={b} className={cn("flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-[13px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                          field.value === b ? "border-electric bg-electric/10 text-white" : "border-input text-ink-300 hover:border-white/20")}>
                          <input type="radio" className="sr-only" name="budget" value={b} checked={field.value === b} onChange={() => field.onChange(b)} onBlur={field.onBlur} />
                          {b}
                        </label>
                      ))}
                    </div>
                    {errors.budget && <p id="budget-error" role="alert" className="mt-2 text-xs text-destructive">{errors.budget.message}</p>}
                  </fieldset>
                )} />

                <FormField id="date" label="Preferred consultation date" required error={errors.date?.message} hint="Monday to Friday">
                  <Input type="date" min={todayISO()} {...register("date")} />
                </FormField>

                <div className="flex flex-col-reverse gap-4 border-t border-white/[.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-500">
                    <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} className="h-3.5 w-3.5 accent-electric" />
                    Demo: simulate a server error
                  </label>
                  <Button type="submit" size="lg" signal={!isSubmitting} disabled={isSubmitting} className="min-w-[220px]">
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Request consultation"}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
