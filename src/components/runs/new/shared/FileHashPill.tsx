import { File } from "lucide-react";

interface FileHashPillProps {
  name: string;
  hash: string;
}

export function FileHashPill({ name, hash }: FileHashPillProps) {
  return (
    <span className="file-hash-pill">
      <File size={12} aria-hidden="true" />
      {name}{" "}
      <span className="subtle">{hash}</span>
    </span>
  );
}
