from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, session
import json
import os
from passlib.hash import bcrypt

app = Flask(__name__, static_folder='renderer', static_url_path='', template_folder='renderer')
app.secret_key = 'your_secret_key'  # کلید مخفی برای session (حتماً یک مقدار امن برای پروژه واقعی انتخاب کنید)
USERS_FILE = 'users.json'
PRODUCTS_FILE = 'products.json'

# تابع برای بارگیری اطلاعات کاربران از فایل JSON
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    else:
        return {}

# تابع برای ذخیره اطلاعات کاربران در فایل JSON (در صورت نیاز)
def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    else:
        return []

def save_products(products):
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(products, f, indent=4)

# Endpoint برای دریافت لیست همه کالاها
@app.route('/api/products', methods=['GET'])
def get_products():
    products = load_products()
    return jsonify(products)

# Endpoint برای ایجاد یک کالای جدید
@app.route('/api/products', methods=['POST'])
def add_product():
    product = request.get_json()
    name = product.get('name')
    price = product.get('price')
    if not name or price is None:
        return jsonify({'error': 'نام و قیمت کالا الزامی است'}), 400
    products = load_products()
    new_id = max([p['id'] for p in products] or [0]) + 1
    product['id'] = new_id
    products.append(product)
    save_products(products)
    return jsonify(product), 201

# Endpoint برای دریافت اطلاعات یک کالای خاص
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p['id'] == product_id), None)
    if product is None:
        return jsonify({'error': 'کالا یافت نشد'}), 404
    return jsonify(product)

# Endpoint برای به‌روزرسانی اطلاعات یک کالا
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product_data = request.get_json()
    name = product_data.get('name')
    price = product_data.get('price')
    if not name or price is None:
        return jsonify({'error': 'نام و قیمت کالا الزامی است'}), 400
    products = load_products()
    updated = False
    for product in products:
        if product['id'] == product_id:
            product['name'] = name
            product['price'] = price
            updated = True
            break
    if updated:
        save_products(products)
        return jsonify({'id': product_id, 'name': name, 'price': price})
    else:
        return jsonify({'error': 'کالا یافت نشد'}), 404

# Endpoint برای حذف یک کالا
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    products = load_products()
    initial_len = len(products)
    products = [p for p in products if p['id'] != product_id]
    if len(products) < initial_len:
        save_products(products)
        return jsonify({'message': 'کالا با موفقیت حذف شد'})
    else:
        return jsonify({'error': 'کالا یافت نشد'}), 404

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    users = load_users()
    print(f"اطلاعات کاربران بارگیری شده: {users}")  # چاپ اطلاعات کاربران بارگیری شده

       

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            hashed_password = users[username]
            print(f"رمز عبور هش شده برای {username}: {hashed_password}")  # چاپ رمز عبور هش شده از فایل

            if bcrypt.verify(password, hashed_password):
                print("ورود موفقیت آمیز بود!")  # چاپ پیام در صورت ورود موفقیت آمیز

                session['logged_in'] = True
                return redirect(url_for('serve_dashboard'))
            else:
                error = 'رمز عبور اشتباه است.'
                print("رمز عبور اشتباه است.")  # چاپ پیام در صورت اشتباه بودن رمز عبور

        else:
            error = 'نام کاربری اشتباه است.'
            print("نام کاربری اشتباه است.")  # چاپ پیام در صورت اشتباه بودن نام کاربری

    return send_from_directory('.', 'login.html')

@app.route('/')
def serve_dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return send_from_directory('.', 'dashboard.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/submenus/<path:filename>')
def serve_submenus(filename):
    return send_from_directory('submenus', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

if __name__ == '__main__':
    app.run(debug=True, port=8000)