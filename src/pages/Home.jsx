import React from 'react';

const Home = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4 flux-title">Welcome to FLUX</h1>
          <p className="text-center text-muted flux-subtitle">
            Experience the future of modern shopping
          </p>
          
          {/* Product grid placeholder */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card glass-card p-4 card-entry">
                <h3 className="gradient-text">Products Coming Soon...</h3>
                <p className="text-muted">
                  Product listing will be implemented by Shahd
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
