export class DiagnosticEngine {
  constructor() {
    console.error("🔧 DiagnosticEngine initialized");
    
    // Thresholds for different severity levels
    this.thresholds = {
      cpu: {
        warning: 70,
        critical: 85
      },
      memory: {
        warning: 80,
        critical: 90
      },
      disk: {
        warning: 85,
        critical: 95
      },
      temperature: {
        warning: 70,
        critical: 80
      }
    };
  }

  /**
   * Main diagnostic function
   */
  async diagnose(snapshot, processes, options = {}) {
    try {
      const { detailed = false } = options;
      
      const issues = [];
      const quickFixes = [];
      const longTermRecommendations = [];
      
      // Analyze each system component
      const cpuIssues = this.analyzeCPU(snapshot.cpu, processes);
      const memoryIssues = this.analyzeMemory(snapshot.memory, processes);
      const diskIssues = this.analyzeDisk(snapshot.disk, processes);
      const processIssues = this.analyzeProcesses(processes);
      
      issues.push(...cpuIssues, ...memoryIssues, ...diskIssues, ...processIssues);
      
      // Generate solutions
      issues.forEach(issue => {
        quickFixes.push(...issue.quickFixes || []);
        longTermRecommendations.push(...issue.longTermFixes || []);
      });
      
      // Calculate overall health score
      const healthScore = this.calculateHealthScore(snapshot, issues);
      
      // Generate summary
      const summary = this.generateSummary(issues, healthScore);
      
      return {
        timestamp: snapshot.timestamp,
        summary,
        health_score: healthScore,
        issues,
        quick_fixes: [...new Set(quickFixes)], // Remove duplicates
        long_term_recommendations: [...new Set(longTermRecommendations)],
        snapshot: detailed ? snapshot : null,
        top_processes: processes.slice(0, 5)
      };
      
    } catch (error) {
      console.error("Error in diagnosis:", error);
      throw error;
    }
  }

  /**
   * Analyze CPU performance
   */
  analyzeCPU(cpu, processes) {
    const issues = [];
    
    if (cpu.usage_percent > this.thresholds.cpu.critical) {
      const topCpuProcesses = processes
        .filter(p => p.cpu_percent > 10)
        .slice(0, 3);
      
      issues.push({
        type: 'cpu_critical',
        severity: 'critical',
        title: 'CPU使用率が危険レベルです',
        description: `CPU使用率が${cpu.usage_percent}%に達しています`,
        details: {
          current_usage: cpu.usage_percent,
          threshold: this.thresholds.cpu.critical,
          top_processes: topCpuProcesses
        },
        impact: 'システム全体が非常に重くなっています',
        quickFixes: this.generateCPUQuickFixes(topCpuProcesses),
        longTermFixes: [
          'バックグラウンドアプリの自動起動を無効化',
          'CPUを多用するアプリの使用時間を制限',
          'システムのクリーンアップを定期実行'
        ]
      });
    } else if (cpu.usage_percent > this.thresholds.cpu.warning) {
      const topCpuProcesses = processes
        .filter(p => p.cpu_percent > 5)
        .slice(0, 3);
      
      issues.push({
        type: 'cpu_warning',
        severity: 'warning',
        title: 'CPU使用率が高めです',
        description: `CPU使用率が${cpu.usage_percent}%です`,
        details: {
          current_usage: cpu.usage_percent,
          threshold: this.thresholds.cpu.warning,
          top_processes: topCpuProcesses
        },
        impact: 'システムの応答が遅くなる可能性があります',
        quickFixes: this.generateCPUQuickFixes(topCpuProcesses),
        longTermFixes: [
          '不要なバックグラウンドアプリを終了',
          'システム設定の最適化'
        ]
      });
    }
    
    // Temperature check
    if (cpu.temperature_celsius && cpu.temperature_celsius > this.thresholds.temperature.warning) {
      issues.push({
        type: 'cpu_temperature',
        severity: cpu.temperature_celsius > this.thresholds.temperature.critical ? 'critical' : 'warning',
        title: 'CPU温度が高くなっています',
        description: `CPU温度が${cpu.temperature_celsius}°Cです`,
        details: {
          current_temp: cpu.temperature_celsius,
          threshold: this.thresholds.temperature.warning
        },
        impact: 'パフォーマンスの低下や強制シャットダウンの可能性があります',
        quickFixes: [
          '重いアプリケーションを一時停止',
          'Macを涼しい場所に移動',
          'しばらく使用を控える'
        ],
        longTermFixes: [
          'Macの清掃（内部のホコリ除去）',
          'サーマルペーストの交換（修理店で）',
          '使用環境の改善（エアコン、ファンなど）'
        ]
      });
    }
    
    return issues;
  }

