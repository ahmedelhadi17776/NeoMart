import React, { useMemo, useState, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../utils/productsStore';
import LazyImage from '../components/LazyImage';

const emptyForm = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
  stock: ''
};

const Admin = () => {
  const [products, setProducts] = useState(() => getProducts());
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const startAdd = useCallback(() => {
    setEditingId('new');
    setForm(emptyForm);
  }, []);

  const startEdit = useCallback((p) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      description: p.description,
      category: p.category,
      image: p.image,
      stock: String(p.stock)
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price) || 0,
      description: form.description.trim(),
      category: form.category.trim() || 'General',
      image: form.image.trim() || 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400&h=400&fit=crop',
      stock: parseInt(form.stock, 10) || 0
    };
    if (!payload.title || payload.price <= 0 || payload.stock < 0) return;

    if (editingId === 'new') {
      const updated = addProduct(payload);
      setProducts(updated);
      cancelEdit();
    } else if (typeof editingId === 'number') {
      const updated = updateProduct(editingId, payload);
      setProducts(updated);
      cancelEdit();
    }
  }, [form, editingId, cancelEdit]);

  const handleDelete = useCallback((id) => {
    // Simple confirm for better UX safety
    const ok = window.confirm('Delete this product permanently?');
    if (!ok) return;
    const updated = deleteProduct(id);
    setProducts(updated);
    if (editingId === id) cancelEdit();
  }, [editingId, cancelEdit]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="gradient-text mb-0">Admin Panel</h2>
        <div className="d-flex align-items-center gap-2">
          <input
            className="form-control form-control-sm"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '220px' }}
          />
          <button className="btn btn-sm btn-primary" onClick={startAdd}>
            <i className="bi bi-plus-lg me-1"></i>
            Add
          </button>
        </div>
      </div>

      {editingId && (
        <div className="card glass-card p-4 card-entry mb-4">
          <h5 className="gradient-text mb-3">{editingId === 'new' ? 'Add New Product' : 'Edit Product'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Title</label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Price</label>
                <input name="price" className="form-control" value={form.price} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Stock</label>
                <input name="stock" className="form-control" value={form.stock} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Category</label>
                <input name="category" className="form-control" value={form.category} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Image URL</label>
                <input name="image" className="form-control" value={form.image} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea name="description" rows="3" className="form-control" value={form.description} onChange={handleChange} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-check2 me-2"></i>
                Save
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="row g-4">
        {filtered.map((p, index) => (
          <div key={p.id} className="col-lg-4 col-md-6">
            <div className="card wishlist-card h-100 card-entry" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="wishlist-image-container position-relative">
                <LazyImage src={p.image} alt={p.title} className="card-img-top wishlist-image" />
                {p.badge && (
                  <span className="badge product-badge bg-primary position-absolute top-0 end-0 m-2">{p.badge}</span>
                )}
                <div
                  className="position-absolute top-0 start-0 m-2 d-flex gap-2"
                  style={{ zIndex: 5 }}
                >
                  <button
                    className="btn btn-light btn-sm rounded-circle"
                    onClick={() => startEdit(p)}
                    title="Edit"
                    aria-label="Edit product"
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 4px 12px var(--shadow)'
                    }}
                  >
                    <i className="bi bi-pencil-fill" style={{ color: 'var(--accent)' }}></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-circle"
                    onClick={() => handleDelete(p.id)}
                    title="Delete"
                    aria-label="Delete product"
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px var(--shadow)'
                    }}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <span className="badge bg-secondary small">{p.category}</span>
                </div>
                <h5 className="card-title mb-2">{p.title}</h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="gradient-text fw-bold fs-5">${p.price}</span>
                  <small className="text-muted">Stock: {p.stock}</small>
                </div>
                <p className="text-muted small mb-0" title={p.description}>
                  {p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;


