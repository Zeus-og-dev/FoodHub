CREATE TABLE restaurants (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    cuisine VARCHAR(100) NOT NULL,
    image_url TEXT,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 0
        CHECK (rating >= 0 AND rating <= 5),
    delivery_time_minutes INTEGER NOT NULL DEFAULT 30
        CHECK (delivery_time_minutes > 0),
    delivery_fee_paise INTEGER NOT NULL DEFAULT 0
        CHECK (delivery_fee_paise >= 0),
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restaurants_open
    ON restaurants (is_open);

INSERT INTO restaurants (
    id, name, slug, description, cuisine,
    image_url, rating, delivery_time_minutes,
    delivery_fee_paise, is_open
)
VALUES
(
    '11111111-1111-4111-8111-111111111111',
    'Bombay Burger Co.',
    'bombay-burger-co',
    'Juicy burgers and crispy sides.',
    'Burgers',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    4.5, 25, 3000, TRUE
),
(
    '22222222-2222-4222-8222-222222222222',
    'Spice Route Kitchen',
    'spice-route-kitchen',
    'Comforting Indian meals and biryani.',
    'Indian',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    4.6, 35, 2500, TRUE
),
(
    '33333333-3333-4333-8333-333333333333',
    'Napoli Pizza House',
    'napoli-pizza-house',
    'Handcrafted pizzas and Italian classics.',
    'Pizza',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    4.4, 30, 2000, TRUE
);