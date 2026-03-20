<template>
  <div class="user-recommendation">
    <!-- 页面标题 -->
    <el-page-header
      @back="handleBack"
      content="商品推荐"
    />
    
    <!-- 推荐场景切换 -->
    <div class="scene-switcher">
      <el-radio-group v-model="activeScene" size="large">
        <el-radio-button label="home">首页推荐</el-radio-button>
        <el-radio-button label="cart">购物车搭配</el-radio-button>
        <el-radio-button label="like">猜你喜欢</el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- 推荐商品列表 -->
    <div class="recommendation-grid">
      <el-card
        v-for="(product, index) in recommendedProducts"
        :key="product.id"
        class="product-card"
        :body-style="{ padding: '15px' }"
      >
        <div class="product-image">
          <img :src="product.image" alt="商品图片" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-price">¥{{ product.price }}</div>
          <div class="recommendation-reason">{{ product.reason }}</div>
          <div class="product-actions">
            <el-button type="primary" size="small" @click="addtoCart(product)">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-dropdown trigger="click">
              <el-button size="small">
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="markNotInterested(product)">
                    <el-icon><Close /></el-icon>
                    不感兴趣
                  </el-dropdown-item>
                  <el-dropdown-item @click="reportProduct(product)">
                    <el-icon><Warning /></el-icon>
                    举报
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 加载更多 -->
    <div class="load-more">
      <el-button type="primary" @click="loadMore" :loading="loading">
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, More, Close, Warning } from '@element-plus/icons-vue';

const router = useRouter();

// 响应式数据
const activeScene = ref('home');
const loading = ref(false);

// 模拟推荐商品数据
const recommendedProducts = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 9999,
    image: 'https://via.placeholder.com/200',
    reason: '根据您的浏览记录推荐'
  },
  {
    id: 2,
    name: 'AirPods Pro 2',
    price: 1999,
    image: 'https://via.placeholder.com/200',
    reason: '热门商品推荐'
  },
  {
    id: 3,
    name: 'MacBook Air M2',
    price: 7999,
    image: 'https://via.placeholder.com/200',
    reason: '基于您的兴趣推荐'
  },
  {
    id: 4,
    name: 'Apple Watch Series 9',
    price: 2999,
    image: 'https://via.placeholder.com/200',
    reason: '搭配您的其他设备'
  },
  {
    id: 5,
    name: 'iPad Pro 12.9',
    price: 8999,
    image: 'https://via.placeholder.com/200',
    reason: '热门商品推荐'
  },
  {
    id: 6,
    name: 'AirTag 4件装',
    price: 599,
    image: 'https://via.placeholder.com/200',
    reason: '基于您的兴趣推荐'
  }
]);

// 计算属性：根据当前场景过滤商品
const filteredProducts = computed(() => {
  // 实际项目中，这里应该根据场景调用不同的推荐接口
  return recommendedProducts.value;
});

// 方法
const handleBack = () => {
  router.back();
};

const addtoCart = (product) => {
  ElMessage.success(`已将 ${product.name} 加入购物车`);
};

const markNotInterested = (product) => {
  // 从推荐列表中移除该商品
  const index = recommendedProducts.value.findIndex(p => p.id === product.id);
  if (index !== -1) {
    recommendedProducts.value.splice(index, 1);
    ElMessage.success('已标记为不感兴趣');
  }
};

const reportProduct = (product) => {
  ElMessage.info('举报功能暂未实现');
};

const loadMore = () => {
  loading.value = true;
  // 模拟加载更多数据
  setTimeout(() => {
    const newProducts = [
      {
        id: recommendedProducts.value.length + 1,
        name: 'Apple Pencil 2',
        price: 999,
        image: 'https://via.placeholder.com/200',
        reason: '基于您的兴趣推荐'
      },
      {
        id: recommendedProducts.value.length + 2,
        name: 'Magic Keyboard',
        price: 1299,
        image: 'https://via.placeholder.com/200',
        reason: '搭配您的其他设备'
      }
    ];
    recommendedProducts.value = [...recommendedProducts.value, ...newProducts];
    loading.value = false;
    ElMessage.success('加载成功');
  }, 1000);
};
</script>

<style scoped>
.user-recommendation {
  padding: 20px;
}

.scene-switcher {
  margin-bottom: 20px;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
  border-radius: 4px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-name {
  font-size: 16px;
  margin: 0 0 10px 0;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 8px;
}

.recommendation-reason {
  font-size: 12px;
  color: #909399;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .recommendation-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .product-image {
    height: 150px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .product-price {
    font-size: 16px;
  }
}
</style>