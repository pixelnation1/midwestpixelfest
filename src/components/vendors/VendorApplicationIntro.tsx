export function VendorApplicationIntro() {
  return (
    <section
      className="border border-line bg-panel p-6 sm:p-8"
      aria-labelledby="application-intro-heading"
    >
      <h2
        id="application-intro-heading"
        className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl"
      >
        Before you apply
      </h2>
      <p className="mt-4 max-w-3xl text-muted">
        Submitting an application does not guarantee acceptance. Applications
        are reviewed for event fit, available space, merchandise mix, and
        overall vendor-floor balance.
      </p>
      <ul className="mt-4 max-w-3xl space-y-2 text-paper">
        <li>There is no application fee.</li>
        <li>
          Approved applicants will receive payment instructions separately.
        </li>
        <li>
          A booth is not secured until the application is approved and payment
          is completed by the required deadline.
        </li>
      </ul>
      <p className="mt-4 max-w-3xl text-sm text-muted">
        This application is not the final vendor agreement. Space requests are
        preferences and are subject to approval and availability.
      </p>
    </section>
  );
}
