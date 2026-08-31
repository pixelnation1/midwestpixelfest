type FormStatusProps = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export function FormStatus({ status, message }: FormStatusProps) {
  if (!message || status === "idle") return null;

  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={
        status === "error"
          ? "border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-gold"
          : "border border-cyan/50 bg-cyan/10 px-4 py-3 text-sm text-cyan"
      }
    >
      {message}
    </p>
  );
}