  /**
   * Analyze memory performance - Enhanced version
   */
  analyzeMemory(memory, processes) {
    const issues = [];
    
    // Critical memory analysis with detailed information
    if (memory.usage_percent > this.thresholds.memory.critical || 
        memory.pressure === 'critical' ||
        memory.real_available_gb < 0.5) {
      
      const topMemProcesses = processes
        .filter(p => p.memory_mb > 100)
        .sort((a, b) => b.memory_mb - a.memory_mb)
        .slice(0, 5);
      
      issues.push({
        type: 'memory_critical',
        severity: 'critical',
        title: 'メモリ不足が深刻です',
        description: `メモリ使用率が${memory.usage_percent}%（${memory.used_gb}GB/${memory.total_gb}GB）、実際の使用可能メモリは${memory.real_available_gb}GBです`,
        details: {
          usage_percent: memory.usage_percent,
          used_gb: memory.used_gb,
          total_gb: memory.total_gb,
          real_available_gb: memory.real_available_gb,
          pressure: memory.pressure,
          app_memory_gb: memory.app_memory_gb,
          wired_memory_gb: memory.wired_memory_gb,
          compressed_memory_gb: memory.compressed_memory_gb,
          swap_used_gb: memory.swap_used_gb,
          memory_efficiency: memory.memory_efficiency,
          top_processes: topMemProcesses
        },
        impact: 'アプリが強制終了されたり、システムが不安定になる可能性があります',
        quickFixes: this.generateAdvancedMemoryQuickFixes(memory, topMemProcesses),
        longTermFixes: this.generateAdvancedMemoryLongTermFixes(memory)
      });
    } 
    else if (memory.usage_percent > this.thresholds.memory.warning || 
             memory.pressure === 'warning' ||
             memory.real_available_gb < 1.5) {
      
      const topMemProcesses = processes
        .filter(p => p.memory_mb > 100)
        .sort((a, b) => b.memory_mb - a.memory_mb)
        .slice(0, 3);
      
      issues.push({
        type: 'memory_warning',
        severity: 'warning',
        title: 'メモリ使用量が多めです',
        description: `メモリ使用率が${memory.usage_percent}%（${memory.used_gb}GB/${memory.total_gb}GB）、実際の使用可能メモリは${memory.real_available_gb}GBです`,
        details: {
          usage_percent: memory.usage_percent,
          used_gb: memory.used_gb,
          total_gb: memory.total_gb,
          real_available_gb: memory.real_available_gb,
          pressure: memory.pressure,
          app_memory_gb: memory.app_memory_gb,
          compressed_memory_gb: memory.compressed_memory_gb,
          memory_efficiency: memory.memory_efficiency,
          top_processes: topMemProcesses
        },
        impact: 'アプリの起動や切り替えが遅くなる可能性があります',
        quickFixes: this.generateAdvancedMemoryQuickFixes(memory, topMemProcesses),
        longTermFixes: this.generateAdvancedMemoryLongTermFixes(memory)
      });
    }
    
    // Enhanced swap usage analysis
    if (memory.swap_used_gb > 3) {
      issues.push({
        type: 'swap_critical',
        severity: 'critical',
        title: 'スワップメモリの使用量が危険レベルです',
        description: `${memory.swap_used_gb}GBのスワップメモリを使用中（スワップアウトページ: ${memory.swap_pages_out}）`,
        details: {
          swap_used: memory.swap_used_gb,
          swap_pages_out: memory.swap_pages_out,
          memory_efficiency: memory.memory_efficiency
        },
        impact: 'システム全体のパフォーマンスが大幅に低下し、アプリが非常に遅くなります',
        quickFixes: [
          '重要でないアプリを即座に終了',
          'ブラウザのタブを大幅に減らす',
          'システムを再起動してメモリをリセット'
        ],
        longTermFixes: [
          'メモリ増設を緊急で検討（現在 ' + memory.total_gb + 'GB）',
          'メモリ使用量の多いアプリの代替を探す',
          '同時使用アプリ数を大幅に制限'
        ]
      });
    } else if (memory.swap_used_gb > 1) {
      issues.push({
        type: 'swap_usage',
        severity: 'warning',
        title: 'スワップメモリを使用しています',
        description: `${memory.swap_used_gb}GBのスワップメモリを使用中`,
        details: {
          swap_used: memory.swap_used_gb,
          swap_pages_out: memory.swap_pages_out
        },
        impact: 'システム全体のパフォーマンスが低下します',
        quickFixes: [
          'メモリを多く使うアプリを終了',
          'ブラウザのタブ数を減らす'
        ],
        longTermFixes: [
          'メモリ増設を検討',
          'メモリ効率の良いアプリへの切り替え'
        ]
      });
    }
    
    // Memory efficiency analysis
    if (memory.memory_efficiency === 'poor') {
      issues.push({
        type: 'memory_efficiency',
        severity: 'warning',
        title: 'メモリ使用効率が悪化しています',
        description: `メモリ効率: ${memory.memory_efficiency}、アプリメモリ: ${memory.app_memory_gb}GB、圧縮メモリ: ${memory.compressed_memory_gb}GB`,
        details: {
          memory_efficiency: memory.memory_efficiency,
          app_memory_gb: memory.app_memory_gb,
          compressed_memory_gb: memory.compressed_memory_gb,
          compression_ratio: memory.compression_ratio
        },
        impact: 'メモリが無駄に使用され、システムパフォーマンスが低下します',
        quickFixes: [
          'メモリリークの可能性があるアプリを再起動',
          '使用していないアプリを完全終了'
        ],
        longTermFixes: [
          'メモリ効率の悪いアプリの特定と代替',
          'システムの定期再起動スケジュール設定'
        ]
      });
    }
    
    return issues;
  }

