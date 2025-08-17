"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100 px-6 lg:px-20 py-16">
      <section className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-6xl font-bold mb-4"
        >
          About{" "}
          <span className="text-red-600 dark:text-red-400">TechThrive</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Empowering the future with technology, innovation, and creativity. At
          TechThrive, we believe in building solutions that inspire growth and
          transform lives.
        </motion.p>
      </section>

  
      <section className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl shadow-lg bg-gray-100 dark:bg-[#222] p-6"
        >
          <h2 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            To create impactful digital experiences and tools that empower
            individuals and businesses to thrive in a fast-paced, tech-driven
            world.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl shadow-lg bg-gray-100 dark:bg-[#222] p-6"
        >
          <h2 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            A future where technology seamlessly blends with human creativity,
            unlocking endless possibilities and opportunities for everyone.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Innovation",
              desc: "Always pushing boundaries to deliver cutting-edge solutions.",
            },
            {
              title: "Integrity",
              desc: "Building trust through transparency and honesty.",
            },
            {
              title: "Excellence",
              desc: "Striving for quality in every detail of what we do.",
            },
            {
              title: "Collaboration",
              desc: "Working together to achieve shared success.",
            },
            {
              title: "Growth",
              desc: "Helping people and businesses reach their true potential.",
            },
            {
              title: "Impact",
              desc: "Creating technology that makes a real difference.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="rounded-2xl shadow-md bg-gray-100 dark:bg-[#222] p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          Join the{" "}
          <span className="text-red-600 dark:text-red-400">TechThrive</span>{" "}
          Journey
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          We’re constantly innovating and expanding our vision. Be part of our
          growing community and let’s thrive together with technology.
        </p>
        <Button size="lg" className="rounded-full px-8 py-6 text-lg">
          Get Started
        </Button>
      </section>
    </div>
  );
}