import { Component } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/** Keeps one broken page from blanking the whole portal. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Portal page crashed', error, info);
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto mt-10 max-w-lg card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-gold-600">
          <ExclamationTriangleIcon className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-ink-900">Something went wrong on this page</h2>
        <p className="mt-2 text-[0.95rem] text-ink-500">
          Nothing has been lost. Please try again — if it keeps happening, tell your administrator what you were doing.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className="btn btn-primary btn-md" onClick={() => this.setState({ error: null })}>Try again</button>
          <a className="btn btn-outline btn-md" href="/dashboard">Go to home</a>
        </div>
      </div>
    );
  }
}
