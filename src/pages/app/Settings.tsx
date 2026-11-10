import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Building2, KeyRound, Laptop, Moon, Palette, RotateCcw, Sun, User } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MODELS } from "@/data/appMock";
import { cn } from "@/lib/utils";
import { useAppStore, type Settings as S } from "@/store/AppStore";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: KeyRound },
] as const;

export default function Settings() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") ?? "profile") as (typeof SECTIONS)[number]["id"];
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, workspace and preferences." />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Settings sections" className="-mx-1 flex gap-1 overflow-x-auto px-1 lg:flex-col [scrollbar-width:none]">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setParams({ tab: s.id }, { replace: true })} aria-current={tab === s.id ? "page" : undefined}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] font-medium transition-colors", tab === s.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
              <s.icon className="h-4 w-4" />{s.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0 max-w-3xl">
          {tab === "profile" && <Profile />}
          {tab === "workspace" && <Workspace />}
          {tab === "notifications" && <Notifications />}
          {tab === "appearance" && <Appearance />}
          {tab === "security" && <Security />}
        </div>
      </div>
    </>
  );
}

function Section({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <Card>
      <div className="border-b p-5 md:p-6"><h2 className="text-[15px] font-semibold">{title}</h2><p className="mt-1 text-[13px] text-muted-foreground">{description}</p></div>
      <div className="space-y-5 p-5 md:p-6">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t bg-muted/20 px-5 py-3 md:px-6">{footer}</div>}
    </Card>
  );
}

function Row({ label, hint, children, htmlFor }: { label: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div><label htmlFor={htmlFor} className="text-[13.5px] font-medium">{label}</label>{hint && <p className="text-[12.5px] text-muted-foreground">{hint}</p>}</div>
      {children}
    </div>
  );
}

/* --------------------------------- Profile -------------------------------- */
const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  title: z.string().trim().max(60, "Keep it under 60 characters."),
  timezone: z.string(),
});
function Profile() {
  const { settings, setSettings } = useAppStore();
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<S["profile"]>({ resolver: zodResolver(profileSchema), defaultValues: settings.profile });
  const submit = (v: S["profile"]) => { setSettings({ ...settings, profile: v }); reset(v); toast.success("Profile updated"); };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Section title="Profile" description="How you appear to teammates across the workspace."
        footer={<><Button type="button" variant="ghost" disabled={!isDirty} onClick={() => reset()}>Discard</Button><Button type="submit" variant="brand" disabled={!isDirty}>Save changes</Button></>}>
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-electric to-violet text-lg font-semibold text-white" aria-hidden>{settings.profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
          <div><p className="text-[13.5px] font-medium">Avatar</p><p className="text-[12.5px] text-muted-foreground">Generated from your initials.</p></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="p-name" label="Full name" required error={errors.name?.message}><Input {...register("name")} /></FormField>
          <FormField id="p-email" label="Email" required error={errors.email?.message}><Input type="email" {...register("email")} /></FormField>
          <FormField id="p-title" label="Job title" error={errors.title?.message}><Input {...register("title")} /></FormField>
          <Controller control={control} name="timezone" render={({ field }) => (
            <FormField id="p-tz" label="Time zone">
              <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Asia/Kolkata", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Singapore"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </FormField>
          )} />
        </div>
      </Section>
    </form>
  );
}

