import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Smartphone } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

import heroImg from "@/assets/images/hero.png";
import hotDishesImg from "@/assets/images/hot-dishes.png";
import burgerImg from "@/assets/images/burger.png";

// Mock products
const POPULAR_PRODUCTS = [
  {
    id: 1,
    name: "Биг Хит",
    price: 185,
    image: burgerImg,
    category: "Бургеры"
  },
  {
    id: 2,
    name: "Двойной Чизбургер",
    price: 155,
    image: burgerImg,
    category: "Бургеры"
  },
  {
    id: 3,
    name: "Картофель Фри (Бол.)",
    price: 110,
    image: hotDishesImg,
    category: "Картофель"
  },
  {
    id: 4,
    name: "Наггетсы (9 шт)",
    price: 145,
    image: hotDishesImg,
    category: "Курица"
  },
  {
    id: 5,
    name: "Добрый Кола 0.5",
    price: 99,
    image: heroImg,
    category: "Напитки"
  },
  {
    id: 6,
    name: "Пирожок Вишневый",
    price: 75,
    image: hotDishesImg,
    category: "Десерты"
  }
];

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Новые сезонные бургеры",
    description: "Добавили две новинки с фирменным соусом. Успейте попробовать первыми!",
    date: "02 мая 2026",
    image: burgerImg,
  },
  {
    id: 2,
    title: "Скидка 20% на комбо после 21:00",
    description: "Вечерняя акция действует ежедневно в приложении и на сайте.",
    date: "30 апреля 2026",
    image: hotDishesImg,
  },
  {
    id: 3,
    title: "Быстрая выдача без очереди",
    description: "Оформляйте заказ заранее и забирайте в отдельной зоне выдачи.",
    date: "28 апреля 2026",
    image: heroImg,
  },
];

export default function Home() {
  const { addItem } = useCart();
  const featuredProducts = POPULAR_PRODUCTS.slice(0, 4);
  const installUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?utm_source=qr_install`
      : "https://nabegu.onrender.com/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(installUrl)}`;

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50/50 dark:bg-background">
      {/* Hero Carousel Section */}
      <section className="container mx-auto px-4 py-6">
        <Carousel className="w-full rounded-2xl overflow-hidden shadow-sm" opts={{ loop: true }}>
          <CarouselContent>
            {[1, 2, 3].map((slide) => (
              <CarouselItem key={slide} className="relative h-[250px] md:h-[400px]">
                <img 
                  src={slide === 1 ? heroImg : slide === 2 ? hotDishesImg : burgerImg} 
                  alt={`Promo ${slide}`}
                  className="w-full h-full object-cover brightness-75 md:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-16">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-5 max-w-lg leading-tight">
                    {slide === 1 ? "Вкусные новинки сезона" : slide === 2 ? "Горячее предложение" : "Сочный бургер дня"}
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl mb-6 max-w-md">
                    Успей попробовать первым. Заказывай прямо сейчас!
                  </p>
                  <Link href="/menu">
                    <Button size="lg" className="w-max rounded-full font-bold px-8" variant="default">
                      Заказать
                    </Button>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 hidden md:flex bg-white/50 hover:bg-white border-none" />
          <CarouselNext className="right-4 hidden md:flex bg-white/50 hover:bg-white border-none" />
        </Carousel>
      </section>

      {/* Popular Items Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">Популярное сейчас</h2>
          <Link href="/menu">
            <Button variant="ghost" className="rounded-full">Все в меню</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-card overflow-hidden flex flex-col group">
              <div className="relative aspect-square p-4 flex items-center justify-center bg-gray-50/50 dark:bg-muted/20">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 flex flex-col flex-grow justify-between gap-3">
                <h3 className="font-semibold text-[15px] md:text-base leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg md:text-xl">{product.price} ₽</span>
                  <Button 
                    size="sm" 
                    className="rounded-full bg-gray-100 hover:bg-gray-200 text-black dark:bg-muted dark:text-white dark:hover:bg-muted/80 w-10 h-10 p-0 md:w-auto md:px-4 md:h-10 transition-colors"
                    onClick={() => {
                      addItem({ id: String(product.id), name: product.name, price: product.price });
                      toast.success("Добавлено в корзину");
                    }}
                  >
                    <span className="md:hidden font-bold">+</span>
                    <span className="hidden md:inline font-bold">+ Добавить</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="container mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">Новости</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {NEWS_ITEMS.map((news) => (
            <Card key={news.id} className="overflow-hidden rounded-2xl border-none shadow-sm bg-white dark:bg-card">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-2">{news.date}</p>
                <h3 className="text-lg font-semibold leading-snug mb-2">{news.title}</h3>
                <p className="text-sm text-muted-foreground">{news.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Promo Section (App) */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="bg-secondary rounded-3xl overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 justify-between">
            <div className="text-white max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Заказывай быстрее<br/>в нашем приложении
              </h2>
              <p className="text-secondary-foreground/80 text-lg mb-8">
                Копи баллы, участвуй в акциях и забирай заказы без очереди.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-secondary-foreground hover:bg-gray-100 font-bold px-8"
                  onClick={() => toast.info("Приложение находится в разработке!")}
                >
                  <Smartphone className="mr-2 w-5 h-5" />
                  Скачать приложение
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="QR-код для открытия сайта и установки приложения"
                  className="w-32 h-32 rounded-xl"
                  loading="lazy"
                />
                <p className="text-[11px] text-center text-gray-500 mt-2 font-medium">
                  Сканируй для установки
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}