import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

interface RememberMeProps {
  defaultChecked?: boolean;
}

export function RememberMe({ defaultChecked = false }: RememberMeProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="remember"
        name="remember"
        defaultChecked={defaultChecked}
      />
      <Label
        htmlFor="remember"
        className="text-sm cursor-pointer select-none"
        style={{ color: "var(--text-muted)", fontWeight: 400 }}
      >
        Remember me
      </Label>
    </div>
  );
}
