import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-primary/10 text-primary p-6 rounded-full mb-6"
      >
        <Search className="w-16 h-16" />
      </motion.div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Похоже, мы не смогли найти то, что вы искали. Возможно, блюдо уже съели или адрес страницы изменился.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full">На главную</Button>
      </Link>
    </div>
  );
}