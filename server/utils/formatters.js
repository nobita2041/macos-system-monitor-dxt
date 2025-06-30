/**
 * Format system snapshot for readable output
 */
export function formatSystemSnapshot(snapshot) {
  const { cpu, memory, disk, network, system } = snapshot;
  
  let result = `## 📊 システム状況スナップショット\n`;
  result += `取得時刻: ${new Date(snapshot.timestamp).toLocaleString('ja-JP')}\n\n`;
  
  // CPU Information
  result += `### 🔥 CPU状況\n`;
  result += `- モデル: ${cpu.model}\n`;
  result += `- 使用率: **${cpu.usage_percent}%**\n`;
  result += `- コア数: ${cpu.cores}コア（物理: ${cpu.physical_cores}）\n`;
  result += `- 負荷平均: ${cpu.load_average && Array.isArray(cpu.load_average) ? cpu.load_average.map(l => l.toFixed(2)).join(', ') : 'N/A'}\n`;
  if (cpu.temperature_celsius) {
    result += `- 温度: ${cpu.temperature_celsius}°C\n`;
  }
  result += `\n`;
  
  // Memory Information
  result += `### 💾 メモリ状況\n`;
  result += `- 使用率: **${memory.usage_percent}%**\n`;
  result += `- 使用量: ${memory.used_gb}GB / ${memory.total_gb}GB\n`;
  result += `- 実際の使用可能量: ${memory.real_available_gb || memory.available_gb}GB\n`;
  if (memory.swap_used_gb > 0) {
    result += `- スワップ使用量: ${memory.swap_used_gb}GB\n`;
  }
  result += `- メモリ圧迫レベル: ${getMemoryPressureEmoji(memory.pressure)} ${memory.pressure}\n`;
  
  // Detailed memory breakdown if available
  if (memory.app_memory_gb !== undefined) {
    result += `\n**📋 メモリ詳細内訳 (アクティビティモニタ準拠):**\n`;
    result += `- アプリメモリ: ${memory.app_memory_gb}GB (Anonymous pages)\n`;
    result += `- Wiredメモリ: ${memory.wired_memory_gb}GB (確保されているメモリ)\n`;
    result += `- 圧縮メモリ: ${memory.compressed_memory_gb}GB\n`;
    result += `- ファイルキャッシュ: ${memory.cached_files_gb}GB (キャッシュされたファイル)\n`;
    result += `- フリーメモリ: ${memory.free_memory_gb}GB\n`;
    if (memory.memory_efficiency) {
      result += `- メモリ効率: ${getMemoryEfficiencyEmoji(memory.memory_efficiency)} ${memory.memory_efficiency}\n`;
    }
    if (memory.compression_ratio) {
      result += `- 圧縮率: ${memory.compression_ratio.toFixed(1)}:1\n`;
    }
  }
  result += `\n`;
  
  // Disk Information
  result += `### 💿 ストレージ状況\n`;
  result += `- 使用率: **${disk.usage_percent}%**\n`;
  result += `- 使用量: ${disk.used_gb}GB / ${disk.total_gb}GB\n`;
  result += `- 空き容量: ${disk.available_gb || disk.free_gb}GB\n`;
  result += `- ファイルシステム: ${disk.filesystem}\n`;
  
  // Detailed storage breakdown if available (macOS System Preferences style)
  if (disk.breakdown && Object.keys(disk.breakdown).length > 0) {
    result += `\n**📋 ストレージ詳細内訳 (システム環境設定準拠):**\n`;
    if (disk.breakdown.applications_gb > 0) {
      result += `- 📱 アプリケーション: ${disk.breakdown.applications_gb}GB\n`;
    }
    if (disk.breakdown.documents_gb > 0) {
      result += `- 📄 書類 (ユーザーデータ): ${disk.breakdown.documents_gb}GB\n`;
    }
    if (disk.breakdown.system_data_gb > 0) {
      result += `- ⚙️ システムデータ: ${disk.breakdown.system_data_gb}GB\n`;
    }
    if (disk.breakdown.developer_gb > 0) {
      result += `- 👨‍💻 デベロッパ: ${disk.breakdown.developer_gb}GB\n`;
    }
    if (disk.breakdown.icloud_drive_gb > 0) {
      result += `- ☁️ iCloud Drive: ${disk.breakdown.icloud_drive_gb}GB\n`;
    }
    if (disk.breakdown.photos_gb > 0) {
      result += `- 📸 写真: ${disk.breakdown.photos_gb}GB\n`;
    }
    if (disk.breakdown.music_gb > 0) {
      result += `- 🎵 ミュージック: ${disk.breakdown.music_gb}GB\n`;
    }
    
    const total_breakdown = Object.values(disk.breakdown).reduce((sum, val) => sum + val, 0);
    const other_gb = Math.max(0, disk.used_gb - total_breakdown);
    if (other_gb > 1) {
      result += `- 🗂️ その他: ${Math.round(other_gb * 10) / 10}GB\n`;
    }
  }
  
  if (disk.io.read_mb_s > 0 || disk.io.write_mb_s > 0) {
    result += `- I/O: 読み込み ${disk.io.read_mb_s}MB/s, 書き込み ${disk.io.write_mb_s}MB/s\n`;
  }
  result += `\n`;
  
  // Network Information
  result += `### 🌐 ネットワーク状況\n`;
  result += `- インターフェース: ${network.interface}\n`;
  if (network.upload_mb_s > 0 || network.download_mb_s > 0) {
    result += `- アップロード: ${network.upload_mb_s}MB/s\n`;
    result += `- ダウンロード: ${network.download_mb_s}MB/s\n`;
  }
  result += `\n`;
  
  // System Information
  result += `### ⚙️ システム情報\n`;
  result += `- ホスト名: ${system.hostname}\n`;
  result += `- アーキテクチャ: ${system.arch}\n`;
  result += `- 稼働時間: ${formatUptime(system.uptime)}\n`;
  
  return result;
}

