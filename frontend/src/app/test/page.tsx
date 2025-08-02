'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  rank: number;
  country: string;
  sales: number;
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top Selling Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {products.map(product => (
            <li key={product.id} className="border p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.category} • Rank #{product.rank}</p>
              <p className="text-sm">Country: {product.country}</p>
              <p className="text-sm">Sales: {product.sales.toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
