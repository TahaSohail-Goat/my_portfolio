import { ArrowLink } from "@/components/studio/Shell";
export default function NotFound() {
  return (
    <section className="page-header not-found">
      <span className="eyebrow">404 / UNCHARTED TERRITORY</span>
      <h1>
        A little
        <br />
        <em>off course.</em>
      </h1>
      <p className="page-intro">
        This page isn’t part of the map. There’s plenty to explore back at the
        beginning.
      </p>
      <ArrowLink href="/">Back to the index</ArrowLink>
    </section>
  );
}
