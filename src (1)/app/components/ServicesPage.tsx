import { motion } from "motion/react";
import { Code, Palette, Smartphone, Globe, Database, Lock } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Phát triển website hiện đại, responsive và tối ưu hiệu suất.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Thiết kế giao diện đẹp mắt, trải nghiệm người dùng tuyệt vời.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Ứng dụng di động cho iOS và Android với công nghệ mới nhất.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Globe,
    title: "Digital Marketing",
    description: "Chiến lược marketing hiệu quả, tăng trưởng bền vững.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Database,
    title: "Cloud Solutions",
    description: "Giải pháp đám mây an toàn, linh hoạt và dễ mở rộng.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Lock,
    title: "Security",
    description: "Bảo mật cao cấp, bảo vệ dữ liệu và hệ thống của bạn.",
    color: "from-red-500 to-red-600",
  },
];

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Dịch vụ chuyên nghiệp, giải pháp toàn diện
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Bạn cần dịch vụ nào?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Liên hệ với chúng tôi để được tư vấn miễn phí
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Get In Touch
          </motion.button>
        </div>
      </section>
    </div>
  );
}
