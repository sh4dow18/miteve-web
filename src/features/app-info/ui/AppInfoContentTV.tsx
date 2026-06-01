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
import { APP_INFO } from "@/features/app-info/config/app-info.constants";

export function AppInfoContentTV() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-4 pt-20 pb-12 sm:px-8 sm:pt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="mb-4">
            <Image
              src="/logo-letters.png"
              alt={APP_INFO.name}
              width={320}
              height={80}
              className="mx-auto"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gray-300 mb-6 sm:mb-8">
            <span className="px-4 py-2 bg-linear-to-r from-red-600/20 to-pink-600/20 rounded-full border border-red-500/30">
              Versión {APP_INFO.version}
            </span>
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Última actualización: {APP_INFO.lastUpdate}</span>
          </div>

          <a
            href={APP_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-linear-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg shadow-red-500/20 border border-gray-700"
          >
            <Github className="w-5 h-5" />
            Ver cambios en GitHub
            <Sparkles className="w-4 h-4" />
          </a>
        </div>

        {/* Main Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div className="relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-red-500/20 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-xl">
                <Info className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg sm:text-2xl">Descripción General</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{APP_INFO.description}</p>
          </div>

          <div className="relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-lg sm:text-2xl">Público Dirigido</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{APP_INFO.targetAudience}</p>
          </div>

          <div className="relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-yellow-500/20 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-600/20 rounded-xl">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
              </div>
              <h2 className="text-lg sm:text-2xl">Problema a Resolver</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{APP_INFO.problemSolved}</p>
          </div>

          <div className="relative bg-linear-to-br from-gray-900/80 to-gray-800/80 p-4 sm:p-8 rounded-2xl border border-green-500/20 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-600/20 rounded-xl">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-lg sm:text-2xl">Beneficio Principal</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{APP_INFO.mainBenefit}</p>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-4xl mb-6 sm:mb-10 text-center bg-linear-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Tecnologías Utilizadas
          </h2>

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
                <div
                  key={index}
                  className="relative bg-linear-to-br from-cyan-950/40 to-gray-900/60 p-5 rounded-xl border border-cyan-500/30 overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-white text-center">{tech}</span>
                  </div>
                </div>
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
                <div
                  key={index}
                  className="relative bg-linear-to-br from-purple-950/40 to-gray-900/60 p-5 rounded-xl border border-purple-500/30 overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-white text-center">{tech}</span>
                  </div>
                </div>
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
                <div
                  key={index}
                  className="relative bg-linear-to-br from-orange-950/40 to-gray-900/60 p-5 rounded-xl border border-orange-500/30 overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-white text-center">{tech}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* License & Source */}
        <div className="relative bg-linear-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 p-4 sm:p-8 rounded-2xl border border-gray-700/50 text-center overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-linear-to-r from-red-600/5 via-transparent to-blue-600/5" />
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 text-gray-300">
            <div className="px-6 py-3 bg-linear-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
              <span className="font-semibold text-white">Licencia:</span>{" "}
              {APP_INFO.license}
            </div>
            <div className="hidden md:block w-px h-12 bg-linear-to-b from-transparent via-gray-600 to-transparent" />
            <div className="px-6 py-3 bg-linear-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
              <span className="font-semibold text-white">Fuente:</span>{" "}
              {APP_INFO.source}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
