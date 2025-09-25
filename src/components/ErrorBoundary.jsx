import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card glass-card p-5 text-center">
                  <div className="error-icon mb-4">
                    <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
                  </div>
                  
                  <h2 className="gradient-text mb-3">Oops! Something went wrong</h2>
                  
                  <p className="text-muted mb-4 fs-5">
                    We're sorry, but something unexpected happened. 
                    Don't worry, our team has been notified and is working on a fix.
                  </p>

                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="alert alert-danger text-start mb-4">
                      <h6 className="alert-heading">Error Details (Development Only)</h6>
                      <details>
                        <summary className="mb-2">Click to expand error details</summary>
                        <pre className="mb-2" style={{ fontSize: '0.875rem' }}>
                          {this.state.error.toString()}
                        </pre>
                        {this.state.errorInfo && (
                          <pre style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        )}
                      </details>
                    </div>
                  )}

                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={this.handleRetry}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    
                    <button 
                      className="btn btn-outline-primary btn-lg"
                      onClick={this.handleReload}
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Reload Page
                    </button>
                    
                    <button 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => window.history.back()}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>

                  {this.state.retryCount > 0 && (
                    <div className="mt-4">
                      <small className="text-muted">
                        Retry attempt: {this.state.retryCount}
                      </small>
                    </div>
                  )}

                  <div className="mt-5">
                    <h6 className="text-muted mb-3">Need help?</h6>
                    <div className="d-flex gap-3 justify-content-center">
                      <a href="/" className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-house me-1"></i>
                        Home
                      </a>
                      <a href="/contact" className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-envelope me-1"></i>
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
