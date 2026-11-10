import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AGENT_TOOLS, DEPARTMENTS, MODELS, type Agent } from "@/data/appMock";
import { cn } from "@/lib/utils";

export const agentSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters.").max(32, "Keep it under 32 characters."),
  role: z.string().trim().min(3, "Describe the role in a few words."),
  description: z.string().trim().min(10, "Add a short description (10+ characters).").max(300),
  department: z.string().min(1, "Select a department."),
  model: z.enum(["alder-reason-l", "alder-swift-s", "alder-vision-m"]),
  temperature: z.number().min(0).max(1),
  approvalRequired: z.boolean(),
  tools: z.array(z.string()).min(1, "Grant at least one tool."),
  status: z.enum(["active", "paused", "error", "draft"]),
});
export type AgentFormValues = z.infer<typeof agentSchema>;

export const emptyAgent: AgentFormValues = {
  name: "", role: "", description: "", department: "", model: "alder-reason-l", temperature: 0.2, approvalRequired: true, tools: [], status: "draft",
};

/** Reusable agent configuration form — used by the create dialog and the agent detail page. */
export function AgentForm({ defaultValues, submitLabel, onSubmit, onCancel, takenNames = [] }: {
  defaultValues: AgentFormValues; submitLabel: string; onSubmit: (v: AgentFormValues) => void; onCancel?: () => void; takenNames?: string[];
}) {
  const schema = agentSchema.refine((v) => !takenNames.map((n) => n.toLowerCase()).includes(v.name.trim().toLowerCase()), { path: ["name"], message: "An agent with this name already exists." });
  const { register, control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<AgentFormValues>({ resolver: zodResolver(schema), defaultValues });
  const temp = watch("temperature");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="ag-name" label="Agent name" required error={errors.name?.message}><Input placeholder="e.g. Atlas" {...register("name")} /></FormField>
        <FormField id="ag-role" label="Role" required error={errors.role?.message}><Input placeholder="e.g. Tier-1 Support Resolver" {...register("role")} /></FormField>
      </div>
      <FormField id="ag-desc" label="Description" required error={errors.description?.message}>
        <Textarea rows={3} className="min-h-[80px]" placeholder="What does this agent do, and when should it hand off?" {...register("description")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller control={control} name="department" render={({ field }) => (
          <FormField id="ag-dept" label="Department" required error={errors.department?.message}>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
        )} />
        <Controller control={control} name="model" render={({ field }) => (
          <FormField id="ag-model" label="Model" required>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MODELS.map((m) => <SelectItem key={m.id} value={m.id}>{m.label} — {m.hint}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
        )} />
      </div>

      <Controller control={control} name="temperature" render={({ field }) => (
        <div className="space-y-2">
          <div className="flex justify-between text-[13px]"><label htmlFor="ag-temp" className="font-medium">Creativity (temperature)</label><span className="font-mono text-muted-foreground">{temp.toFixed(2)}</span></div>
          <input id="ag-temp" type="range" min={0} max={1} step={0.05} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]" />
          <div className="flex justify-between text-[11px] text-muted-foreground"><span>Precise</span><span>Creative</span></div>
        </div>
      )} />

      <Controller control={control} name="tools" render={({ field }) => (
        <fieldset>
          <legend className="text-[13px] font-medium">Tool access<span className="ml-0.5 text-primary" aria-hidden>*</span></legend>
          <p className="mt-1 text-xs text-muted-foreground">Agents can only call the tools you grant here.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AGENT_TOOLS.map((t) => {
              const on = field.value.includes(t);
              return (
                <button type="button" key={t} aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== t) : [...field.value, t])}
                  className={cn("rounded-full border px-3 py-1.5 text-[12.5px] transition-colors", on ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
                  {t}
                </button>
              );
            })}
          </div>
          {errors.tools && <p role="alert" className="mt-2 text-xs text-destructive">{errors.tools.message}</p>}
        </fieldset>
      )} />

      <Controller control={control} name="approvalRequired" render={({ field }) => (
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div><label htmlFor="ag-approval" className="text-[13px] font-medium">Require human approval for actions</label><p className="text-xs text-muted-foreground">Write actions pause until a reviewer approves them.</p></div>
          <Switch id="ag-approval" checked={field.value} onCheckedChange={field.onChange} />
        </div>
      )} />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="brand" disabled={!isDirty && submitLabel.startsWith("Save")}>{submitLabel}</Button>
      </div>
    </form>
  );
}

export const toFormValues = (a: Agent): AgentFormValues => ({
  name: a.name, role: a.role, description: a.description, department: a.department, model: a.model,
  temperature: a.temperature, approvalRequired: a.approvalRequired, tools: a.tools, status: a.status,
});
