export type Language = 'uz' | 'ru';

export const translations = {
  uz: {
    // Nav
    shop: 'SHOP',
    book: 'BOOK',
    cart: 'CART',
    me: 'ME',
    
    // Catalog
    all: 'Hammasi',
    cleansing: 'Tozalash',
    moisturizing: 'Namlantirish',
    face: 'Yuz',
    body: 'Tana',
    promo: 'Aksiya',
    // Original category keys for database compatibility
    'Hammasi': 'Hammasi',
    'Tozalash': 'Tozalash',
    'Namlantirish': 'Namlantirish',
    'Yuz': 'Yuz',
    'Tana': 'Tana',
    'Aksiya': 'Aksiya',
    categories: 'Kategoriyalar',
    search_placeholder: 'Mahsulot qidirish...',
    add_to_cart: 'Savatga qo\'shish',
    in_stock: 'Omborda bor',
    out_of_stock: 'Tugagan',
    
    // Cart
    your_cart: 'Sizning savatingiz',
    cart_empty: 'Savat hozircha bo\'sh',
    total_sum: 'Jami Summa:',
    finish_purchase: 'XARIDNI YAKUNLASH',
    order_success: 'Buyurtmangiz qabul qilindi! Admin tez orada bog\'lanadi.',
    order_error: 'Buyurtmada xatolik yuz berdi.',
    
    // Booking
    select_service: 'Xizmatni Tanlang',
    select_date: 'Sana va vaqtni tanlang',
    fill_details: 'Ma\'lumotlaringizni kiriting',
    your_name: 'Ismingiz',
    your_phone: 'Telefon raqamingiz',
    your_note: 'Qo\'shimcha izoh (ixtiyoriy)',
    confirm_booking: 'BRON QILISHNI TASDIQLASH',
    booking_success: 'Tabriklaymiz! Siz muvaffaqiyatli ro\'yxatdan o\'tdingiz.',
    booking_error: 'Band qilishda xatolik yuz berdi.',
    back: 'Orqaga',
    continue: 'Davom etish',
    
    // Profile
    profile: 'Profil',
    admin_panel: 'Admin Panel',
    language: 'Tilni tanlang',
    guest_user: 'Mehmon',
    login_required: 'Tarixni ko\'rish uchun Telegram orqali kiring',
    my_history: 'Mening tarixim',
    no_history: 'Sizda hali amallar tarixi yo\'q',
    
    // Statuses
    pending: 'Kutilmoqda',
    confirmed: 'Tasdiqlandi',
    completed: 'Yakunlandi',
    cancelled: 'Bekor qilindi'
  },
  ru: {
    // Nav
    shop: 'МАГАЗИН',
    book: 'ЗАПИСЬ',
    cart: 'КОРЗИНА',
    me: 'ПРОФИЛЬ',
    
    // Catalog
    all: 'Все',
    cleansing: 'Очищение',
    moisturizing: 'Увлажнение',
    face: 'Лицо',
    body: 'Тело',
    promo: 'Акция',
    // Original category keys for database compatibility
    'Hammasi': 'Все',
    'Tozalash': 'Очищение',
    'Namlantirish': 'Увлажнение',
    'Yuz': 'Лицо',
    'Tana': 'Тело',
    'Aksiya': 'Акция',
    categories: 'Категории',
    search_placeholder: 'Поиск товаров...',
    add_to_cart: 'В корзину',
    in_stock: 'В наличии',
    out_of_stock: 'Нет в наличии',
    
    // Cart
    your_cart: 'Ваша корзина',
    cart_empty: 'Корзина пока пуста',
    total_sum: 'Итоговая сумма:',
    finish_purchase: 'ЗАВЕРШИТЬ ПОКУПКУ',
    order_success: 'Ваш заказ принят! Админ скоро свяжется с вами.',
    order_error: 'Произошла ошибка при заказе.',
    
    // Booking
    select_service: 'Выберите услугу',
    select_date: 'Выберите дату и время',
    fill_details: 'Введите ваши данные',
    your_name: 'Ваше имя',
    your_phone: 'Ваш номер телефона',
    your_note: 'Дополнительный комментарий (опционально)',
    confirm_booking: 'ПОДТВЕРДИТЬ ЗАПИСЬ',
    booking_success: 'Поздравляем! Вы успешно записались.',
    booking_error: 'Произошла ошибка при бронировании.',
    back: 'Назад',
    continue: 'Продолжить',
    
    // Profile
    profile: 'Профиль',
    admin_panel: 'Админ панель',
    language: 'Выберите язык',
    guest_user: 'Гость',
    login_required: 'Войдите через Telegram, чтобы увидеть историю',
    my_history: 'Моя история',
    no_history: 'У вас пока нет истории операций',
    
    // Statuses
    pending: 'Ожидание',
    confirmed: 'Подтверждено',
    completed: 'Завершено',
    cancelled: 'Отменено'
  }
};
