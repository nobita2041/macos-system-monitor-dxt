# macOS System Monitor - Claude Desktop Extension

**Diagnose "Why is my Mac slow right now?" with accurate, user-friendly insights and actionable solutions.**

This Claude Desktop Extension provides Activity Monitor-level system diagnostics directly in Claude, helping you understand and optimize your Mac's performance with precision matching macOS built-in tools.

## ✨ Features

- **🔍 Performance Diagnosis**: Comprehensive analysis of CPU, memory, disk, and network usage
- **🎯 Smart Problem Detection**: Identifies specific performance bottlenecks and their solutions
- **📊 Activity Monitor Integration**: Results match macOS Activity Monitor and System Preferences
- **🚀 Process Analysis**: Identifies resource-heavy processes with safe termination options
- **⚡ Startup App Management**: Lists and analyzes auto-startup applications
- **🧠 Memory Intelligence**: Advanced memory pressure analysis with compression ratios

## 📦 Installation

### Option 1: Direct Installation (Recommended)

1. Download the latest `.dxt` file from the [Releases page](https://github.com/system-monitor-team/claude-desktop-system-monitor/releases)
2. Double-click the `.dxt` file to install in Claude Desktop
3. That's it! The extension is ready to use.

### Option 2: From Source

```bash
# Clone the repository
git clone https://github.com/system-monitor-team/claude-desktop-system-monitor.git
cd claude-desktop-system-monitor

# Install dependencies
npm install

# Build the extension
npm run build

# Install the DXT CLI tool (if not already installed)
npm install -g @anthropic-ai/dxt

# Create the .dxt package
dxt pack

# Install the generated .dxt file in Claude Desktop
open system-monitor-macos-1.0.0.dxt
```

## 🚀 Usage

Once installed, you can use the extension by asking Claude natural language questions:

### Example Queries

**Basic Performance Check:**

```
"Why is my Mac running slowly right now?"
```

**Detailed Analysis:**

```
"Can you give me a detailed system performance analysis with technical details?"
```

**Process Investigation:**

```
"What processes are using the most CPU and memory?"
```

**Memory Analysis:**

```
"Why is my memory usage so high? Show me the breakdown."
```

**Startup Optimization:**

```
"What apps are starting automatically when I log in?"
```

## 🛠️ Available Tools

The extension provides these tools for comprehensive system analysis:

### 1. `diagnose_performance`

- **Purpose**: Main diagnostic tool that answers "Why is my Mac slow?"
- **Output**: Comprehensive performance analysis with specific recommendations
- **Parameters**:
  - `detailed` (optional): Include technical details
  - `timeframe` (optional): Analysis timeframe in seconds

### 2. `get_system_snapshot`

- **Purpose**: Current system resource usage
- **Output**: CPU, memory, disk, and network statistics

### 3. `analyze_processes`

- **Purpose**: Identify resource-heavy processes
- **Output**: Top processes by CPU and memory usage with impact analysis

### 4. `kill_process`

- **Purpose**: Safely terminate problematic processes
- **Parameters**:
  - `pid`: Process ID to terminate
  - `name`: Process name for confirmation

### 5. `get_startup_apps`

- **Purpose**: List auto-startup applications
- **Output**: Applications that start at login with optimization suggestions

## ⚙️ Configuration

The extension supports user configuration through Claude Desktop's extension settings:

- **Monitoring Interval**: How often to check performance (30-3600 seconds, default: 60)
- **CPU Threshold**: Alert threshold for CPU usage (50-95%, default: 80%)
- **Memory Threshold**: Alert threshold for memory usage (70-95%, default: 85%)

## 🎯 Accuracy & Compatibility

This extension is specifically designed for macOS and provides results that match:

- **Activity Monitor**: CPU, memory, and process information
- **System Preferences > Storage**: Disk usage and categorization
- **Terminal Tools**: `vm_stat`, `memory_pressure`, `system_profiler`

### System Requirements

- **Platform**: macOS (Darwin) only
- **Architecture**: Intel (x64) and Apple Silicon (arm64)
- **Node.js**: Version 18.0.0 or higher
- **Claude Desktop**: Version 0.7.0 or higher

## 🔒 Privacy & Security

- **Local Processing**: All analysis runs locally on your Mac
- **No Data Collection**: No system information is sent to external services
- **Safe Operations**: Process termination includes safety confirmations
- **Minimal Permissions**: Only reads system information, no modifications

## 🐛 Troubleshooting

### Extension Won't Install

- Ensure you have Claude Desktop 0.7.0 or higher
- Check that you're running macOS
- Try restarting Claude Desktop

### Tools Not Available

- Verify the extension appears in Claude Desktop's Extensions settings
- Check that all permissions are granted
- Restart Claude Desktop if needed

### Inaccurate Results

- The extension uses the same APIs as Activity Monitor
- Differences may occur due to timing of measurements
- For troubleshooting, compare with Terminal commands: `vm_stat`, `top -l 1`

## 📚 Technical Details

### Architecture

- **MCP Protocol**: Uses Model Context Protocol for Claude integration
- **Node.js Runtime**: Built with systeminformation library for system access
- **DXT Format**: Packaged as Desktop Extension for one-click installation

### Data Sources

- **CPU**: Real-time usage via `systeminformation` and `top`
- **Memory**: Enhanced `vm_stat` parsing with Apple Silicon optimizations
- **Disk**: `system_profiler` and `df` commands for accurate capacity
- **Processes**: Live process monitoring with resource attribution

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone and setup
git clone https://github.com/system-monitor-team/claude-desktop-system-monitor.git
cd claude-desktop-system-monitor
npm install

# Run in development mode
npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector server/index.js
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Anthropic**: For the Claude Desktop Extension framework
- **MCP Community**: For the Model Context Protocol ecosystem
- **systeminformation**: For comprehensive system information access

---

**Made with ❤️ for Mac users who want to understand their system performance**
