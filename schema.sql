DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

-- می‌توانید چند نمونه کالا هم اضافه کنید
INSERT INTO products (name, price) VALUES ('کالای نمونه 1', 10000);
INSERT INTO products (name, price) VALUES ('خدمت نمونه 2', 25000);