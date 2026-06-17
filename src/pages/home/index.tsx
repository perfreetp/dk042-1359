import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { TodoVerify, VerifyRecord, UserInfo } from '@/types';
import { getTodoList, getVerifyRecords, getUserInfo } from '@/data/mock';
import { getStatusColor, getPriorityColor, getPriorityText } from '@/utils';
import { useVerifyStore } from '@/store/useVerifyStore';

const HomePage: React.FC = () => {
  const [todoList, setTodoList] = useState<TodoVerify[]>([]);
  const [historyList, setHistoryList] = useState<VerifyRecord[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadRecords = useVerifyStore(state => state.loadRecords);

  const loadData = useCallback(async () => {
    console.log('[HomePage] 加载首页数据');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const todos = getTodoList();
      const records = getVerifyRecords();
      const user = getUserInfo();
      setTodoList(todos);
      setHistoryList(records.slice(0, 5));
      setUserInfo(user);
      loadRecords();
    } catch (err) {
      console.error('[HomePage] 加载数据失败:', err);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setIsLoading(false);
      Taro.stopPullDownRefresh();
    }
  }, [loadRecords]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDidShow(() => {
    console.log('[HomePage] 页面显示，刷新数据');
    loadData();
  });

  usePullDownRefresh(() => {
    console.log('[HomePage] 下拉刷新');
    loadData();
  });

  const handleQuickVerify = () => {
    console.log('[HomePage] 点击快速核验');
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const handleQuickReport = () => {
    console.log('[HomePage] 点击异常上报');
    Taro.switchTab({ url: '/pages/report/index' });
  };

  const handleTodoClick = (todo: TodoVerify) => {
    console.log('[HomePage] 点击待办:', todo.serialNumber);
    const verifyStore = useVerifyStore.getState();
    verifyStore.setSearchSerial(todo.serialNumber);
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const handleHistoryClick = (record: VerifyRecord) => {
    console.log('[HomePage] 点击历史记录:', record.serialNumber);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${record.id}`
    });
  };

  const handleViewAllHistory = () => {
    console.log('[HomePage] 查看全部历史');
    Taro.switchTab({ url: '/pages/mine/index' });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Image 
              className={styles.avatarImg} 
              src={userInfo?.avatar || 'https://picsum.photos/id/64/200/200'}
              mode="aspectFill"
              onError={(e) => console.error('[HomePage] 头像加载失败:', e)}
            />
          </View>
          <View className={styles.userText}>
            <Text className={styles.userName}>{userInfo?.name || '维修员'}</Text>
            <Text className={styles.userDept}>{userInfo?.department || '航线维修部'}</Text>
          </View>
        </View>

        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{todoList.length}</Text>
            <Text className={styles.statLabel}>待办核验</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{historyList.length}</Text>
            <Text className={styles.statLabel}>今日核验</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {historyList.filter(r => r.status === 'pass').length}
            </Text>
            <Text className={styles.statLabel}>已放行</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.quickActions}>
          <View 
            className={classnames(styles.quickAction, styles.quickActionPrimary)}
            onClick={handleQuickVerify}
          >
            <Text className={styles.quickIcon}>🔍</Text>
            <Text className={styles.quickTitle}>快速核验</Text>
            <Text className={styles.quickDesc}>扫描/输入序号</Text>
          </View>
          <View 
            className={classnames(styles.quickAction, styles.quickActionDanger)}
            onClick={handleQuickReport}
          >
            <Text className={styles.quickIcon}>📷</Text>
            <Text className={styles.quickTitle}>异常上报</Text>
            <Text className={styles.quickDesc}>拍照提交MCC</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>待办核验</Text>
          </View>

          {isLoading ? (
            <View className={styles.loading}>
              <Text>加载中...</Text>
            </View>
          ) : todoList.length > 0 ? (
            <View className={styles.todoList}>
              {todoList.slice(0, 3).map(todo => (
                <View 
                  key={todo.id} 
                  className={styles.todoItem}
                  onClick={() => handleTodoClick(todo)}
                >
                  <View 
                    className={styles.todoPriority} 
                    style={{ backgroundColor: getPriorityColor(todo.priority) }}
                  />
                  <View className={styles.todoContent}>
                    <View className={styles.todoAircraft}>
                      <Text className={styles.todoAircraftNo}>{todo.aircraftNo}</Text>
                      <Text style={{ 
                        fontSize: '22rpx', 
                        padding: '4rpx 12rpx', 
                        borderRadius: '4rpx',
                        backgroundColor: `rgba(${getPriorityColor(todo.priority).replace('#', '')}, 0.1)`,
                        color: getPriorityColor(todo.priority)
                      }}>
                        {getPriorityText(todo.priority)}
                      </Text>
                    </View>
                    <Text className={styles.todoPart}>{todo.partName}</Text>
                    <Text className={styles.todoPosition}>位置：{todo.position}</Text>
                    <Text className={styles.todoDeadline}>截止：{todo.deadline}</Text>
                  </View>
                  <Text className={styles.todoArrow}>›</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>✓</Text>
              <Text className={styles.emptyText}>暂无待办核验任务</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近核验记录</Text>
            <Text className={styles.sectionAction} onClick={handleViewAllHistory}>
              查看全部 ›
            </Text>
          </View>

          {historyList.length > 0 ? (
            <View className={styles.historySection}>
              {historyList.map(record => (
                <View 
                  key={record.id} 
                  className={styles.historyItem}
                  onClick={() => handleHistoryClick(record)}
                >
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyPart}>{record.partName}</Text>
                    <View 
                      className={styles.historyStatus}
                      style={{ backgroundColor: getStatusColor(record.status) }}
                    >
                      {record.statusText}
                    </View>
                  </View>
                  <Text className={styles.historyMeta}>
                    {record.aircraftNo} · {record.position} · {record.verifyTime}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无核验记录</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
