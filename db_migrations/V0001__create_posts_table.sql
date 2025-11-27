-- Create posts table for PLATORS blog
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('video', 'photo', 'text')),
    image_url TEXT,
    video_url TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Insert sample posts
INSERT INTO posts (title, excerpt, content, category, image_url, published) VALUES
('Будущее цифровых технологий', 
 'Исследуем последние тренды в мире технологий и их влияние на нашу жизнь',
 'Цифровые технологии развиваются с невероятной скоростью. Искусственный интеллект, блокчейн, квантовые вычисления - все это меняет наш мир. В этой статье мы рассмотрим ключевые тренды и их влияние на будущее.',
 'video',
 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/b1c16cbe-6fb1-4189-b902-22402c7cfb82.jpg',
 true),

('Киберпанк эстетика в дизайне', 
 'Как неоновые цвета и футуристические формы меняют визуальную культуру',
 'Неоновое свечение, темные цвета, футуристические формы - киберпанк эстетика становится все более популярной в современном дизайне. Давайте разберемся почему.',
 'photo',
 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/9a2dc9fe-1f8a-408f-b8a5-3581a8dcba56.jpg',
 true),

('Искусственный интеллект и творчество', 
 'Размышления о том, как ИИ меняет подход к созданию контента',
 'Может ли искусственный интеллект быть творческим? Этот вопрос волнует многих. В статье мы исследуем возможности ИИ в создании контента и его влияние на творческие профессии.',
 'text',
 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/8f41a62e-bc72-4ab7-a74c-df9bb6aa79b9.jpg',
 true);