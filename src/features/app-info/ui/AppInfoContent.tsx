"use client";

import Image from "next/image";
import {
  Github,
  Info,
  Users,
  Lightbulb,
  Zap,
  Code,
  Server,
  Cloud,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { APP_INFO } from "@/features/app-info/config/app-info.constants";

export function AppInfoContent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-4 pt-20 pb-12 sm:px-8 sm:pt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-16"
        >

          <motion.div
            className="mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Image
              src="/logo-letters.png"
              alt={APP_INFO.name}
              width={320}
              height={80}
              className="mx-auto"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-300 mb-6 sm:mb-8">
            <span className="px-4 py-2 bg-linear-to-r from-red-600/20 to-pink-600/20 rounded-full border border-red-500/30">
              Versión {APP_INFO.version}
            </span>
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Última actualización: {APP_INFO.lastUpdate}</span>
          </div>

          <motion.a
            href={APP_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-linear-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl transition-all shadow-lg shadow-red-500/20 border border-gray-700"
          >
            <Github className="w-5 h-5" />
            Ver cambios en GitHub
            <Sparkles className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Main Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-600/20 rounded-xl group-hover:bg-red-600/30 transition-colors">
                  <Info className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-lg sm:text-2xl">Descripción General</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{APP_INFO.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-lg sm:text-2xl">Público Dirigido</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{APP_INFO.targetAudience}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-600/20 rounded-xl group-hover:bg-yellow-600/30 transition-colors">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-lg sm:text-2xl">Problema a Resolver</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{APP_INFO.problemSolved}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-all backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-600/20 rounded-xl group-hover:bg-green-600/30 transition-colors">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-lg sm:text-2xl">Beneficio Principal</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{APP_INFO.mainBenefit}</p>
            </div>
          </motion.div>
        </div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <motion.h2
            className="text-2xl sm:text-4xl mb-6 sm:mb-10 text-center bg-linear-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Tecnologías Utilizadas
          </motion.h2>

          {/* Frontend */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Code className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-2xl text-cyan-400">Frontend</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {APP_INFO.technologies.frontend.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-linear-to-br from-cyan-950/40 to-gray-900/60 p-5 rounded-xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center justify-center">
                    <span className="text-white group-hover:text-cyan-300 transition-colors text-center">{tech}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Server className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-2xl text-purple-400">Backend</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {APP_INFO.technologies.backend.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-linear-to-br from-purple-950/40 to-gray-900/60 p-5 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center justify-center">
                    <span className="text-white group-hover:text-purple-300 transition-colors text-center">{tech}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deployment */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Cloud className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-2xl text-orange-400">Despliegue</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {APP_INFO.technologies.deployment.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-linear-to-br from-orange-950/40 to-gray-900/60 p-5 rounded-xl border border-orange-500/30 hover:border-orange-400/60 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all" />
                  <div className="relative flex items-center justify-center">
                    <span className="text-white group-hover:text-orange-300 transition-colors text-center">{tech}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* License & Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative bg-linear-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 p-4 sm:p-8 rounded-2xl border border-gray-700/50 text-center overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-linear-to-r from-red-600/5 via-transparent to-blue-600/5" />
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 text-gray-300">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-linear-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700"
            >
              <span className="font-semibold text-white">Licencia:</span>{" "}
              {APP_INFO.license}
            </motion.div>
            <div className="hidden md:block w-px h-12 bg-linear-to-b from-transparent via-gray-600 to-transparent" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-linear-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700"
            >
              <span className="font-semibold text-white">Fuente:</span>{" "}
              {APP_INFO.source}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
