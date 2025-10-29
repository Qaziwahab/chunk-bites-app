import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

/**
 * A component to display a single product card.
 *
 * @param {object} props
 * @param {object} props.product - The product object to display.
 * @param {string} props.product._id - The product ID.
 * @param {string} props.product.name - The product name.
 * @param {string} props.product.description - The product description.
 * @param {number} props.product.price - The product price.
 * @param {string} props.product.image - The URL for the product image.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  if (!product) {
    return null; // Don't render if no product is passed
  }

  const handleAddToCart = () => {
    // Adds one of this item to the cart
    addToCart(product, 1);
    // You could show a "Added!" toast/notification here
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden
                 transition-all duration-300 ease-in-out
                 hover:shadow-2xl hover:-translate-y-1.5"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          className="w-full h-56 object-cover"
          src={
            product.image ||
            'https://placehold.co/600x400/f87171/white?text=Yum!'
          }
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src =
              'https://placehold.co/600x400/f87171/white?text=Yum!';
          }}
        />
        {/* You could add a tag here like "Bestseller" */}
        {/* <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
          Bestseller
        </span> */}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 h-10 overflow-hidden">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-orange-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-orange-100 text-orange-600 font-semibold rounded-full
                       text-sm transition-all duration-300
                       hover:bg-orange-500 hover:text-white hover:scale-105"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

