package gennext;

public class ProductStockLevel {
    private int productId;
    private String name;
    private int quantity;

    public ProductStockLevel() {
    }

    public ProductStockLevel(int productId, String name, int quantity) {
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
    }

    // Getter and Setter for productId
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    // Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for quantity
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "ProductStockLevel [productId=" + productId + ", name=" + name + ", quantity=" + quantity + "]";
    }
}
