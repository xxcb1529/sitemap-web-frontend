<template>
  <NuxtLayout>
    <div class="container mx-auto py-10">
      <!-- 生成方式表单 -->
      <el-form>
        <el-form-item label="生成方式">
          <el-select v-model="mode" placeholder="请选择生成方式">
            <el-option label="自动爬取（输入首页链接）" value="auto" />
            <el-option label="手动输入页面URL" value="manual" />
            <el-option label="本地目录扫描" value="local" />
          </el-select>
        </el-form-item>

        <template v-if="mode === 'auto'">
          <el-form-item label="首页链接">
            <el-input v-model="autoForm.url" placeholder="请输入网站首页链接" />
          </el-form-item>
          <el-form-item label="最大递归深度">
            <el-input-number v-model="autoForm.maxDepth" :min="1" :max="10" />
          </el-form-item>
        </template>

        <template v-if="mode === 'manual'">
          <el-form-item label="页面URL">
            <div
              v-for="(url, idx) in manualForm.urls"
              :key="idx"
              style="display: flex; align-items: center"
            >
              <el-input v-model="manualForm.urls[idx]" style="width: 80%" />
              <el-button
                @click="removeUrl(idx)"
                type="danger"
                icon="el-icon-delete"
                circle
              />
            </div>
            <el-button @click="addUrl" type="primary" plain>添加URL</el-button>
          </el-form-item>
        </template>

        <template v-if="mode === 'local'">
          <el-form-item label="本地目录路径">
            <el-input v-model="localForm.dirPath" placeholder="如 D:/myweb" />
          </el-form-item>
          <el-form-item label="BaseUrl">
            <el-input
              v-model="localForm.baseUrl"
              placeholder="如 https://example.com"
            />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="submitting"
            >提交生成任务</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 当前任务进度 -->
      <div v-if="currentTaskId" style="margin: 20px 0">
        <el-progress
          :percentage="currentProgress"
          :status="
            currentStatus === 'fail'
              ? 'exception'
              : currentStatus === 'success'
              ? 'success'
              : undefined
          "
        />
        <div v-if="currentStatus === 'success'">
          <el-button type="success" @click="() => downloadResult()"
            >下载sitemap.xml</el-button
          >
        </div>
        <div v-if="currentStatus === 'fail'">
          <el-alert type="error" :title="currentError" />
        </div>
        <el-button @click="showLog = true" v-if="currentTaskId"
          >查看日志</el-button
        >
      </div>

      <!-- 历史任务列表 -->
      <div
        style="
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <h3>历史任务列表</h3>
        <el-button @click="fetchTaskList" :loading="refreshing"
          >刷新列表</el-button
        >
      </div>
      <el-table :data="taskList" style="margin-top: 10px">
        <el-table-column prop="id" label="任务ID" width="220" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="progress" label="进度" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :status="
                row.status === 'fail'
                  ? 'exception'
                  : row.status === 'success'
                  ? 'success'
                  : undefined
              "
              :stroke-width="10"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewTask(row)">查看</el-button>
            <el-button
              size="small"
              v-if="row.status === 'success'"
              @click="downloadResult(row.id)"
              >下载</el-button
            >
            <el-button size="small" @click="viewLog(row.id)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 日志弹窗 -->
      <el-dialog v-model="showLog" title="任务日志" width="600px">
        <el-scrollbar style="max-height: 400px">
          <div v-for="line in logLines" :key="line">{{ line }}</div>
        </el-scrollbar>
      </el-dialog>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

const mode = ref<"auto" | "manual" | "local">("auto");
const autoForm = ref({ url: "", maxDepth: 3 });
const manualForm = ref({ urls: [""] });
const localForm = ref({ dirPath: "", baseUrl: "" });
const submitting = ref(false);

const { $api } = useNuxtApp();

// 当前任务
const currentTaskId = ref("");
const currentProgress = ref(0);
const currentStatus = ref("");
const currentError = ref("");
const pollTimer = ref<any>(null);
const sitemapXml = ref("");

// 历史任务
const taskList = ref<any[]>([]);
const refreshing = ref(false);

// 日志弹窗
const showLog = ref(false);
const logLines = ref<string[]>([]);

function addUrl() {
  manualForm.value.urls.push("");
}
function removeUrl(idx: number) {
  manualForm.value.urls.splice(idx, 1);
}

async function onSubmit() {
  submitting.value = true;
  try {
    let params;
    if (mode.value === "auto") params = autoForm.value;
    else if (mode.value === "manual") params = manualForm.value;
    else if (mode.value === "local") params = localForm.value;

    const response = (await $api("/task/submit", {
      method: "POST",
      body: { type: mode.value, params },
    })) as { taskId: string };
    currentTaskId.value = response.taskId;
    pollTaskStatus(response.taskId);
    ElMessage.success("任务已提交！");
    // 提交任务后刷新列表
    await fetchTaskList();
  } catch (e: any) {
    ElMessage.error("提交失败");
  } finally {
    submitting.value = false;
  }
}

function pollTaskStatus(taskId: string) {
  if (pollTimer.value) clearInterval(pollTimer.value);
  pollTimer.value = setInterval(async () => {
    const res = (await $api("/task/status", { params: { taskId } })) as {
      progress: number;
      status: string;
      error?: string;
    };
    currentProgress.value = res.progress;
    currentStatus.value = res.status;
    currentError.value = res.error || "";
    if (res.status === "success" || res.status === "fail") {
      clearInterval(pollTimer.value);
      // 任务完成后刷新任务列表
      await fetchTaskList();
      if (res.status === "success") {
        // 可自动下载或展示
        downloadResult(taskId);
      }
    }
  }, 2000);
}

async function downloadResult(taskId?: string) {
  const id = taskId || currentTaskId.value;
  const xml = (await $api("/task/result", {
    params: { taskId: id },
  })) as string;
  // 触发浏览器下载
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  a.click();
  URL.revokeObjectURL(url);
}

async function viewTask(row: any) {
  currentTaskId.value = row.id;
  pollTaskStatus(row.id);
}

async function viewLog(taskId: string) {
  try {
    const res = (await $api("/task/log", { params: { taskId } })) as {
      log: string[];
      taskId: string;
    };
    console.log("日志响应:", res); // 调试信息
    logLines.value = res.log || [];
    showLog.value = true;
  } catch (error) {
    console.error("获取日志失败:", error);
    ElMessage.error("获取日志失败");
    logLines.value = [];
    showLog.value = true;
  }
}

async function fetchTaskList() {
  refreshing.value = true;
  try {
    const response = (await $api("/task/list")) as {
      tasks: any[];
      total: number;
    };
    taskList.value = response.tasks || [];
  } catch (error) {
    console.error("获取任务列表失败:", error);
    ElMessage.error("获取任务列表失败");
  } finally {
    refreshing.value = false;
  }
}

onMounted(() => {
  fetchTaskList();
});
</script>

<style lang="scss" scoped>
.el-select {
  width: 15rem;
}
</style>
