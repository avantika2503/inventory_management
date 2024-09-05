package gennext;

import java.util.Scanner;
import org.eclipse.jetty.server.Authentication.User;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.InputMismatchException;
import java.util.List;
import static spark.Spark.*;
import com.google.gson.Gson;
import org.mindrot.jbcrypt.BCrypt;

import spark.Spark;

public class App {
    private static Connection con;

    public static void main(String[] args) throws Exception {
        port(4567);
        enableCORS("http://localhost:3000");
        ResultSet rs = null;

        Scanner sc = new Scanner(System.in);
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/inventory_management", "root",
                    "avantikay");
            ProductDAO productDAO = new ProductDAO();
            Gson gson = new Gson();

            System.out.println("Server is running on http://localhost:4567");

            // User registration
            post("/register", (req, res) -> {
                user user = gson.fromJson(req.body(), user.class);
                String hashedPassword = hashPassword(user.getPassword());

                try (PreparedStatement pst = con.prepareStatement(
                        "INSERT INTO users (firstName, lastName, username, phone, password) VALUES (?, ?, ?, ?, ?)")) {
                    pst.setString(1, user.getFirstName());
                    pst.setString(2, user.getLastName());
                    pst.setString(3, user.getUsername());
                    pst.setString(4, user.getPhone());
                    pst.setString(5, hashedPassword);
                    pst.executeUpdate();
                } catch (Exception e) {
                    e.printStackTrace();
                    res.status(500);
                    return "Error registering user";
                }
                return "User registered successfully";
            });

            post("/login", (req, res) -> {
                user user = gson.fromJson(req.body(), user.class);

                if (authenticateAdmin(user.getUsername(), user.getPassword())) {
                    res.status(200);
                    return "Admin login successful";
                } else if (authenticateUser(user.getUsername(), user.getPassword(), con)) {
                    res.status(200);
                    return "User login successful";
                } else {
                    res.status(401); // Unauthorized
                    return "Invalid username or password";
                }
            });

            get("/favicon.ico", (req, res) -> {
                res.status(204);
                return "";
            });

            before("/add-product", "/update-product", (req, res) -> {
                if (!isAuthenticated(req)) {
                    res.status(403);
                    res.body("Admin credentials required");
                    halt();
                }
            });

            post("/products", (req, res) -> {
                Product product = gson.fromJson(req.body(), Product.class);
                productDAO.addProduct(product);
                res.status(201);
                return "Product added successfully";
            });

            get("/products", (req, res) -> {
                res.type("application/json");
                return gson.toJson(productDAO.viewProducts());
            });

            put("/products/:id", (req, res) -> {
                String productId = req.params("id");
                Product product = gson.fromJson(req.body(), Product.class);
                System.out.println("Updating product with ID: " + productId);
                System.out.println("Received product data: " + product);
                product.setproductId(productId);
                productDAO.updateProduct(product);
                return "Product updated successfully";
            });

            delete("/products/:id", (req, res) -> {
                String productId = req.params("id");
                productDAO.deleteProduct(productId);
                return "Product deleted successfully";
            });

            // User routes
            before("/inventory", (req, res) -> {
                if (!isAuthenticated(req)) {
                    res.status(401);
                    res.body("User authentication required");
                    halt();
                }
            });

            get("/products/:id", (request, response) -> {
                String productId = request.params(":id");
                Product product = productDAO.getProductById(productId);
                if (product != null) {
                    response.status(200);
                    response.type("application/json");
                    return gson.toJson(product);
                } else {
                    response.status(404);
                    return "Product not found";
                }
            });

            Spark.init();

            System.out.println("Enter your username" + "\n" + "USER:");
            String username = sc.nextLine();
            System.out.println("");
            System.out.println("Welcome," + " " + username + "!" + "\n");

            System.out.println("Enter password: " + "\n");
            String password = sc.nextLine();

            boolean isAdmin = authenticateAdmin(username, password);
            boolean isUser = authenticateUser(username, password, con);

            if (isAdmin) {
                // Admin menu
                handleAdminMenu(sc, productDAO);
            } else if (isUser) {
                // User menu
                handleUserMenu(sc, productDAO);
            } else {
                System.out.println("Invalid credentials.");
            }

