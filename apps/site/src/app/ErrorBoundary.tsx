import { Component, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Last-resort error screen in FJ voice; offers a reload. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="placeholder-page" style={{ minHeight: '100dvh', alignContent: 'center' }}>
        <span className="notfound-code">Something broke</span>
        <h1>That wasn’t supposed to happen.</h1>
        <p>The page hit an unexpected error. A reload usually clears it.</p>
        <pre className="error-detail">{this.state.error.message}</pre>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    );
  }
}
