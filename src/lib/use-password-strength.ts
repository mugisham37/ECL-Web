export interface PasswordStrengthResult {
  score: number;
  label: "" | "Weak" | "Fair" | "Strong";
  labelClass: "" | "weak" | "fair" | "strong";
  rules: {
    len8: boolean;
    mix: boolean;
    name: boolean;
    len12: boolean;
  };
}

export function scorePassword(
  password: string,
  forbidden: string[] = []
): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: "",
      labelClass: "",
      rules: { len8: false, mix: false, name: false, len12: false },
    };
  }

  const pw = password;
  const rules = {
    len8: pw.length >= 8,
    mix: /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw),
    name:
      forbidden.length === 0 ||
      !forbidden.some(
        (f) => f && f.length > 2 && pw.toLowerCase().includes(f.toLowerCase())
      ),
    len12: pw.length >= 12,
  };

  let s = 0;
  if (rules.len8) s++;
  if (rules.len12) s++;
  if (rules.mix) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;

  // Penalise if forbidden terms found
  if (
    forbidden.some(
      (f) => f && f.length > 2 && pw.toLowerCase().includes(f.toLowerCase())
    )
  ) {
    s = Math.min(s, 1);
  }

  const clamped = Math.min(Math.max(s, 0), 5);

  let label: PasswordStrengthResult["label"] = "";
  let labelClass: PasswordStrengthResult["labelClass"] = "";
  if (clamped >= 1 && clamped <= 2) {
    label = "Weak";
    labelClass = "weak";
  } else if (clamped === 3) {
    label = "Fair";
    labelClass = "fair";
  } else if (clamped >= 4) {
    label = "Strong";
    labelClass = "strong";
  }

  return { score: clamped, label, labelClass, rules };
}
