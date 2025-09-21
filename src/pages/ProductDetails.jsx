import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>Product Details</h1>
          <p className="text-muted">Product ID: {id}</p>
          
          <div className="card glass-card p-4 card-entry">
            <h4 className="gradient-text">Coming Soon...</h4>
            <p className="text-muted">
              Product details page will be implemented by Mohamed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