            con.close();
        } catch (

        Exception e) {
            System.out.println(e);
        }
    }

    private static void enableCORS(final String origin) {
        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers",
                    "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
            res.header("Access-Control-Allow-Credentials", "true");
        });

        options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });
    }

    private static void handleAdminMenu(Scanner sc, ProductDAO productDAO) {
        boolean login = true;
        System.out.println("\n" + "ADMIN LOGIN SUCCESFUL!");
        System.out.println("CHOOSE FUNCTION:" + "\n" +
                "Press 1 to VIEW Products" + "\n" +
                "Press 2 to ADD Products" + "\n" +
                "Press 3 to UPDATE Products" + "\n" + "Press 4 to DELETE Products" + "\n" +
                "Press 0 to logout");

        while (login) {
            int N = sc.nextInt();
            sc.nextLine();

            switch (N) {

                // VIEW Call
                case 1:
                    List<Product> products = productDAO.viewProducts();
                    for (Product product : products) {
                        System.out.println("ID: " + product.getproductId() +
                                ", Name: " + product.getName() +
                                ", Description: " + product.getDescription() +
                                ", Category: " + product.getCategory() +
                                ", Price: " + product.getPrice() +
                                ", Quantity: " + product.getQuantity() +
                                ", Lifecycle Stage: " + product.getLifecycleStage() +
                                ", Supplier ID: " + product.getSupplierId());
                    }
                    break;

                // ADD call
                case 2:
                    System.out.println("Enter product details:");
                    System.out.print("Product ID: ");
                    String productId = sc.nextLine();
                    System.out.print("Name: ");
                    String name = sc.nextLine();
                    System.out.print("Description: ");
                    String description = sc.nextLine();
                    System.out.print("Category: ");
                    String category = sc.nextLine();
                    System.out.print("Price: ");
                    double price = sc.nextDouble();
                    System.out.print("Quantity: ");
                    int quantity = sc.nextInt();
                    sc.nextLine(); // Consume newline left-over
                    System.out.print("Lifecycle Stage: ");
                    String lifecycleStage = sc.nextLine();
                    System.out.print("Supplier ID: ");
                    String supplierId = sc.nextLine();

                    Product newProduct = new Product(productId, name, description, category, price, quantity,
                            lifecycleStage, supplierId);
                    productDAO.addProduct(newProduct);
                    break;

                // UPDATE call
                case 3:

                    System.out.println("Enter product details to update:");
                    System.out.print("Product ID: ");
                    String updateProductId = sc.nextLine();
                    System.out.print("Name: ");
                    String updateName = sc.nextLine();
                    System.out.print("Description: ");
                    String updateDescription = sc.nextLine();
                    System.out.print("Category: ");
                    String updateCategory = sc.nextLine();
                    System.out.print("Price: ");
                    double updatePrice = sc.nextDouble();
                    System.out.print("Quantity: ");
                    int updateQuantity = sc.nextInt();
                    sc.nextLine(); // Consume newline left-over
                    System.out.print("Lifecycle Stage: ");
                    String updateLifecycleStage = sc.nextLine();
                    System.out.print("Supplier ID: ");
                    String updateSupplierId = sc.nextLine();

                    Product updateProduct = new Product(updateProductId, updateName, updateDescription,
                            updateCategory, updatePrice, updateQuantity, updateLifecycleStage, updateSupplierId);
                    productDAO.updateProduct(updateProduct);
                    break;

                // DELETE call
                case 4:
                    System.out.print("Enter product ID to delete: ");
                    String deleteProductId = sc.nextLine();
                    productDAO.deleteProduct(deleteProductId);
                    System.out.print("Product deleted Succesfully ");
                    break;

                case 0:
                    System.out.println("Logging out..");
                    login = false;
                    break;

                default:
                    System.out.println("Invalid choice, please try again.");
            }
        }

        System.out.println("You are logged out");
    }

    // User view stock levels
    private static void handleUserMenu(Scanner sc, ProductDAO productDAO) {
        boolean userLoggedIn = true;
        System.out.println("\n" + "USER LOGIN SUCCESFUL!");
        System.out.println("Press 1 to VIEW Product Stock Levels\n Press 2 to Logout");

        while (userLoggedIn) {
            try {
                int choice = sc.nextInt();
                sc.nextLine();

                switch (choice) {
                    case 1:
                        List<ProductStockLevel> stockLevels = productDAO.viewProductStockLevelsForUsers();
                        for (ProductStockLevel stockLevel : stockLevels) {
                            System.out.println("Product ID: " + stockLevel.getProductId() +
                                    ", Name: " + stockLevel.getName() +
                                    ", Quantity: " + stockLevel.getQuantity());
                        }
                        break;
                    case 2:
                        System.out.println("Logging out...");
                        userLoggedIn = false;
                        break;
                    default:
                        System.out.println("Invalid choice, please try again.");
                }

            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a number.");
                sc.nextLine();
            }
        }
        System.out.println("You are logged out");
    }

    private static boolean authenticateAdmin(String username, String password) {
        String adminUsername = "avantikayadav";
        String adminPassword = "123456";
        return username.equals(adminUsername) && password.equals(adminPassword);
    }

    private static boolean authenticateUser(String username, String password, Connection con) {
        try {
            String query = "SELECT password FROM users WHERE username = ?";
            PreparedStatement stmt = con.prepareStatement(query);
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String hashedPassword = rs.getString("password");
                return verifyPassword(password, hashedPassword); // Verify the entered password with the hashed one
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    private static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    private static boolean verifyPassword(String password, String hashedPassword) {
        return BCrypt.checkpw(password, hashedPassword);
    }

    private static boolean isAuthenticated(spark.Request req) {
        String authHeader = req.headers("Authorization");
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return false;
        }

        String base64Credentials = authHeader.substring("Basic".length()).trim();
        String credentials = new String(Base64.getDecoder().decode(base64Credentials));
        String[] values = credentials.split(":", 2);

        return authenticateAdmin(values[0], values[1]) || authenticateUser(values[0], values[1], con);
    }
}
