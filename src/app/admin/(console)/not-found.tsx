export default function AdminRecordNotFound() {
  return (
    <div className="border border-line bg-panel p-6">
      <h1 className="font-display text-3xl uppercase tracking-wide">Record not found</h1>
      <p className="mt-3 text-muted">
        That organizer record does not exist, or you do not have access to it.
      </p>
    </div>
  );
}
