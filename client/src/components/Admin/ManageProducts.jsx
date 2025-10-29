import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgers',
    imageUrl: '',
    calories: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'Burgers',
        imageUrl: product.imageUrl || '',
        calories: product.calories || '',
      });
    } else {
      setFormData({ name: '', description: '', price: '', category: 'Burgers', imageUrl: '', calories: '' });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg mb-8">
      <h3 className="text-xl font-heading">{product ? 'Edit Product' : 'Add New Product'}</h3>
      {/* ... (Form fields for name, description, price, etc.) ... */}
       <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option>Burgers</option>
            <option>Chicken</option>
            <option>Pizza</option>
            <option>Salads</option>
            <option>Sides</option>
          </select>
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">Calories</label>
        <input type="number" name="calories" value={formData.calories} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div className="flex gap-4">
        <Button type="submit">{product ? 'Update' : 'Create'}</Button>
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </form>
  );
};


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const { data } = await api.put(`/products/${editingProduct._id}`, formData);
        setProducts(products.map(p => (p._id === data._id ? data : p)));
        toast.success('Product updated!');
      } else {
        // Create new product
        const { data } = await api.post('/products', formData);
        setProducts([data, ...products]);
        toast.success('Product created!');
      }
      setEditingProduct(null);
      setIsFormVisible(false);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const showAddForm = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };
  
  const showEditForm = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const cancelForm = () => {
    setEditingProduct(null);
    setIsFormVisible(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-heading">Manage Products</h2>
        {!isFormVisible && (
          <Button onClick={showAddForm}>Add New Product</Button>
        )}
      </div>

      {isFormVisible && (
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={cancelForm} />
      )}

      {/* Product List */}
      <div className="space-y-4">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showEditForm(product)} className="px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-medium">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
