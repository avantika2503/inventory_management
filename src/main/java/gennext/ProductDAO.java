package gennext;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {
    private static final String URL = "jdbc:mysql://localhost:3306/inventory_management";
    private static final String USER = "root";
    private static final String PASSWORD = "avantikay";

    private Connection connect() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    // Add
    public void addProduct(Product product) {
        String insertProductSQL = "INSERT INTO products (product_id, name, description, category, price, quantity, lifecycle_stage, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String insertSupplierSQL = "INSERT INTO suppliers (supplier_id, name, contact) VALUES (?, ?, ?)";

        try (Connection conn = connect();
                PreparedStatement productStmt = conn.prepareStatement(insertProductSQL);
                PreparedStatement checkSupplierStmt = conn
                        .prepareStatement("SELECT COUNT(*) FROM suppliers WHERE supplier_id = ?")) {
            conn.setAutoCommit(true);

            checkSupplierStmt.setString(1, product.getSupplierId());
            ResultSet rs = checkSupplierStmt.executeQuery();
            rs.next();
            if (rs.getInt(1) == 0) {

                try (PreparedStatement insertSupplierStmt = conn.prepareStatement(insertSupplierSQL)) {
                    insertSupplierStmt.setString(1, product.getSupplierId());
                    insertSupplierStmt.setString(2, "Unknown Supplier"); // Default supplier name
                    insertSupplierStmt.setString(3, "Unknown Contact"); // Default contact
                    insertSupplierStmt.executeUpdate();
                    System.out.println("Inserted new supplier with ID: " + product.getSupplierId());
                } catch (SQLException e) {
                    System.out.println("Error inserting new supplier: " + e.getMessage());
                    return;
                }
            } else {
                System.out.println("Supplier ID " + product.getSupplierId() + " already exists.");
            }

            try {
                productStmt.setString(1, product.getproductId());
                productStmt.setString(2, product.getName());
                productStmt.setString(3, product.getDescription());
                productStmt.setString(4, product.getCategory());
                productStmt.setDouble(5, product.getPrice());
                productStmt.setInt(6, product.getQuantity());
                productStmt.setString(7, product.getLifecycleStage());
                productStmt.setString(8, product.getSupplierId());

                int affectedRows = productStmt.executeUpdate();
                if (affectedRows > 0) {
                    System.out.println("Product added successfully: " + product.getName());
                } else {
                    System.out.println("Failed to add product: " + product.getName());
                }
            } catch (SQLException e) {
                System.out.println("Error inserting product: " + e.getMessage());
            }

        } catch (SQLException e) {
            System.out.println("Error connecting to the database: " + e.getMessage());
        }
    }

    // VIEW
    public List<Product> viewProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT * FROM products";

        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/inventory_management", "root",
                "avantikay");
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Product product = new Product(
                        Integer.toString(rs.getInt("product_id")), // Convert int to String
                        rs.getString("name"),
                        rs.getString("description"),
                        rs.getString("category"),
                        rs.getDouble("price"),
                        rs.getInt("quantity"),
                        rs.getString("lifecycle_stage"),
                        rs.getString("supplier_id"));
                products.add(product);
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return products;
    }

    // UPDATE
    public void updateProduct(Product product) {
        String sql = "UPDATE products SET product_id = ?, name = ?, description = ?, category = ?, price = ?, quantity = ?, lifecycle_stage = ?, supplier_id = ? WHERE product_id = ?";

        try (Connection conn = connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, product.getproductId());
            pstmt.setString(2, product.getName());
            pstmt.setString(3, product.getDescription());
            pstmt.setString(4, product.getCategory());
            pstmt.setDouble(5, product.getPrice());
            pstmt.setInt(6, product.getQuantity());
            pstmt.setString(7, product.getLifecycleStage());
            pstmt.setString(8, product.getSupplierId());
            pstmt.setString(9, product.getproductId());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                System.out.println("Product updated successfully");
            } else {
                System.out.println("Product update failed");
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE
    public void deleteProduct(String productId) {
        String sql = "DELETE FROM products WHERE product_id = ?";

        try (Connection conn = connect(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, productId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Inventory_Tracking
    public List<ProductStockLevel> viewProductStockLevelsForUsers() {
        List<ProductStockLevel> stockLevels = new ArrayList<>();

        try (Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/inventory_management", "root",
                "avantikay");
                Statement stmt = con.createStatement()) {

            ResultSet rs = stmt.executeQuery("SELECT product_id, name, quantity FROM products");

            while (rs.next()) {
                int productId = rs.getInt("product_id");
                String name = rs.getString("name");
                int quantity = rs.getInt("quantity");

                stockLevels.add(new ProductStockLevel(productId, name, quantity));
            }
        } catch (SQLException e) {
            System.out.println("Error while retrieving stock levels: " + e.getMessage());
        }
        return stockLevels;
    }

    public Product getProductById(String productId) throws SQLException {
        String query = "SELECT * FROM products WHERE product_id = ?";
        Product product = null;

        try (Connection con = connect();
                PreparedStatement preparedStatement = con.prepareStatement(query)) {

            preparedStatement.setString(1, productId);
            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()) {
                product = new Product(
                        rs.getString("product_id"),
                        rs.getString("name"),
                        rs.getString("description"),
                        rs.getString("category"),
                        rs.getDouble("price"),
                        rs.getInt("quantity"),
                        rs.getString("lifecycle_stage"),
                        rs.getString("supplier_id"));
            }
        } catch (SQLException e) {
            System.out.println("Error while retrieving product by ID: " + e.getMessage());
            throw e; // Rethrow the exception to handle it appropriately in the calling method
        }

        return product;
    }

}
