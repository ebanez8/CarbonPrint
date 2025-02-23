//// filepath: /Users/kennethchen/Code/CarbonPrint/src/pages/About.tsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-primary-100 to-white p-8"
    >
      <header className="mb-8">
        <Link to="/" className="inline-flex items-center text-primary-700 hover:text-primary-900">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back Home
        </Link>
      </header>
      <main className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-4xl font-bold text-primary-900 mb-4">About CarbonPrint</h1>
        <p className="text-lg text-gray-700 mb-6">
          CarbonPrint is an AR-powered sustainability application that helps users make informed, environmentally conscious purchasing decisions. By scanning product barcodes, the app instantly reveals the environmental impact of products, assisting in tracking and reducing your carbon footprint.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-primary-800 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to empower consumers with actionable insights about the sustainability of their purchases. We believe that informed choices can drive a shift towards a more sustainable future.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-primary-800 mb-2">Technologies Used</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>React</li>
            <li>TypeScript</li>
            <li>Vite</li>
            <li>Tailwind CSS</li>
            <li>shadcn-ui</li>
            <li>framer-motion</li>
            <li>Google Generative AI</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-primary-800 mb-2">Creators</h2>
          <p className="text-gray-700">
            This project was created by Evan Zhou, Kenneth Chen, and Vijay Shrivarshan Vijayaraja.
          </p>
        </section>
      </main>
      <footer className="mt-12 text-center text-gray-600">
        © {new Date().getFullYear()} CarbonPrint. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default About;