import React, { Profiler } from 'react';

// Performance monitoring utilities
export const performanceMetrics = {
  measurements: [],
  isEnabled: process.env.NODE_ENV === 'development'
};

// Profiler callback for performance monitoring
export const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
  if (!performanceMetrics.isEnabled) return;

  const measurement = {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions: interactions ? Array.from(interactions) : [],
    timestamp: Date.now()
  };

  performanceMetrics.measurements.push(measurement);

  // Log performance warnings
  if (actualDuration > 16) { // More than one frame (16ms at 60fps)
    console.warn(`⚠️ Performance Warning: ${id} took ${actualDuration.toFixed(2)}ms to render (${phase})`);
  }

  // Log to console in development
  console.log(`📊 Profiler: ${id} (${phase}) - ${actualDuration.toFixed(2)}ms`, {
    actualDuration: `${actualDuration.toFixed(2)}ms`,
    baseDuration: `${baseDuration.toFixed(2)}ms`,
    startTime: `${startTime.toFixed(2)}ms`,
    commitTime: `${commitTime.toFixed(2)}ms`
  });
};

// Higher-order component for wrapping components with Profiler
export const withProfiler = (Component, id) => {
  const ProfiledComponent = (props) => {
    if (!performanceMetrics.isEnabled) {
      return React.createElement(Component, props);
    }

    return React.createElement(
      Profiler,
      { id, onRender: onRenderCallback },
      React.createElement(Component, props)
    );
  };

  ProfiledComponent.displayName = `withProfiler(${Component.displayName || Component.name})`;
  return ProfiledComponent;
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startTime = React.useRef(0);

  React.useEffect(() => {
    if (!performanceMetrics.isEnabled) return;

    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime.current - startTime.current;
      
      if (duration > 16) {
        console.warn(`⚠️ ${componentName} mount/unmount took ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  const measureRender = React.useCallback((renderFn) => {
    if (!performanceMetrics.isEnabled) return renderFn();

    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    if (end - start > 16) {
      console.warn(`⚠️ ${componentName} render took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }, [componentName]);

  return { measureRender };
};

// Performance reporting utilities
export const getPerformanceReport = () => {
  if (!performanceMetrics.isEnabled) {
    return { message: 'Performance monitoring is disabled in production' };
  }

  const measurements = performanceMetrics.measurements;
  const slowComponents = measurements.filter(m => m.actualDuration > 16);
  const averageRenderTime = measurements.reduce((sum, m) => sum + m.actualDuration, 0) / measurements.length;

  return {
    totalMeasurements: measurements.length,
    slowComponents: slowComponents.length,
    averageRenderTime: `${averageRenderTime.toFixed(2)}ms`,
    slowestComponent: measurements.reduce((max, m) => 
      m.actualDuration > max.actualDuration ? m : max, 
      { actualDuration: 0, id: 'none' }
    ),
    measurements: measurements.slice(-10) // Last 10 measurements
  };
};

// Clear performance data
export const clearPerformanceData = () => {
  performanceMetrics.measurements = [];
};

// Performance-aware component wrapper
export const PerformanceWrapper = ({ children, id, ...props }) => {
  if (!performanceMetrics.isEnabled) {
    return children;
  }

  return React.createElement(
    Profiler,
    { id, onRender: onRenderCallback, ...props },
    children
  );
};

// Development-only performance panel
export const PerformancePanel = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [report, setReport] = React.useState(null);

  React.useEffect(() => {
    if (!performanceMetrics.isEnabled) return;

    const interval = setInterval(() => {
      setReport(getPerformanceReport());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!performanceMetrics.isEnabled) return null;

  return React.createElement(
    'div',
    { className: 'performance-panel' },
    React.createElement(
      'button',
      {
        className: 'btn btn-outline-secondary btn-sm position-fixed',
        style: {
          bottom: '80px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.2rem'
        },
        onClick: () => setIsOpen(!isOpen),
        title: 'Performance Monitor'
      },
      '📊'
    ),
    isOpen && report && React.createElement(
      'div',
      {
        className: 'card position-fixed',
        style: {
          bottom: '140px',
          right: '20px',
          width: '300px',
          zIndex: 1000,
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          maxHeight: '400px',
          overflow: 'auto'
        }
      },
      React.createElement(
        'div',
        { className: 'card-body p-3' },
        React.createElement(
          'div',
          { className: 'd-flex justify-content-between align-items-center mb-3' },
          React.createElement('h6', { className: 'card-title mb-0' }, 'Performance Monitor'),
          React.createElement(
            'button',
            {
              className: 'btn btn-sm btn-outline-danger',
              onClick: clearPerformanceData,
              title: 'Clear Data'
            },
            'Clear'
          )
        ),
        React.createElement(
          'div',
          { className: 'small' },
          React.createElement('div', { className: 'mb-2' }, 
            React.createElement('strong', null, 'Total Measurements: '), 
            report.totalMeasurements
          ),
          React.createElement('div', { className: 'mb-2' }, 
            React.createElement('strong', null, 'Slow Components: '), 
            report.slowComponents
          ),
          React.createElement('div', { className: 'mb-2' }, 
            React.createElement('strong', null, 'Avg Render Time: '), 
            report.averageRenderTime
          ),
          React.createElement('div', { className: 'mb-3' }, 
            React.createElement('strong', null, 'Slowest: '), 
            report.slowestComponent.id, 
            ' (', 
            report.slowestComponent.actualDuration.toFixed(2), 
            'ms)'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('strong', null, 'Recent Measurements:'),
            React.createElement(
              'div',
              { className: 'mt-2', style: { fontSize: '0.75rem' } },
              report.measurements.map((m, i) =>
                React.createElement(
                  'div',
                  { key: i, className: 'd-flex justify-content-between' },
                  React.createElement('span', null, m.id),
                  React.createElement(
                    'span',
                    { className: m.actualDuration > 16 ? 'text-warning' : 'text-success' },
                    m.actualDuration.toFixed(1) + 'ms'
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};
