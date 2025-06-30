import si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ProcessAnalyzer {
  constructor() {
    console.error("🔧 ProcessAnalyzer initialized");
    
    // Common process descriptions for better user understanding
    this.processDescriptions = {
      'Google Chrome': 'Webブラウザ - Chromeメインプロセス',
      'Google Chrome Helper': 'Webブラウザ - Chromeヘルパープロセス（タブ、拡張機能など）',
      'Safari': 'Webブラウザ - Safari',
      'Firefox': 'Webブラウザ - Firefox',
      'Adobe Photoshop': '画像編集ソフト - Photoshop',
      'Adobe Premiere Pro': '動画編集ソフト - Premiere Pro',
      'Final Cut Pro': '動画編集ソフト - Final Cut Pro',
      'Xcode': '開発環境 - Xcode',
      'Visual Studio Code': 'コードエディタ - VS Code',
      'node': 'Node.js プロセス（開発サーバーなど）',
      'python': 'Python スクリプト',
      'Docker Desktop': 'コンテナ仮想化 - Docker',
      'VirtualBox': '仮想マシン - VirtualBox',
      'Slack': 'チャットアプリ - Slack',
      'Discord': 'チャットアプリ - Discord',
      'Zoom': 'ビデオ会議 - Zoom',
      'Spotify': '音楽ストリーミング - Spotify',
      'Time Machine': 'バックアップ - Time Machine',
      'Spotlight': 'システム検索インデックス',
      'mds_stores': 'Spotlightインデックス作成',
      'WindowServer': 'システム - ウィンドウ管理',
      'kernel_task': 'システム - カーネルプロセス'
    };
  }

  /**
   * Get top processes by resource usage
   */
  async getTopProcesses(sortBy = 'cpu', limit = 15) {
    try {
      const processes = await si.processes();
      
      // Filter and enhance process data
      const enhancedProcesses = processes.list
        .filter(proc => proc.cpu > 0 || proc.mem > 0) // Only show active processes
        .map(proc => this.enhanceProcessInfo(proc))
        .sort((a, b) => {
          switch (sortBy) {
            case 'memory':
              return b.memory_mb - a.memory_mb;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'cpu':
            default:
              return b.cpu_percent - a.cpu_percent;
          }
        })
        .slice(0, limit);

      return enhancedProcesses;
    } catch (error) {
      console.error("Error getting top processes:", error);
      throw error;
    }
  }

  /**
   * Analyze processes and provide recommendations
   */
  async analyzeProcesses(sortBy = 'cpu', limit = 10) {
    try {
      const processes = await this.getTopProcesses(sortBy, limit);
      const recommendations = this.generateRecommendations(processes);
      
      return {
        processes,
        total_processes: processes.length,
        recommendations,
        analysis: {
          high_cpu_processes: processes.filter(p => p.cpu_percent > 20).length,
          high_memory_processes: processes.filter(p => p.memory_mb > 1024).length,
          killable_processes: processes.filter(p => p.safe_to_kill).length
        }
      };
    } catch (error) {
      console.error("Error analyzing processes:", error);
      throw error;
    }
  }

  /**
   * Enhance process information with additional metadata
   */
  enhanceProcessInfo(proc) {
    const name = proc.name || proc.command || 'Unknown';
    const cleanName = this.cleanProcessName(name);
    
    return {
      pid: proc.pid,
      name: cleanName,
      cpu_percent: Math.round(proc.cpu * 10) / 10,
      memory_mb: Math.round(proc.mem * 10) / 10,
      memory_percent: Math.round(proc.memVsTotal * 10) / 10,
      user: proc.user || 'unknown',
      command: proc.command || '',
      started: proc.started || null,
      state: proc.state || 'unknown',
      description: this.getProcessDescription(cleanName),
      impact_level: this.calculateImpactLevel(proc.cpu, proc.mem),
      safe_to_kill: this.isSafeToKill(cleanName, proc.user),
      category: this.categorizeProcess(cleanName)
    };
  }

  /**
   * Clean up process names for better readability
   */
  cleanProcessName(name) {
    // Remove common suffixes and paths
    const cleaned = name
      .replace(/\.app\/Contents\/MacOS\//, '')
      .replace(/^.*\//, '')
      .replace(/\s+\(.+\)$/, '')
      .trim();
    
    return cleaned || name;
  }

  /**
   * Get human-readable description for common processes
   */
  getProcessDescription(processName) {
    // Exact match first
    if (this.processDescriptions[processName]) {
      return this.processDescriptions[processName];
    }
    
    // Partial match for complex process names
    for (const [key, description] of Object.entries(this.processDescriptions)) {
      if (processName.toLowerCase().includes(key.toLowerCase())) {
        return description;
      }
    }
    
    return null;
  }

  /**
   * Calculate impact level based on resource usage
   */
  calculateImpactLevel(cpu, memory) {
    const cpuWeight = cpu * 0.6;
    const memoryWeight = (memory / 1024) * 0.4; // Convert MB to GB for weighting
    const totalImpact = cpuWeight + memoryWeight;
    
    if (totalImpact > 50) return 'high';
    if (totalImpact > 20) return 'medium';
    return 'low';
  }

  /**
   * Determine if a process is safe to kill
   */
  isSafeToKill(processName, user) {
    const systemProcesses = [
      'kernel_task', 'WindowServer', 'loginwindow', 'Dock', 'Finder',
      'launchd', 'mds', 'mds_stores', 'mdworker', 'cfprefsd',
      'SystemUIServer', 'NotificationCenter', 'ControlCenter'
    ];
    
    const safeToKillApps = [
      'Google Chrome', 'Safari', 'Firefox', 'Slack', 'Discord',
      'Spotify', 'Adobe Photoshop', 'Adobe Premiere Pro',
      'Visual Studio Code', 'Xcode'
    ];
    
    // System processes are never safe to kill
    if (systemProcesses.some(sys => processName.toLowerCase().includes(sys.toLowerCase()))) {
      return false;
    }
    
    // User processes from user account are generally safe
    if (user && user !== 'root' && user !== '_system') {
      // Check if it's a known safe application
      if (safeToKillApps.some(safe => processName.toLowerCase().includes(safe.toLowerCase()))) {
        return true;
      }
    }
    
    return false; // Default to not safe
  }

  /**
   * Categorize processes for better organization
   */
  categorizeProcess(processName) {
    const categories = {
      browser: ['chrome', 'safari', 'firefox', 'edge'],
      development: ['xcode', 'visual studio code', 'node', 'python', 'java'],
      media: ['photoshop', 'premiere', 'final cut', 'spotify', 'vlc'],
      communication: ['slack', 'discord', 'zoom', 'teams'],
      system: ['kernel_task', 'windowserver', 'spotlight', 'mds'],
      virtualization: ['docker', 'virtualbox', 'parallels']
    };
    
    const lowerName = processName.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerName.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  /**
   * Generate recommendations based on process analysis
   */
  generateRecommendations(processes) {
    const recommendations = [];
    
    // High CPU usage recommendations
    const highCpuProcesses = processes.filter(p => p.cpu_percent > 25);
    highCpuProcesses.forEach(proc => {
      if (proc.name.includes('Chrome')) {
        recommendations.push(`Chromeのタブや拡張機能を整理してください（CPU ${proc.cpu_percent}%使用中）`);
      } else if (proc.name.includes('node')) {
        recommendations.push(`開発サーバー（${proc.name}）が重い処理を実行中です`);
      } else if (proc.safe_to_kill) {
        recommendations.push(`${proc.name}の使用を一時停止することを検討してください（CPU ${proc.cpu_percent}%使用中）`);
      }
    });
    
    // High memory usage recommendations
    const highMemoryProcesses = processes.filter(p => p.memory_mb > 1024);
    highMemoryProcesses.forEach(proc => {
      if (proc.safe_to_kill) {
        recommendations.push(`${proc.name}が${(proc.memory_mb / 1024).toFixed(1)}GBのメモリを使用中 - 一時終了を検討`);
      }
    });
    
    // Browser-specific recommendations
    const browserProcesses = processes.filter(p => p.category === 'browser');
    if (browserProcesses.length > 5) {
      recommendations.push('複数のブラウザプロセスが実行中です。不要なタブを閉じてください');
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }
}
