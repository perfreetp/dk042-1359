import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { TodoVerify, VerifyRecord, UserInfo } from '@/types';
import { getUserInfo } from '@/data/mock';
import { getStatusColor, getPriorityColor, getPriorityText } from '@/utils';
import { useVerifyStore } from '@/store/useVerifyStore';

const HomePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const todoList = useVerifyStore(state => state.todoList);
  const verifyRecords = useVerifyStore(state => state.verifyRecords);
  const initStore = useVerifyStore(state => state.initStore);

  const pendingTodos = todoList.filter(t => !t.completed);
  const completedTodos = todoList.filter(t => t.completed);

  const loadData = useCallback(() => {
    initStore();
    const user = getUserInfo();
    setUserInfo(user);
  }, [initStore]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDidShow(() => {
    loadData();
  });

  usePullDownRefresh(() => {
    loadData();
    Taro.stopPullDownRefresh();
  });

  const handleQuickVerify = () => {
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const handleQuickReport = () => {
    Taro.switchTab({ url: '/pages/report/index' });
  };

  const handleTodoClick = (todo: TodoVerify) => {
    const verifyStore = useVerifyStore.getState();
    verifyStore.setSearchSerial(todo.serialNumber);
    verifyStore.setAircraftNo(todo.aircraftNo);
    verifyStore.setPosition(todo.position);
    verifyStore.setActiveTodoId(todo.id);
    Taro.switchTab({ url: '/pages/verify/index' });
  };

  const handleHistoryClick = (record: VerifyRecord) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${record.id}`
    });
  };

  const handleViewAllHistory = () => {
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
            <Text className={styles.statValue}>{pendingTodos.length}</Text>
            <Text className={styles.statLabel}>待办核验</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{verifyRecords.length}</Text>
            <Text className={styles.statLabel}>今日核验</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {verifyRecords.filter(r => r.status === 'pass' && !r.mismatchReason).length}
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
            {completedTodos.length > 0 && (
              <Text className={styles.sectionBadge}>
                已完成 {completedTodos.length}/{todoList.length}
              </Text>
            )}
          </View>

          {pendingTodos.length > 0 ? (
            <View className={styles.todoList}>
              {pendingTodos.slice(0, 5).map(todo => (
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
              <Text className={styles.emptyText}>
                {completedTodos.length > 0 ? '所有待办已完成' : '暂无待办核验任务'}
              </Text>
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

          {verifyRecords.length > 0 ? (
            <View className={styles.historySection}>
              {verifyRecords.slice(0, 5).map(record => (
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
                    {record.aircraftNoInput} · {record.positionInput} · {record.verifyTime}
                  </Text>
                  {record.mismatchReason && (
                    <Text className={styles.historyMismatch}>
                      ⚠️ {record.mismatchReason}
                    </Text>
                  )}
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
