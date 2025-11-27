import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/8c771742-d085-4797-9901-cff3ac52ca36';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: 'video' | 'photo' | 'text';
  image_url?: string;
  created_at: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}?published=true`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeTab);

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
                    {post.image_url ? (
                      <>
                        <img 
                          src={post.image_url} 
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
                        {new Date(post.created_at).toLocaleDateString('ru-RU')}
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

        {loading && (
          <div className="text-center py-16">
            <Icon name="Loader2" className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Загрузка статей...</p>
          </div>
        )}
        
        {!loading && filteredPosts.length === 0 && (
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