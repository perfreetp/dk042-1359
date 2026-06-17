import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useVerifyStore } from '@/store/useVerifyStore';
import { getUserInfo } from '@/data/mock';
import { getStatusColor, getStatusText } from '@/utils';
import type { VerifyRecord, UserInfo, VerifyStatus } from '@/types';

type FilterType = 'all' | VerifyStatus;

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pass', label: '可放行' },
  { value: 'warning', label: '需复核' },
  { value: 'danger', label: '禁止放行' },
  { value: 'info', label: '非寿命件' }
];

const MinePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [historyList, setHistoryList] = useState<VerifyRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const loadRecords = useVerifyStore(state => state.loadRecords);

  const loadData = useCallback(async () => {
    console.log('[MinePage] 加载个人数据');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = getUserInfo();
      setUserInfo(user);
      loadRecords();
      const state = useVerifyStore.getState();
      setHistoryList(state.verifyRecords);
    } catch (err) {
      console.error('[MinePage] 加载失败:', err);
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
    console.log('[MinePage] 页面显示');
    loadData();
  });

  usePullDownRefresh(() => {
    console.log('[MinePage] 下拉刷新');
    loadData();
  });

  const filteredList = activeFilter === 'all' 
    ? historyList 
    : historyList.filter(r => r.status === activeFilter);

  const stats = {
    total: historyList.length,
    pass: historyList.filter(r => r.status === 'pass').length,
    warning: historyList.filter(r => r.status === 'warning').length,
    danger: historyList.filter(r => r.status === 'danger').length
  };

  const handleHistoryClick = (record: VerifyRecord) => {
    console.log('[MinePage] 点击历史记录:', record.serialNumber);
    Taro.navigateTo({
      url: `/pages/detail/index?id=${record.id}`
    });
  };

  const handleMenuClick = (action: string) => {
    console.log('[MinePage] 点击菜单项:', action);
    Taro.showToast({ title: `${action}功能开发中`, icon: 'none' });
  };

  const menuItems = [
    { icon: '📱', title: '我的设备', desc: '查看绑定的手持设备', color: '#165DFF', badge: 0 },
    { icon: '📋', title: '操作手册', desc: '查看维修操作规范', color: '#00B42A', badge: 0 },
    { icon: '🔔', title: '消息通知', desc: 'MCC和航材控制岗通知', color: '#FF7D00', badge: 3 },
    { icon: '⚙️', title: '设置', desc: '应用设置与偏好', color: '#86909C', badge: 0 }
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userCard}>
          <View className={styles.avatar}>
            <Image 
              className={styles.avatarImg} 
              src={userInfo?.avatar || 'https://picsum.photos/id/64/200/200'}
              mode="aspectFill"
              onError={(e) => console.error('[MinePage] 头像加载失败:', e)}
            />
          </View>
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{userInfo?.name || '维修员'}</Text>
            <Text className={styles.userDept}>
              {userInfo?.department || '航线维修部'} · {userInfo?.employeeId || 'EMP2024001'}
            </Text>
            <Text className={styles.userRole}>{userInfo?.role || '放行人员'}</Text>
          </View>
        </View>

        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总核验</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.pass}</Text>
            <Text className={styles.statLabel}>已放行</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.warning}</Text>
            <Text className={styles.statLabel}>需复核</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.danger}</Text>
            <Text className={styles.statLabel}>禁止放行</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          {menuItems.map(item => (
            <View 
              key={item.title}
              className={styles.listItem}
              onClick={() => handleMenuClick(item.title)}
            >
              <View 
                className={styles.itemIcon} 
                style={{ backgroundColor: `${item.color}15` }}
              >
                {item.icon}
              </View>
              <View className={styles.itemContent}>
                <Text className={styles.itemTitle}>{item.title}</Text>
                <Text className={styles.itemDesc}>{item.desc}</Text>
              </View>
              {item.badge > 0 && (
                <View className={styles.itemBadge}>{item.badge}</View>
              )}
              <Text className={styles.itemArrow}>›</Text>
            </View>
          ))}
        </View>

        <View className={styles.historySection}>
          <Text className={styles.sectionTitle}>核验记录</Text>
          
          <ScrollView scrollX className={styles.filterBar}>
            {filters.map(filter => (
              <Text
                key={filter.value}
                className={classnames(
                  styles.filterItem,
                  activeFilter === filter.value && styles.active
                )}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
                {filter.value !== 'all' && (
                  <Text style={{ marginLeft: '8rpx' }}>
                    {filter.value === 'pass' ? stats.pass : 
                     filter.value === 'warning' ? stats.warning :
                     filter.value === 'danger' ? stats.danger :
                     historyList.filter(r => r.status === filter.value).length}
                  </Text>
                )}
              </Text>
            ))}
          </ScrollView>

          {isLoading ? (
            <View className={styles.loading}>
              <Text>加载中...</Text>
            </View>
          ) : filteredList.length > 0 ? (
            filteredList.map(record => (
              <View 
                key={record.id}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(record)}
              >
                <View 
                  className={styles.historyStatus} 
                  style={{ backgroundColor: getStatusColor(record.status) }}
                />
                <View className={styles.historyContent}>
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyPart}>{record.partName}</Text>
                    <View 
                      className={styles.historyBadge}
                      style={{ backgroundColor: getStatusColor(record.status) }}
                    >
                      {record.statusText}
                    </View>
                  </View>
                  <Text className={styles.historyMeta}>
                    {record.aircraftNo} · {record.position}
                  </Text>
                  <Text className={styles.historyTime}>
                    {record.verifyTime}
                  </Text>
                </View>
              </View>
            ))
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

export default MinePage;
