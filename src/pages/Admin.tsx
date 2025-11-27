import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/8c771742-d085-4797-9901-cff3ac52ca36';

interface Post {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: 'video' | 'photo' | 'text';
  image_url?: string;
  video_url?: string;
  published: boolean;
}

const emptyPost: Post = {
  title: '',
  excerpt: '',
  content: '',
  category: 'text',
  image_url: '',
  video_url: '',
  published: false
};

const Admin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post>(emptyPost);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}?published=false`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить статьи',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editingPost.id ? 'PUT' : 'POST';
      const url = editingPost.id ? `${API_URL}/${editingPost.id}` : API_URL;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: editingPost.id ? 'Статья обновлена' : 'Статья создана'
        });
        setIsDialogOpen(false);
        setEditingPost(emptyPost);
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить статью',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить статью?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Статья удалена' });
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить статью',
        variant: 'destructive'
      });
    }
  };

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
      <header className="border-b border-border electric-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon name="Settings" className="h-8 w-8 text-primary neon-glow" />
              <h1 className="text-2xl font-bold neon-text">Админ-панель PLATORS</h1>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="electric-border"
            >
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              На сайт
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Управление контентом</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingPost(emptyPost)}
                className="neon-glow"
              >
                <Icon name="Plus" className="mr-2 h-4 w-4" />
                Создать статью
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto electric-border bg-card">
              <DialogHeader>
                <DialogTitle className="neon-text">
                  {editingPost.id ? 'Редактировать статью' : 'Новая статья'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="electric-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                    className="electric-border"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Полный текст</Label>
                  <Textarea
                    id="content"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    className="electric-border"
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={editingPost.category}
                      onValueChange={(value: 'video' | 'photo' | 'text') => 
                        setEditingPost({...editingPost, category: value})
                      }
                    >
                      <SelectTrigger className="electric-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="electric-border bg-card">
                        <SelectItem value="video">Видео</SelectItem>
                        <SelectItem value="photo">Фото</SelectItem>
                        <SelectItem value="text">Текст</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published" className="flex items-center gap-2">
                      Опубликовано
                    </Label>
                    <div className="flex items-center h-10">
                      <Switch
                        id="published"
                        checked={editingPost.published}
                        onCheckedChange={(checked) => 
                          setEditingPost({...editingPost, published: checked})
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL изображения</Label>
                  <Input
                    id="image_url"
                    value={editingPost.image_url || ''}
                    onChange={(e) => setEditingPost({...editingPost, image_url: e.target.value})}
                    placeholder="https://..."
                    className="electric-border"
                  />
                </div>

                {editingPost.category === 'video' && (
                  <div className="space-y-2">
                    <Label htmlFor="video_url">URL видео</Label>
                    <Input
                      id="video_url"
                      value={editingPost.video_url || ''}
                      onChange={(e) => setEditingPost({...editingPost, video_url: e.target.value})}
                      placeholder="https://..."
                      className="electric-border"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="electric-border"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading || !editingPost.title}
                    className="neon-glow"
                  >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="electric-border bg-card mb-6">
            <TabsTrigger value="all">Все статьи</TabsTrigger>
            <TabsTrigger value="published">Опубликованные</TabsTrigger>
            <TabsTrigger value="draft">Черновики</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="electric-border bg-card/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={getCategoryIcon(post.category)} className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.published && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                            Опубликовано
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                          className="electric-border"
                        >
                          <Icon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => post.id && handleDelete(post.id)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="grid grid-cols-1 gap-4">
              {posts.filter(p => p.published).map((post) => (
                <Card key={post.id} className="electric-border bg-card/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={getCategoryIcon(post.category)} className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                          className="electric-border"
                        >
                          <Icon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => post.id && handleDelete(post.id)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft">
            <div className="grid grid-cols-1 gap-4">
              {posts.filter(p => !p.published).map((post) => (
                <Card key={post.id} className="electric-border bg-card/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={getCategoryIcon(post.category)} className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                          className="electric-border"
                        >
                          <Icon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => post.id && handleDelete(post.id)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