  /**
   * Generate advanced memory quick fixes based on detailed analysis
   */
  generateAdvancedMemoryQuickFixes(memory, topProcesses) {
    const fixes = [];
    
    // Priority-based fixes
    if (memory.real_available_gb < 0.5) {
      fixes.push('【緊急】重要でないアプリを即座に終了');
      fixes.push('【緊急】ブラウザのタブを大幅に削減');
    }
    
    if (memory.app_memory_gb > memory.total_gb * 0.7) {
      fixes.push('アプリメモリが過大です - メモリ使用量の多いアプリを終了');
    }
    
    if (memory.compressed_memory_gb > 2) {
      fixes.push('圧縮メモリが多いです - システムを再起動してリフレッシュ');
    }
    
    // Process-specific fixes
    if (topProcesses.length > 0) {
      const topProcess = topProcesses[0];
      fixes.push(`「${topProcess.name}」が${(topProcess.memory_mb / 1024).toFixed(1)}GB使用中 - 終了を検討`);
    }
    
    fixes.push('Activity Monitor でメモリタブを確認');
    fixes.push('Macを再起動してメモリをクリア');
    
    return fixes;
  }

  /**
   * Generate advanced memory long-term fixes
   */
  generateAdvancedMemoryLongTermFixes(memory) {
    const fixes = [];
    
    if (memory.total_gb < 16) {
      fixes.push('メモリ増設を強く推奨（現在 ' + memory.total_gb + 'GB → 16GB以上）');
    } else if (memory.total_gb < 32 && memory.app_memory_gb > memory.total_gb * 0.8) {
      fixes.push('メモリ増設を検討（現在 ' + memory.total_gb + 'GB → 32GB）');
    }
    
    if (memory.memory_efficiency === 'poor') {
      fixes.push('メモリ効率の悪いアプリの特定と代替アプリの検討');
    }
    
    fixes.push('同時起動アプリ数の制限ルール設定');
    fixes.push('メモリクリーナーツールの定期実行');
    fixes.push('起動項目の最適化');
    
    return fixes;
  }

  /**
   * Analyze disk performance
   */
  analyzeDisk(disk, processes) {
    const issues = [];
    
    // Disk space check
    if (disk.usage_percent > this.thresholds.disk.critical) {
      issues.push({
        type: 'disk_space_critical',
        severity: 'critical',
        title: 'ディスク容量が不足しています',
        description: `ディスク使用率が${disk.usage_percent}%（残り${disk.available_gb}GB）です`,
        details: {
          usage_percent: disk.usage_percent,
          available_gb: disk.available_gb,
          total_gb: disk.total_gb
        },
        impact: 'システムが不安定になったり、データ保存ができなくなります',
        quickFixes: [
          'ダウンロードフォルダを整理',
          'ゴミ箱を空にする',
          '大きなファイルを外部ストレージに移動'
        ],
        longTermFixes: [
          'ストレージクリーンアップツールを使用',
          '不要なアプリケーションを削除',
          '外部ストレージの活用'
        ]
      });
    } else if (disk.usage_percent > this.thresholds.disk.warning) {
      issues.push({
        type: 'disk_space_warning',
        severity: 'warning',
        title: 'ディスク容量が少なくなっています',
        description: `ディスク使用率が${disk.usage_percent}%（残り${disk.available_gb}GB）です`,
        details: {
          usage_percent: disk.usage_percent,
          available_gb: disk.available_gb
        },
        impact: 'まもなく容量不足でパフォーマンス低下の可能性があります',
        quickFixes: [
          '不要なファイルを削除',
          'キャッシュファイルをクリア'
        ],
        longTermFixes: [
          '定期的なファイル整理',
          'クラウドストレージの活用'
        ]
      });
    }
    
    // Disk I/O check
    const totalIO = disk.io.read_mb_s + disk.io.write_mb_s;
    if (totalIO > 100) {
      issues.push({
        type: 'disk_io_high',
        severity: 'warning',
        title: 'ディスクアクセスが集中しています',
        description: `ディスクI/O: 読み取り${disk.io.read_mb_s}MB/s, 書き込み${disk.io.write_mb_s}MB/s`,
        details: {
          read_speed: disk.io.read_mb_s,
          write_speed: disk.io.write_mb_s,
          total_io: totalIO
        },
        impact: 'ファイルアクセスが遅くなり、システム全体が重くなります',
        quickFixes: [
          'Time Machineバックアップの完了を待つ',
          '大きなファイルのコピー・移動を一時停止'
        ],
        longTermFixes: [
          'SSDへのアップグレード（現在HDD使用の場合）',
          'バックアップスケジュールの最適化'
        ]
      });
    }
    
    return issues;
  }

