import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  isAuthenticated: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, isAuthenticated, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="product-card">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
      <h3>{product.name}</h3>
      <p className="product-card__category">{product.category}</p>
      {product.description && <p className="product-card__description">{product.description}</p>}
      <p className="product-card__price">
        {product.currency} {product.price}
      </p>
      <p className="product-card__stock">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>
      {isAuthenticated && (
        <div className="product-card__actions">
          <button onClick={() => onEdit(product)}>Edit</button>
          <button onClick={() => onDelete(product)}>Delete</button>
        </div>
      )}
    </div>
  );
}
