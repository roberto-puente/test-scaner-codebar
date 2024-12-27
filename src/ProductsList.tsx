import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

interface Product {
  id: number;
  name: string;
  barcode: string | null;
}

const initialProducts: Product[] = [
  { id: 1, name: "Producto A", barcode: null },
  { id: 2, name: "Producto B", barcode: null },
  { id: 3, name: "Producto C", barcode: null },
];

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const saveBarcode = (barcode: string) => {
    if (activeProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === activeProduct.id ? { ...product, barcode } : product
        )
      );
      setActiveProduct(null);
    }
  };

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - Código: {product.barcode || "No escaneado"}
            <button onClick={() => setActiveProduct(product)}>Escanear</button>
          </li>
        ))}
      </ul>
      {activeProduct && (
        <BarcodeScanner
          onSave={saveBarcode}
          onCancel={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsList;
