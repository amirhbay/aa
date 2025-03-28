$(document).ready(function() {
    // اضافه کردن رویداد کلیک برای دکمه خروج در نوار کناری
    $('#logout-sidebar').on('click', function(event) {
        event.preventDefault(); // جلوگیری از رفتن به لینک پیش‌فرض (#)
        window.location.href = '/logout'; // فعلاً فقط به صفحه لاگین برمی‌گردیم
    });

    // اضافه کردن رویداد کلیک برای دکمه خروج در نوار بالایی
    $('#logout-header').on('click', function() {
        window.location.href = '/logout'; // فعلاً فقط به صفحه لاگین برمی‌گردیم
    });

    // رویداد کلیک برای سربرگ اطلاعات پایه
    $('#basic-info-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/basic-info-submenus.html', function() {
        console.log('زیرمنوی اطلاعات پایه لود شد.'); // اضافه کردن این خط
            // حالا که زیرمنو لود شده، رویداد کلیک برای "کالا و خدمات" رو هندل می‌کنیم
            $('#main-content').on('click', '#product-services-link', function(event) {
                event.preventDefault();
                $("#define-product-dialog").dialog("open");
            });
        });
    });

    // رویداد کلیک برای سربرگ خرید و فروش
    $('#sales-purchases-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/sales-purchases-submenus.html');
    });

    // رویداد کلیک برای سربرگ دریافت و پرداخت
    $('#receipts-payments-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/receipts-payments-submenus.html');
    });

    // رویداد کلیک برای سربرگ گزارشات
    $('#reports-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/reports-submenus.html');
    });

    // رویداد کلیک برای سربرگ انبار
    $('#inventory-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/inventory-submenus.html');
    });

    // رویداد کلیک برای سربرگ مشتریان
    $('#customers-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/customers-submenus.html');
    });

    // رویداد کلیک برای سربرگ تنظیمات
    $('#settings-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/settings-submenus.html');
    });

    // رویداد کلیک برای سربرگ پشتیبان گیری
    $('#backup-link').on('click', function(event) {
        event.preventDefault();
        $('#main-content').load('../submenus/backup-submenus.html');
    });

    // инициализировать کردن پنجره شناور اصلی "مدیریت کالا و خدمات"
    $("#define-product-dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 900, // افزایش عرض پنجره برای جا دادن فرم کامل
        buttons: {
            "بستن": function() {
                $(this).dialog("close");
            }
        },
        open: function(event, ui) {
            loadProductList().then(data => displayProductList(data));
        }
    });

    // инициализировать کردن پنجره شناور داخلی "تعریف کالای جدید" (فرم ساده)
    $("#define-new-product-inner-dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        buttons: {
            "ذخیره": function() {
                $('#define-new-product-form').trigger('submit'); // Trigger submit on the form
            },
            "انصراف": function() {
                $(this).dialog("close");
            }
        }
    });

    // رویداد سابمیت برای فرم تعریف کالای جدید (فرم ساده)
    $('#define-new-product-inner-dialog').on('submit', '#define-new-product-form', function(event) {
        event.preventDefault(); // جلوگیری از سابمیت پیش‌فرض
        console.log('تابع saveNewProduct فراخوانی شد');
        saveNewProduct();
        $("#define-new-product-inner-dialog").dialog("close");
    });

    // رویداد کلیک برای دکمه "تعریف کالا" جهت باز کردن پنجره داخلی تعریف (فرم ساده)
    $('#define-product-dialog').on('click', '#open-define-new-product-dialog', function() {
        $("#define-new-product-inner-dialog").dialog("open");
        $('#new-product-name').val(''); // پاک کردن فیلدها
        $('#new-product-price').val('');
    });

    // инициализировать کردن پنجره شناور داخلی "تعریف کالای جدید (کامل)"
     // инициализировать کردن پنجره شناور داخلی "تعریف کالای جدید (کامل)"
    $("#define-detailed-new-product-dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 950, // افزایش بیشتر عرض برای جا دادن بهتر فرم کامل
        buttons: {
            "ذخیره": function() {
                $('#define-detailed-new-product-form').trigger('submit'); // Trigger submit on the form
            },
            "انصراف": function() {
                $(this).dialog("close");
            }
        }
    });


    // رویداد کلیک برای دکمه "تعریف کالای جدید (کامل)" جهت باز کردن پنجره داخلی تعریف (فرم کامل)
    $('#define-product-dialog').on('click', '#open-detailed-define-new-product-dialog', function() {
        loadProductList().then(products => {
            const nextCode = getNextProductCode(products);
            $('#new-product-code').val(nextCode);
            $("#define-detailed-new-product-dialog").dialog("open");
            $('#define-detailed-new-product-form')[0].reset(); // پاک کردن تمام فیلدهای فرم (به جز کد کالا)
            // تنظیم دستی مقدار کد کالا در صورت نیاز
        });
    });

    function saveDetailedNewProduct() {
        const name = $('#new-product-name').val();
        const code = $('#new-product-code').val();
        const barcode = $('#new-product-barcode').val();
        const latin_name = $('#new-product-latin-name').val();
        const category = $('#new-product-category').val();
        const main_unit = $('#new-product-main-unit').val();
        const manufacturer = $('#new-product-manufacturer').val();
        const description = $('#new-product-description').val();
        const purchase_price = $('#new-product-purchase-price').val();
        const invoice_title = $('#new-product-invoice-title').val();
        const price = $('#new-product-price').val();

        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                code: code,
                barcode: barcode,
                latin_name: latin_name,
                category: category,
                main_unit: main_unit,
                manufacturer: manufacturer,
                description: description,
                purchase_price: purchase_price,
                invoice_title: invoice_title,
                price: price
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('کالای جدید (کامل) ذخیره شد:', data);
            loadProductList().then(data => displayProductList(data)); // به‌روزرسانی لیست بعد از ذخیره
            $("#define-detailed-new-product-dialog").dialog("close");
        })
        .catch(error => console.error('خطا در ذخیره کالای جدید (کامل):', error));
    }

    // инициализировать کردن پنجره شناور داخلی "ویرایش کالا"
    $("#edit-product-inner-dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        buttons: {
            "ذخیره تغییرات": function() {
                $('#edit-product-form').trigger('submit'); // Trigger submit on the form
            },
            "انصراف": function() {
                $(this).dialog("close");
            }
        }
    });

    // رویداد سابمیت برای فرم ویرایش کالا
    $('#edit-product-inner-dialog').on('submit', '#edit-product-form', function(event) {
        event.preventDefault(); // جلوگیری از سابمیت پیش‌فرض
        console.log('تابع saveEditedProduct فراخوانی شد');
        saveEditedProduct();
        $(this).dialog("close");
    });

    // رویداد کلیک برای دکمه های "ویرایش" جهت باز کردن پنجره داخلی ویرایش
    $('#define-product-dialog').on('click', '.open-edit-product-dialog', function() {
        var productId = $(this).data('product-id');
        loadProductForEdit(productId);
        $("#edit-product-inner-dialog").dialog("open");
    });

    // رویداد کلیک برای دکمه های "حذف"
    $('#define-product-dialog').on('click', '.delete-product-button', function() {
        var productId = $(this).data('product-id');
        if (confirm('آیا مطمئن هستید که می‌خواهید این کالا را حذف کنید؟')) {
            deleteProduct(productId);
        }
    });

    function loadProductList() {
        return fetch('/api/products')
            .then(response => response.json());
            // دیگر نیازی به فراخوانی displayProductList در اینجا نیست
    }

    function displayProductList(products) {
        const productListBody = $('#product-list-body');
        productListBody.empty();
        products.forEach(product => {
            const row = `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td><button class="btn btn-sm btn-warning open-edit-product-dialog" data-product-id="${product.id}">ویرایش</button></td>
                    <td><button class="btn btn-sm btn-danger delete-product-button" data-product-id="${product.id}">حذف</button></td>
                </tr>
            `;
            productListBody.append(row);
        });
    }

    function saveNewProduct() {
        const name = $('#new-product-name').val();
        const price = $('#new-product-price').val();
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, price: price })
        })
        .then(response => response.json())
        .then(data => {
            console.log('کالای جدید ذخیره شد:', data);
            loadProductList().then(data => displayProductList(data)); // به‌روزرسانی لیست بعد از ذخیره
            $("#define-new-product-inner-dialog").dialog("close");
        })
        .catch(error => console.error('خطا در ذخیره کالای جدید:', error));
    }

    function loadProductForEdit(productId) {
        fetch(`/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                $('#edit-product-id').val(product.id);
                $('#edit-product-name').val(product.name);
                $('#edit-product-price').val(product.price);
            })
            .catch(error => console.error('خطا در دریافت اطلاعات کالا برای ویرایش:', error));
    }

    function saveEditedProduct() {
        const id = $('#edit-product-id').val();
        const name = $('#edit-product-name').val();
        const price = $('#edit-product-price').val();
        fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, price: price })
        })
        .then(response => response.json())
        .then(data => {
            console.log('کالا ویرایش شد:', data);
            loadProductList().then(data => displayProductList(data)); // به‌روزرسانی لیست بعد از ویرایش
        })
        .catch(error => console.error('خطا در ویرایش کالا:', error));
    }

    function deleteProduct(productId) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('کالا حذف شد:', data);
            loadProductList().then(data => displayProductList(data)); // به‌روزرسانی لیست بعد از حذف
        })
        .catch(error => console.error('خطا در حذف کالا:', error));
    }



const incomeExpenseChart = document.getElementById('income-expense-chart').getContext('2d');
const myChart = new Chart(incomeExpenseChart, {
    type: 'pie',
    data: {
        labels: ['درآمد', 'هزینه'],
        datasets: [{
            label: 'درآمد در مقابل هزینه',
            data: [70, 30],
            backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});
});

function getNextProductCode(products) {
    if (!products || products.length === 0) {
        return 1;
    }
    const codes = products.map(product => parseInt(product.code));
    const maxCode = Math.max(...codes);
    return maxCode + 1;
}