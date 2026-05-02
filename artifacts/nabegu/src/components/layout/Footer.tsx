import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="text-xl font-bold text-primary">
            НаБегу
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Быстро, вкусно, сытно. Ваш идеальный перекус.
          </p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/menu" className="hover:text-primary transition-colors">Меню</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Контакты</Link>
          <Link href="/order" className="hover:text-primary transition-colors">Корзина</Link>
        </div>
        
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} НаБегу. Абхазия.
        </div>
      </div>
    </footer>
  );
}