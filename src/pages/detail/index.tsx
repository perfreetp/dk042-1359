import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useVerifyStore } from '@/store/useVerifyStore';
import { getStatusColor } from '@/utils';
import type { VerifyRecord, PartInfo } from '@/types';
import { mockPartInfoList } from '@/data/mock';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const [record, setRecord] = useState<VerifyRecord | null>(null);
  const [partInfo, setPartInfo] = useState<PartInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const verifyRecords = useVerifyStore(state => state.verifyRecords);
  const loadRecords = useVerifyStore(state => state.loadRecords);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useDidShow(() => {
    console.log('[DetailPage] 页面显示');
    const id = router.params.id;
    console.log('[DetailPage] 记录ID:', id);
    loadData(id);
  });

  const loadData = async (id?: string) => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    console.log('[DetailPage] 加载详情，ID:', id);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const storeRecords = useVerifyStore.getState().verifyRecords;
      const foundRecord = storeRecords.find(r => r.id === id);
      
      if (foundRecord) {
        console.log('[DetailPage] 找到记录:', foundRecord.partName);
        setRecord(foundRecord);
        
        const part = mockPartInfoList.find(p => p.serialNumber === foundRecord.serialNumber);
        if (part) {
          setPartInfo(part);
        }
      }
    } catch (err) {
      console.error('[DetailPage] 加载失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatHours = (h: number): string => {
    if (h >= 99999) return '-';
    return h.toLocaleString('zh-CN');
  };

  const formatCycles = (c: number): string => {
    if (c >= 99999) return '-';
    return c.toLocaleString('zh-CN');
  };

  if (isLoading) {
    return (
      <ScrollView scrollY className={styles.page}>
        <View className={styles.loading}>
          <Text>加载中...</Text>
        </View>
      </ScrollView>
    );
  }

  if (!record || !partInfo) {
    return (
      <ScrollView scrollY className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>未找到核验记录</Text>
        </View>
      </ScrollView>
    );
  }

  const statusColor = getStatusColor(partInfo.status);
  const hoursRemaining = partInfo.remainingHours;
  const cyclesRemaining = partInfo.remainingCycles;

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        <View className={styles.statusCard} style={{ borderLeftColor: statusColor }}>
          <View className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
            <Text className={styles.statusText}>{partInfo.statusText}</Text>
          </View>
          
          <Text className={styles.partName}>{partInfo.partName}</Text>
          <Text className={styles.serialNumber}>序号：{partInfo.serialNumber}</Text>
          
          <View className={styles.lifeBadge}>
            <Text className={styles.lifeBadgeText}>
              {partInfo.isLifeControl ? '🔒 寿命控制件' : 'ℹ️ 非寿命控制件'}
            </Text>
          </View>

          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>剩余小时</Text>
              <Text className={classnames(
                styles.infoValue,
                hoursRemaining > 0 && hoursRemaining <= 200 && styles.warning,
                hoursRemaining <= 0 && styles.danger
              )}>
                {formatHours(hoursRemaining)}
                <Text className={styles.infoUnit}> FH</Text>
              </Text>
            </View>
            <View className={styles.divider} />
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>剩余循环</Text>
              <Text className={classnames(
                styles.infoValue,
                cyclesRemaining > 0 && cyclesRemaining <= 100 && styles.warning,
                cyclesRemaining <= 0 && styles.danger
              )}>
                {formatCycles(cyclesRemaining)}
                <Text className={styles.infoUnit}> FC</Text>
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>位置确认</Text>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>系统记录飞机号</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallAircraft}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>确认飞机号</Text>
            <Text className={classnames(
              styles.rowValue,
              record.aircraftNoInput.toUpperCase() === partInfo.lastInstallAircraft.toUpperCase() && styles.rowValueHighlight
            )}>
              {record.aircraftNoInput}
              {record.aircraftNoInput.toUpperCase() === partInfo.lastInstallAircraft.toUpperCase() ? ' ✓' : ' ✗'}
            </Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>系统记录位置</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallPosition}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>确认位置</Text>
            <Text className={classnames(
              styles.rowValue,
              record.positionInput === partInfo.lastInstallPosition && styles.rowValueHighlight
            )}>
              {record.positionInput}
              {record.positionInput === partInfo.lastInstallPosition ? ' ✓' : ' ✗'}
            </Text>
          </View>
        </View>

        {partInfo.melRestriction && (
          <View className={styles.warningSection}>
            <Text className={styles.warningTitle}>⚠️ MEL 限制</Text>
            <Text className={styles.warningText}>{partInfo.melRestriction}</Text>
          </View>
        )}

        {partInfo.cdlRestriction && (
          <View className={styles.dangerSection}>
            <Text className={styles.dangerTitle}>🚫 CDL 限制</Text>
            <Text className={styles.dangerText}>{partInfo.cdlRestriction}</Text>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>寿命信息</Text>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>总寿命小时</Text>
            <Text className={styles.rowValue}>{formatHours(partInfo.totalHours)} FH</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>总寿命循环</Text>
            <Text className={styles.rowValue}>{formatCycles(partInfo.totalCycles)} FC</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>件号</Text>
            <Text className={styles.rowValue}>{partInfo.partNumber}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>装机记录</Text>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>最近装机日期</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallDate}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>装机签署人</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallSigner}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>装机飞机</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallAircraft}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>装机位置</Text>
            <Text className={styles.rowValue}>{partInfo.lastInstallPosition}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>核验信息</Text>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>核验时间</Text>
            <Text className={styles.rowValue}>{record.verifyTime}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>核验人</Text>
            <Text className={styles.rowValue}>{record.verifyUser}</Text>
          </View>
          
          <View className={styles.infoRow}>
            <Text className={styles.rowLabel}>位置确认</Text>
            <Text className={classnames(
              styles.rowValue,
              record.positionConfirmed && styles.rowValueHighlight
            )}>
              {record.positionConfirmed ? '已确认 ✓' : '未确认 ✗'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailPage;