/**
 * Format diagnosis result for readable output
 */
export function formatDiagnosisResult(diagnosis) {
  let result = `# 🔍 システム診断結果\n\n`;
  
  // Health Score
  const healthEmoji = getHealthEmoji(diagnosis.health_score);
  result += `## ${healthEmoji} 総合健康度: ${diagnosis.health_score}/100\n`;
  result += `**${diagnosis.summary}**\n\n`;
  
  // Issues
  if (diagnosis.issues.length > 0) {
    result += `## ⚠️ 検出された問題\n\n`;
    
    diagnosis.issues.forEach((issue, index) => {
      const severityEmoji = getSeverityEmoji(issue.severity);
      result += `### ${severityEmoji} ${issue.title}\n`;
      result += `**${issue.description}**\n\n`;
      result += `影響: ${issue.impact}\n\n`;
      
      if (issue.details?.top_processes && issue.details.top_processes.length > 0) {
        result += `関連プロセス:\n`;
        issue.details.top_processes.slice(0, 3).forEach(proc => {
          result += `- ${proc.name}: CPU ${proc.cpu_percent}%, メモリ ${(proc.memory_mb / 1024).toFixed(1)}GB\n`;
        });
        result += `\n`;
      }
    });
  }
  
  // Quick Fixes
  if (diagnosis.quick_fixes.length > 0) {
    result += `## ⚡ 今すぐできる対処法\n\n`;
    diagnosis.quick_fixes.forEach((fix, index) => {
      result += `${index + 1}. ${fix}\n`;
    });
    result += `\n`;
  }
  
  // Long-term recommendations
  if (diagnosis.long_term_recommendations.length > 0) {
    result += `## 🎯 長期的な改善提案\n\n`;
    diagnosis.long_term_recommendations.forEach((rec, index) => {
      result += `${index + 1}. ${rec}\n`;
    });
    result += `\n`;
  }
  
  // Top Processes
  if (diagnosis.top_processes.length > 0) {
    result += `## 📊 リソース使用量上位プロセス\n\n`;
    diagnosis.top_processes.forEach((proc, index) => {
      result += `**${index + 1}. ${proc.name}**\n`;
      result += `- CPU: ${proc.cpu_percent}%\n`;
      result += `- メモリ: ${(proc.memory_mb / 1024).toFixed(1)}GB\n`;
      if (proc.description) {
        result += `- 説明: ${proc.description}\n`;
      }
      result += `\n`;
    });
  }
  
  result += `---\n`;
  result += `診断時刻: ${new Date(diagnosis.timestamp).toLocaleString('ja-JP')}\n`;
  
  return result;
}

/**
 * Get emoji for health score
 */
function getHealthEmoji(score) {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🟡';
  if (score >= 40) return '🟠';
  return '🔴';
}

/**
 * Get emoji for issue severity
 */
function getSeverityEmoji(severity) {
  switch (severity) {
    case 'critical': return '🔴';
    case 'warning': return '🟡';
    case 'info': return '🔵';
    default: return '⚪';
  }
}

/**
 * Get emoji for memory pressure
 */
function getMemoryPressureEmoji(pressure) {
  switch (pressure) {
    case 'critical': return '🔴';
    case 'warning': return '🟡';
    case 'normal': return '🟢';
    default: return '⚪';
  }
}

/**
 * Get emoji for memory efficiency
 */
function getMemoryEfficiencyEmoji(efficiency) {
  switch (efficiency) {
    case 'excellent': return '🟢';
    case 'good': return '🟡';
    case 'fair': return '🟠';
    case 'poor': return '🔴';
    default: return '⚪';
  }
}

/**
 * Format uptime in human readable format
 */
function formatUptime(uptimeSeconds) {
  if (!uptimeSeconds) return 'Unknown';
  
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}日 ${hours}時間 ${minutes}分`;
  } else if (hours > 0) {
    return `${hours}時間 ${minutes}分`;
  } else {
    return `${minutes}分`;
  }
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format percentage with color coding
 */
export function formatPercentage(value, warningThreshold = 70, criticalThreshold = 90) {
  const emoji = value >= criticalThreshold ? '🔴' : 
                value >= warningThreshold ? '🟡' : '🟢';
  return `${emoji} ${value.toFixed(1)}%`;
}
