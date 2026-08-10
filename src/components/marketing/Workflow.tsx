import { marketingCopy } from "@/content/marketing";

export function Workflow() {
  const { workflow } = marketingCopy;

  return (
    <section className="section workflow-section" id="how-it-works" aria-labelledby="workflow-title">
      <div className="shell">
        <div className="section-heading product-heading" data-reveal>
          <p className="eyebrow">{workflow.eyebrow}</p>
          <h2 id="workflow-title">{workflow.title}</h2>
          <p>{workflow.description}</p>
        </div>
        <div className="workflow-grid product-workflow">
          {workflow.steps.map((step, index) => (
            <article key={step.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="workflow-icon" aria-hidden="true">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
