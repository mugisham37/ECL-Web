import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TableCellErrorProps {
  message?: string;
}

export function TableCellError({ message }: TableCellErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1.5 mt-2 overflow-hidden"
          style={{ color: "var(--danger)", fontSize: "var(--fs-caption)" }}
          role="alert"
        >
          <AlertCircle className="size-3.5 flex-none" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