  /**
   * Analyze processes for potential issues
   */
  analyzeProcesses(processes) {
    const issues = [];
    
    // Check for browser tab explosions
    const chromeProcesses = processes.filter(p => 
      p.name.toLowerCase().includes('chrome') && p.cpu_percent > 5
    );
    
    if (chromeProcesses.length > 5) {
      issues.push({
        type: 'browser_overload',
        severity: 'warning',
        title: 'ブラウザのタブが多すぎます',
        description: `Chrome関連プロセスが${chromeProcesses.length}個実行中`,
        details: {
          chrome_processes: chromeProcesses.length,
          total_cpu: chromeProcesses.reduce((sum, p) => sum + p.cpu_percent, 0)
        },
        impact: 'メモリとCPUを大量消費し、システム全体を重くします',
        quickFixes: [
          '不要なタブを閉じる',
          'Chrome拡張機能を無効化',
          'Chromeを再起動'
        ],
        longTermFixes: [
          'タブ管理拡張機能の導入',
          'ブックマークの活用',
          '他のブラウザとの使い分け'
        ]
      });
    }
    
    // Check for development processes
    const devProcesses = processes.filter(p => 
      ['node', 'python', 'java', 'docker'].some(tech => 
        p.name.toLowerCase().includes(tech)
      ) && p.cpu_percent > 10
    );
    
    if (devProcesses.length > 0) {
      issues.push({
        type: 'development_processes',
        severity: 'info',
        title: '開発プロセスが実行中です',
        description: `${devProcesses.length}個の開発関連プロセスがCPUを使用中`,
        details: {
          dev_processes: devProcesses
        },
        impact: '開発作業中は正常ですが、不要時は終了を推奨',
        quickFixes: [
          '使っていない開発サーバーを停止',
          '不要なDockerコンテナを停止'
        ],
        longTermFixes: [
          '開発環境の効率化',
          'リソース制限の設定'
        ]
      });
    }
    
    return issues;
  }

  /**
   * Generate CPU-specific quick fixes
   */
  generateCPUQuickFixes(topProcesses) {
    const fixes = [];
    
    topProcesses.forEach(proc => {
      if (proc.name.includes('Chrome') && proc.safe_to_kill) {
        fixes.push(`Chromeを再起動（現在CPU ${proc.cpu_percent}%使用中）`);
      } else if (proc.safe_to_kill) {
        fixes.push(`${proc.name}を一時終了（CPU ${proc.cpu_percent}%使用中）`);
      }
    });
    
    if (fixes.length === 0) {
      fixes.push('重いプロセスの完了を待つ', 'Macを再起動');
    }
    
    return fixes;
  }

  /**
   * Generate memory-specific quick fixes
   */
  generateMemoryQuickFixes(topProcesses) {
    const fixes = [];
    
    topProcesses.forEach(proc => {
      if (proc.safe_to_kill) {
        fixes.push(`${proc.name}を終了（${(proc.memory_mb / 1024).toFixed(1)}GB使用中）`);
      }
    });
    
    fixes.push('使っていないアプリを終了', 'Macを再起動してメモリをクリア');
    
    return fixes;
  }

  /**
   * Calculate overall system health score (0-100)
   */
  calculateHealthScore(snapshot, issues) {
    let score = 100;
    
    // Deduct points based on resource usage
    score -= Math.max(0, snapshot.cpu.usage_percent - 50) * 0.5;
    score -= Math.max(0, snapshot.memory.usage_percent - 70) * 0.8;
    score -= Math.max(0, snapshot.disk.usage_percent - 80) * 0.3;
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate summary based on issues and health score
   */
  generateSummary(issues, healthScore) {
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const warningIssues = issues.filter(i => i.severity === 'warning');
    
    if (healthScore >= 80) {
      return "システムは良好な状態です。";
    } else if (healthScore >= 60) {
      return "軽微なパフォーマンス問題があります。";
    } else if (healthScore >= 40) {
      return "パフォーマンスの問題が検出されました。";
    } else {
      return "深刻なパフォーマンス問題があります。";
    }
  }
}
