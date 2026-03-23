import { ref, onMounted, onUnmounted } from 'vue';

export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const message = ref<any>(null);
  const error = ref<string | null>(null);

  const connect = () => {
    try {
      socket.value = new WebSocket(url);
      
      socket.value.onopen = () => {
        isConnected.value = true;
        error.value = null;
      };
      
      socket.value.onmessage = (event) => {
        try {
          message.value = JSON.parse(event.data);
        } catch (e) {
          message.value = event.data;
        }
      };
      
      socket.value.onerror = (event) => {
        error.value = 'WebSocket连接错误';
      };
      
      socket.value.onclose = () => {
        isConnected.value = false;
      };
    } catch (e) {
      error.value = 'WebSocket连接失败';
    }
  };

  const send = (data: any) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(data));
      return true;
    }
    return false;
  };

  const close = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    close();
  });

  return {
    socket: socket.value,
    isConnected,
    message,
    error,
    send,
    connect,
    close
  };
}
