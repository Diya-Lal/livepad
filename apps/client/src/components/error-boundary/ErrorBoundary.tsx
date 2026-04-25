import { Component, type ReactNode, type ErrorInfo } from 'react';
import { FallbackUI } from './FallbackUI';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <FallbackUI error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}
