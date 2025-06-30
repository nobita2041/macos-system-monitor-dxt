#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { SystemMonitor } from "./lib/system-monitor.js";
import { ProcessAnalyzer } from "./lib/process-analyzer.js";
import { DiagnosticEngine } from "./lib/diagnosis.js";
import { formatSystemSnapshot, formatDiagnosisResult } from "./utils/formatters.js";

// Initialize components
const systemMonitor = new SystemMonitor();
const processAnalyzer = new ProcessAnalyzer();
const diagnosticEngine = new DiagnosticEngine();

// Create MCP server
const server = new McpServer({
  name: "system-monitor-mcp",
  version: "1.0.0"
});

// Tool: Diagnose Performance - Main diagnostic tool
server.registerTool(
  "diagnose_performance",
  {
    title: "Diagnose Performance Issues",
    description: "Analyze current system performance and identify what's making your Mac slow",
    inputSchema: {
      detailed: z.boolean().optional().default(false).describe("Include detailed technical analysis"),
      timeframe: z.number().optional().default(60).describe("Analysis timeframe in seconds")
    }
  },
  async ({ detailed, timeframe }) => {
    try {
      console.error("🔍 Starting performance diagnosis...");
      
      // Get system snapshot
      const snapshot = await systemMonitor.getSystemSnapshot();
      
      // Get top processes
      const processes = await processAnalyzer.getTopProcesses();
      
      // Run diagnosis
      const diagnosis = await diagnosticEngine.diagnose(snapshot, processes, { detailed, timeframe });
      
      const result = formatDiagnosisResult(diagnosis);
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      console.error("Error in diagnose_performance:", error);
      return {
        content: [{
          type: "text",
          text: `エラーが発生しました: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Get System Snapshot - Current system stats
server.registerTool(
  "get_system_snapshot",
  {
    title: "Get System Snapshot",
    description: "Get current CPU, memory, disk, and network usage statistics",
    inputSchema: {}
  },
  async () => {
    try {
      console.error("📊 Getting system snapshot...");
      
      const snapshot = await systemMonitor.getSystemSnapshot();
      const formatted = formatSystemSnapshot(snapshot);
      
      return {
        content: [{
          type: "text",
          text: formatted
        }]
      };
    } catch (error) {
      console.error("Error in get_system_snapshot:", error);
      return {
        content: [{
          type: "text",
          text: `エラーが発生しました: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Analyze Processes - Process-specific analysis
server.registerTool(
  "analyze_processes",
  {
    title: "Analyze Running Processes",
    description: "Identify resource-heavy processes and their impact on performance",
    inputSchema: {
      sort_by: z.enum(["cpu", "memory", "name"]).optional().default("cpu").describe("Sort processes by"),
      limit: z.number().optional().default(10).describe("Number of processes to show")
    }
  },
  async ({ sort_by, limit }) => {
    try {
      console.error("🔄 Analyzing processes...");
      
      const analysis = await processAnalyzer.analyzeProcesses(sort_by, limit);
      
      let result = `## 📋 プロセス分析結果 (上位${limit}個、${sort_by}順)\n\n`;
      
      analysis.processes.forEach((proc, index) => {
        result += `**${index + 1}. ${proc.name}**\n`;
        result += `- CPU: ${proc.cpu_percent.toFixed(1)}%\n`;
        result += `- メモリ: ${(proc.memory_mb / 1024).toFixed(1)}GB\n`;
        result += `- PID: ${proc.pid}\n`;
        if (proc.description) {
          result += `- 説明: ${proc.description}\n`;
        }
        result += `- 影響度: ${proc.impact_level}\n\n`;
      });
      
      if (analysis.recommendations.length > 0) {
        result += `## 💡 推奨事項\n`;
        analysis.recommendations.forEach(rec => {
          result += `- ${rec}\n`;
        });
      }
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      console.error("Error in analyze_processes:", error);
      return {
        content: [{
          type: "text",
          text: `エラーが発生しました: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Kill Process - Safely terminate processes
server.registerTool(
  "kill_process",
  {
    title: "Kill Process",
    description: "Safely terminate a selected process (with confirmation)",
    inputSchema: {
      pid: z.number().describe("Process ID to terminate"),
      force: z.boolean().optional().default(false).describe("Force kill (use SIGKILL)")
    }
  },
  async ({ pid, force }) => {
    try {
      console.error(`🚫 Attempting to kill process ${pid}...`);
      
      const result = await processAnalyzer.killProcess(pid, force);
      
      return {
        content: [{
          type: "text",
          text: result.success 
            ? `✅ プロセス ${pid} を正常に終了しました。`
            : `❌ プロセス ${pid} の終了に失敗しました: ${result.error}`
        }]
      };
    } catch (error) {
      console.error("Error in kill_process:", error);
      return {
        content: [{
          type: "text",
          text: `エラーが発生しました: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool: Get Startup Apps - Login items
server.registerTool(
  "get_startup_apps",
  {
    title: "Get Startup Applications",
    description: "List applications that start automatically when you log in",
    inputSchema: {}
  },
  async () => {
    try {
      console.error("🚀 Getting startup applications...");
      
      const startupApps = await systemMonitor.getStartupApps();
      
      let result = `## 🚀 起動時アプリケーション\n\n`;
      
      if (startupApps.length === 0) {
        result += "起動時アプリケーションは設定されていません。\n";
      } else {
        startupApps.forEach((app, index) => {
          result += `${index + 1}. **${app.name}**\n`;
          if (app.path) {
            result += `   - パス: ${app.path}\n`;
          }
          result += `   - 状態: ${app.enabled ? '有効' : '無効'}\n\n`;
        });
        
        result += `\n💡 **最適化のヒント**: 不要な起動時アプリを無効にすると、Macの起動が高速化されます。\n`;
      }
      
      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      console.error("Error in get_startup_apps:", error);
      return {
        content: [{
          type: "text",
          text: `エラーが発生しました: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🖥️  System Monitor MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