/* -------------------------------- Workspace ------------------------------- */
const wsSchema = z.object({
  name: z.string().trim().min(2, "Workspace name is required."),
  slug: z.string().trim().regex(/^[a-z0-9-]{3,32}$/, "3–32 lowercase letters, numbers or hyphens."),
  region: z.string(),
  defaultModel: z.string(),
});
function Workspace() {
  const { settings, setSettings, resetDemo } = useAppStore();
  const [confirm, setConfirm] = useState(false);
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<S["workspace"]>({ resolver: zodResolver(wsSchema), defaultValues: settings.workspace });
  const submit = (v: S["workspace"]) => { setSettings({ ...settings, workspace: v }); reset(v); toast.success("Workspace settings saved"); };
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <Section title="Workspace" description="Settings that apply to everyone in this workspace."
          footer={<><Button type="button" variant="ghost" disabled={!isDirty} onClick={() => reset()}>Discard</Button><Button type="submit" variant="brand" disabled={!isDirty}>Save changes</Button></>}>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="w-name" label="Workspace name" required error={errors.name?.message}><Input {...register("name")} /></FormField>
            <FormField id="w-slug" label="URL slug" required error={errors.slug?.message} hint="console.alder.example/your-slug"><Input {...register("slug")} /></FormField>
            <Controller control={control} name="region" render={({ field }) => (
              <FormField id="w-region" label="Data region" hint="Where prompts, outputs and logs are stored.">
                <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[["ap-south-1", "India (Mumbai)"], ["eu-west-1", "EU (Ireland)"], ["us-east-1", "US (Virginia)"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select>
              </FormField>
            )} />
            <Controller control={control} name="defaultModel" render={({ field }) => (
              <FormField id="w-model" label="Default model">
                <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MODELS.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent></Select>
              </FormField>
            )} />
          </div>
        </Section>
      </form>
      <Card className="border-destructive/30">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div><h2 className="text-[15px] font-semibold">Reset demo data</h2><p className="mt-1 text-[13px] text-muted-foreground">Restore agents, workflows, logs and settings to their original state.</p></div>
          <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => setConfirm(true)}><RotateCcw className="h-4 w-4" />Reset demo</Button>
        </div>
      </Card>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset all demo data?</DialogTitle><DialogDescription>Anything you've created or changed in this browser will be replaced with the original sample data.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="destructive" onClick={() => { resetDemo(); setConfirm(false); toast.success("Demo data restored"); }}>Reset everything</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Notifications ----------------------------- */
function Notifications() {
  const { settings, setSettings } = useAppStore();
  const n = settings.notifications;
  const update = (patch: Partial<S["notifications"]>, msg = "Notification preferences saved") => { setSettings({ ...settings, notifications: { ...n, ...patch } }); toast.success(msg); };
  const items: [keyof S["notifications"], string, string][] = [
    ["agentFailures", "Agent failures", "When an agent errors or a run fails."],
    ["approvals", "Approval requests", "When an action is waiting for your sign-off."],
    ["weeklyDigest", "Weekly digest", "A Monday summary of usage, cost and outcomes."],
    ["productUpdates", "Product updates", "New features and platform announcements."],
  ];
  return (
    <Section title="Notifications" description="Choose what you hear about and where. Changes save instantly.">
      {items.map(([k, l, h]) => <Row key={k} label={l} hint={h} htmlFor={`n-${k}`}><Switch id={`n-${k}`} checked={n[k] as boolean} onCheckedChange={(c) => update({ [k]: c })} /></Row>)}
      <div className="border-t pt-5">
        <Row label="Delivery channel" hint="Where alerts are sent.">
          <Select value={n.channel} onValueChange={(v) => update({ channel: v as S["notifications"]["channel"] })}>
            <SelectTrigger className="w-36" aria-label="Delivery channel"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="slack">Slack</SelectItem><SelectItem value="both">Email & Slack</SelectItem></SelectContent>
          </Select>
        </Row>
      </div>
    </Section>
  );
}

/* ------------------------------- Appearance ------------------------------- */
function Appearance() {
  const { settings, setSettings } = useAppStore();
  const a = settings.appearance;
  const update = (patch: Partial<S["appearance"]>) => setSettings({ ...settings, appearance: { ...a, ...patch } });
  return (
    <Section title="Appearance" description="Personalise how the console looks on this device.">
      <fieldset>
        <legend className="mb-3 text-[13.5px] font-medium">Theme</legend>
        <div role="radiogroup" className="grid grid-cols-3 gap-3">
          {([["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "System", Laptop]] as const).map(([v, l, I]) => (
            <button key={v} role="radio" aria-checked={a.theme === v} onClick={() => update({ theme: v })}
              className={cn("overflow-hidden rounded-xl border text-left transition-colors", a.theme === v ? "border-primary ring-2 ring-primary/25" : "hover:border-primary/40")}>
              <div className={cn("h-16 p-2", v === "light" ? "bg-[#F5F6F9]" : v === "dark" ? "bg-[#090D16]" : "bg-gradient-to-r from-[#F5F6F9] from-50% to-[#090D16] to-50%")}>
                <div className={cn("h-2 w-10 rounded", v === "light" ? "bg-[#DCE0E8]" : "bg-[#1B2436]")} />
                <div className="mt-1.5 h-2 w-16 rounded bg-[#4C7DFF]" />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium"><I className="h-3.5 w-3.5" />{l}</div>
            </button>
          ))}
        </div>
      </fieldset>
      <Row label="Compact density" hint="Tighter navigation and table spacing." htmlFor="ap-density">
        <Switch id="ap-density" checked={a.density === "compact"} onCheckedChange={(c) => update({ density: c ? "compact" : "comfortable" })} />
      </Row>
      <Row label="Reduce motion" hint="Speed up workflow execution animations." htmlFor="ap-motion">
        <Switch id="ap-motion" checked={a.reduceMotion} onCheckedChange={(c) => update({ reduceMotion: c })} />
      </Row>
    </Section>
  );
}

/* -------------------------------- Security -------------------------------- */
function Security() {
  const { settings, setSettings } = useAppStore();
  const s = settings.security;
  const [mfaConfirm, setMfaConfirm] = useState(false);
  const update = (patch: Partial<S["security"]>, msg = "Security settings updated") => { setSettings({ ...settings, security: { ...s, ...patch } }); toast.success(msg); };
  const sessions = [
    ["Chrome · macOS", "Bengaluru, IN", "Current session"],
    ["Safari · iPhone", "Bengaluru, IN", "2 hours ago"],
    ["Edge · Windows", "Mumbai, IN", "3 days ago"],
  ];
  const [active, setActive] = useState(sessions);
  return (
    <div className="space-y-6">
      <Section title="Security" description="Protect access to your workspace.">
        <Row label="Two-factor authentication" hint={s.mfa ? "Enabled — authenticator app" : "Add a second step at sign-in."} htmlFor="s-mfa">
          <Switch id="s-mfa" checked={s.mfa} onCheckedChange={(c) => (c ? update({ mfa: true }, "Two-factor enabled") : setMfaConfirm(true))} />
        </Row>
        <Row label="Session timeout" hint="Sign out after inactivity.">
          <Select value={s.sessionTimeout} onValueChange={(v) => update({ sessionTimeout: v })}>
            <SelectTrigger className="w-32" aria-label="Session timeout"><SelectValue /></SelectTrigger>
            <SelectContent>{["30m", "1h", "8h", "24h"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Row>
        <Row label="IP allowlist" hint="Only allow access from approved networks." htmlFor="s-ip"><Switch id="s-ip" checked={s.ipAllowlist} onCheckedChange={(c) => update({ ipAllowlist: c })} /></Row>
        <Row label="Audit log export" hint="Stream audit events to your SIEM." htmlFor="s-audit"><Switch id="s-audit" checked={s.auditExport} onCheckedChange={(c) => update({ auditExport: c })} /></Row>
      </Section>
      <Section title="Active sessions" description="Devices currently signed in to this account.">
        <ul className="divide-y">
          {active.map(([d, loc, when]) => (
            <li key={d} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div><p className="text-[13.5px] font-medium">{d}</p><p className="text-[12.5px] text-muted-foreground">{loc} · {when}</p></div>
              {when === "Current session" ? <span className="text-[12px] text-success">This device</span> :
                <Button variant="ghost" size="sm" onClick={() => { setActive((a) => a.filter((x) => x[0] !== d)); toast.success(`Signed out ${d}`); }}>Revoke</Button>}
            </li>
          ))}
        </ul>
      </Section>
      <Dialog open={mfaConfirm} onOpenChange={setMfaConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Turn off two-factor authentication?</DialogTitle><DialogDescription>Your account will be protected by your password only. Workspace admins may require 2FA.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setMfaConfirm(false)}>Keep it on</Button><Button variant="destructive" onClick={() => { update({ mfa: false }, "Two-factor disabled"); setMfaConfirm(false); }}>Turn off</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
