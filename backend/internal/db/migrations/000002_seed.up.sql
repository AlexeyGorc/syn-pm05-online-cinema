INSERT INTO movies (title, description, genre, duration_min, age_rating, poster_url) VALUES
    ('Интерстеллар', 'Команда исследователей путешествует сквозь червоточину в поисках нового дома для человечества.', 'Фантастика', 169, '12+', '/posters/interstellar.webp'),
    ('Зелёная миля', 'Надзиратель тюрьмы знакомится с осуждённым, обладающим необъяснимым даром исцеления.', 'Драма', 189, '16+', '/posters/green_mile.webp'),
    ('Начало', 'Вор, способный проникать в сны людей, получает задание внедрить идею в сознание жертвы.', 'Триллер', 148, '16+', '/posters/inception.webp'),
    ('Король Лев', 'История молодого льва Симбы, которому предстоит занять место отца на троне саванны.', 'Мультфильм', 88, '6+', '/posters/lion_king.webp');

-- Пароль: admin123 (bcrypt)
INSERT INTO users (login, password_hash, full_name, phone, email, role_id) VALUES
    ('admin', '$2a$10$45yKx5xeBY96TEwtB.4B3OBNzy9ojtHbCBNU4DHX7YYD5G6XdvfmG', 'Администратор', '8(900)000-00-00', 'admin@cinema.local', 1),
    ('user1', '$2a$10$45yKx5xeBY96TEwtB.4B3OBNzy9ojtHbCBNU4DHX7YYD5G6XdvfmG', 'Иван Иванов', '8(900)111-11-11', 'user1@cinema.local', 2);