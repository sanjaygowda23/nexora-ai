import { Component, type ReactNode } from "react";
import { ErrorState } from "@/components/ui/states";

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="container py-24">
          <ErrorState
            title="This view failed to load"
            description={this.state.error.message}
            onRetry={() => { this.setState({ error: null }); window.location.reload(); }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
