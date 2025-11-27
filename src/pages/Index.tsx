import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: 'video' | 'photo' | 'text';
  image?: string;
  date: string;
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Будущее цифровых технологий',
    excerpt: 'Исследуем последние тренды в мире технологий и их влияние на нашу жизнь',
    category: 'video',
    image: 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/b1c16cbe-6fb1-4189-b902-22402c7cfb82.jpg',
    date: '2024-11-25'
  },
  {
    id: 2,
    title: 'Киберпанк эстетика в дизайне',
    excerpt: 'Как неоновые цвета и футуристические формы меняют визуальную культуру',
    category: 'photo',
    image: 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/9a2dc9fe-1f8a-408f-b8a5-3581a8dcba56.jpg',
    date: '2024-11-24'
  },
  {
    id: 3,
    title: 'Искусственный интеллект и творчество',
    excerpt: 'Размышления о том, как ИИ меняет подход к созданию контента',
    category: 'text',
    image: 'https://cdn.poehali.dev/projects/49399c0d-2028-450c-9f8a-60114f05f74f/files/8f41a62e-bc72-4ab7-a74c-df9bb6aa79b9.jpg',
    date: '2024-11-23'
  },
  {
    id: 4,
    title: 'Электронная музыка будущего',
    excerpt: 'Обзор новых направлений в электронной музыке',
    category: 'video',
    date: '2024-11-22'
  },
  {
    id: 5,
    title: 'Неоновые города',
    excerpt: 'Фотогалерея футуристических городских пейзажей',
    category: 'photo',
    date: '2024-11-21'
  },
  {
    id: 6,
    title: 'Философия киберпространства',
    excerpt: 'Статья о культуре и философии цифровой эпохи',
    category: 'text',
    date: '2024-11-20'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredPosts = activeTab === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'video': return 'Video';
      case 'photo': return 'Image';
      case 'text': return 'FileText';
      default: return 'Circle';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border electric-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/files/fc6f1bc8-3b31-4de1-bb92-c63aa0fe7f91.png" 
                alt="PLATORS" 
                className="h-12 w-auto neon-glow"
              />
            </div>
            <nav className="flex gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors neon-text font-medium">
                Главная
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                О проекте
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 neon-text tracking-wide">
            PLATORS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Погружение в мир цифрового контента и футуристических идей
          </p>
        </section>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-12 electric-border bg-card">
            <TabsTrigger value="all" className="data-[state=active]:neon-text">
              <Icon name="Sparkles" className="mr-2 h-4 w-4" />
              Все
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:neon-text">
              <Icon name="Video" className="mr-2 h-4 w-4" />
              Видео
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:neon-text">
              <Icon name="Image" className="mr-2 h-4 w-4" />
              Фото
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:neon-text">
              <Icon name="FileText" className="mr-2 h-4 w-4" />
              Текст
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="group hover:scale-105 transition-all duration-300 electric-border bg-card/50 backdrop-blur cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    {post.image ? (
                      <>
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon 
                            name={getCategoryIcon(post.category)} 
                            className="h-16 w-16 text-primary neon-glow group-hover:scale-110 transition-transform" 
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name={getCategoryIcon(post.category)} className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary uppercase tracking-wider">
                        {post.category === 'video' ? 'Видео' : post.category === 'photo' ? 'Фото' : 'Текст'}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(post.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Контент не найден</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border electric-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                © 2024 PLATORS. Все права защищены.
              </span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Github" className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Twitter" className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Mail" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;