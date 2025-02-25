<template>
  <div class="dashboard">
    <!-- 统计面板 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <h3>软件标识总数</h3>
          <p>{{ stats.totalIdentifiers }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>已注销标识</h3>
          <p>{{ stats.revokedIdentifiers }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>交易总数</h3>
          <p>{{ stats.totalTransactions }}</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <h3>智能合约调用</h3>
          <p>Issue: {{ stats.issueCount }}, Revoke: {{ stats.revokeCount }}, Update: {{ stats.updateCount }}</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新软件标识 -->
    <el-card class="recent-identifiers">
      <h3>最新软件标识</h3>
      <el-table :data="stats.recentIdentifiers" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="issuedAt" label="颁发时间" />
      </el-table>
    </el-card>

    <!-- 区块链数据折线图 -->
    <el-card class="chart-card">
      <h3>区块链数据趋势</h3>
      <el-radio-group v-model="timeRange" @change="fetchChartData">
        <el-radio-button label="24小时" />
        <el-radio-button label="7天" />
        <el-radio-button label="30天" />
      </el-radio-group>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <!-- 区块链网络拓扑图 -->
    <el-card class="network-topology">
      <h3>区块链网络拓扑</h3>
      <div ref="blockchainChartRef" class="chart-container"></div>
    </el-card>

    <!-- 交易筛选 -->
    <el-card class="filter-card">
      <h3>交易筛选</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="搜索交易哈希..." clearable @input="filterTransactions" />
        </el-col>
        <el-col :span="8">
          <el-select v-model="selectedTxType" placeholder="选择交易类型" clearable @change="filterTransactions">
            <el-option label="全部" value="" />
            <el-option label="标识注册" value="标识注册" />
            <el-option label="标识更新" value="标识更新" />
            <el-option label="标识查询" value="标识查询" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="selectedDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="filterTransactions"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 近期交易记录 -->
    <el-card class="transaction-table">
      <h3>近期交易记录</h3>
      <el-table :data="pagedTransactions" border style="width: 100%">
        <el-table-column prop="txHash" label="交易哈希" width="200" />
        <el-table-column prop="txType" label="交易类型" width="120" />
        <el-table-column prop="timestamp" label="交易时间" width="180" />
        <el-table-column prop="initiator" label="发起人" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" @click="viewTransaction(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredTransactions.length"
        @current-change="updatePagination"
        @size-change="updatePagination"
        layout="prev, pager, next, sizes, total"
      />
    </el-card>

    <!-- 交易详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="交易详情" width="50%">
      <pre>{{ selectedTransaction }}</pre>
      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import apiClient from "../api/Home.ts";

const stats = ref({
  totalIdentifiers: 100,
  revokedIdentifiers: 5,
  totalTransactions: 300,
  issueCount: 120,
  revokeCount: 50,
  updateCount: 130,
  recentIdentifiers: [
    { name: "App A", id: "ID123", issuedAt: "2025-02-20 12:30" },
    { name: "App B", id: "ID124", issuedAt: "2025-02-20 12:35" },
  ],
});

const transactions = ref([
  { txHash: "0x123", txType: "标识注册", timestamp: "2025-02-21 14:00", initiator: "User A" },
  { txHash: "0x124", txType: "标识更新", timestamp: "2025-02-21 15:00", initiator: "User B" },
]);

const filteredTransactions = ref([...transactions.value]);
const pagedTransactions = ref([]);
const searchQuery = ref("");
const selectedTxType = ref("");
const selectedDateRange = ref(null);
const dialogVisible = ref(false);
const selectedTransaction = ref(null);
const blockchainChartRef = ref(null); // 区块链拓扑图

const currentPage = ref(1);
const pageSize = ref(5);
let updateInterval = null;

const fetchBlockchainTopology = () => {
  const chart = echarts.init(blockchainChartRef.value);
  const nodes = [
    { name: "节点 A", category: "共识节点", value: 10 },
    { name: "节点 B", category: "共识节点", value: 8 },
    { name: "节点 C", category: "普通节点", value: 6 },
    { name: "节点 D", category: "普通节点", value: 5 },
    { name: "节点 E", category: "普通节点", value: 7 },
  ];

  const links = [
    { source: "节点 A", target: "节点 B" },
    { source: "节点 B", target: "节点 C" },
    { source: "节点 C", target: "节点 D" },
    { source: "节点 A", target: "节点 E" },
    { source: "节点 E", target: "节点 D" },
  ];

  const option = {
    title: { text: "区块链网络拓扑" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "graph",
        layout: "force",
        force: { repulsion: 150 },
        data: nodes.map((node) => ({
          name: node.name,
          category: node.category,
          symbolSize: node.value * 3,
          itemStyle: {
            color: node.category === "共识节点" ? "#ff5733" : "#3498db",
          },
        })),
        links,
        categories: [
          { name: "共识节点" },
          { name: "普通节点" },
        ],
        roam: true,
        label: { show: true, position: "right" },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [5, 10],
        lineStyle: { color: "#aaa", curveness: 0.3 },
      },
    ],
  };

  chart.setOption(option);
};

const chartRef = ref(null);
const timeRange = ref("24小时");
let chartInstance = null; // 确保实例可复用

const sampleData = {
  "24小时": {
    xAxis: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"],
    yAxis: [50, 60, 70, 65, 80, 95, 100],
  },
  "7天": {
    xAxis: ["2025-02-14", "2025-02-15", "2025-02-16", "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20"],
    yAxis: [200, 250, 230, 270, 290, 320, 330],
  },
  "30天": {
    xAxis: ["2025-01-21", "2025-01-22", "2025-01-23", "2025-01-24", "2025-01-25", "2025-01-26", "2025-01-27"],
    yAxis: [1200, 1300, 1100, 1150, 1400, 1350, 1500],
  },
};

// 初始化折线图
const initChart = () => {
  if (!chartRef.value) return; // 确保 DOM 已渲染
  chartInstance = echarts.init(chartRef.value);

  const option = {
    title: { text: "区块链数据趋势" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: sampleData["24小时"].xAxis,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: sampleData["24小时"].yAxis,
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  chartInstance.setOption(option);
};

// 更新折线图数据
const fetchChartData = () => {
  if (!chartInstance) return; // 确保图表实例已创建

  const data = sampleData[timeRange.value];

  chartInstance.setOption({
    xAxis: { data: data.xAxis },
    series: [{ data: data.yAxis }],
  });
};



onMounted(() => {
  fetchBlockchainTopology();

 
  initChart();
  
 
  console.log(chartRef.value)
  // 更新数据定时轮询
  updateInterval = setInterval(() => {
    // 模拟更新统计数据和交易数据
    fetchStats();
    filterTransactions();
  }, 60000);  // 每分钟更新一次


});

onUnmounted(() => {
  clearInterval(updateInterval); // 清理定时器
});

const fetchStats = () => {
  // 模拟请求数据更新
  stats.value.totalIdentifiers += 1;
  stats.value.totalTransactions += 1;
  // 更多的数据更新操作
};

const updatePagination = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  pagedTransactions.value = filteredTransactions.value.slice(start, end);
};

const viewTransaction = (row) => {
  selectedTransaction.value = row;
  dialogVisible.value = true;
};
</script>

<style scoped>
.request-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.request-button:hover {
  background-color: #45a049;
}

.response-data {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

.network-topology .chart-container {
  height: 400px;
}
</style>
