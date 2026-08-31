import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="font-pixel text-xs uppercase tracking-[0.24em] text-magenta">
        404
      </p>
      <h1 className="mt-4 font-display text-6xl uppercase tracking-wide">
        This screen does not exist
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        The page you are looking for is not on the map. Head back to the floor.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
    </Container>
  );
}
