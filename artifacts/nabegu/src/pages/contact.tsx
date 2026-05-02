import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Контакты</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Всегда рады видеть вас! Ждем в гости каждый день.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-8">
          <div className="bg-card p-8 rounded-3xl shadow-sm border flex items-start gap-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Наш адрес</h3>
              <p className="text-muted-foreground text-lg">Абхазия, ул. Центральная</p>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-3xl shadow-sm border flex items-start gap-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Режим работы</h3>
              <p className="text-muted-foreground text-lg">Понедельник – Воскресенье<br/>09:00 – 22:00</p>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-3xl shadow-sm border flex items-start gap-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Телефон</h3>
              <p className="text-muted-foreground text-lg">+7 (XXX) XXX-XX-XX</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border overflow-hidden h-[500px] relative">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?ll=41.016124%2C42.999922&z=15&pt=41.016124,42.999922,pm2rdl" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen={true}
            className="absolute inset-0"
            title="Yandex Map Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}