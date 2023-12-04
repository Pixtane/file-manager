import { Component, ReactNode, ErrorInfo } from "react";
import errorImage from "./assets/alert_big2.svg";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to a service like Sentry, Rollbar, etc.
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ hasError: true });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render the fallback UI
      return (
        <div className="position-fixed container justify-content-center align-items-center top-50 start-50 translate-middle text-white">
          <img src={errorImage} height="300em"></img>
          <div className="fs-1 fw-bold text-danger">Error!</div>
          <div className="fs-2">Something went wrong!</div>
          <button
            className="btn btn-outline-primary m-4"
            onClick={() => (window.location.href = "/")}
            type="button"
          >
            Main page
          </button>
        </div>
      );
    }

    // Render the child components as usual
    return this.props.children;
  }
}

export default ErrorBoundary;
