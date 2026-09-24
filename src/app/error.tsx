"use client";
import { StatePanel } from "@/components/state-panel";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="shell page-space">
      <StatePanel
        title="That didn't load"
        description="Please try again. If the issue continues, return to explore."
      />
      <div className="error-actions">
        <button className="button button-primary" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
